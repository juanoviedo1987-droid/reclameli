// Motor ReclaMeli en Node.js
const fs = require('fs');
const path = require('path');
const { generateClaimDossier, generateNavigationGuide } = require('./dossier');

const COLUMN_ALIASES = {
  orderId: ["id de la venta", "nro. de venta", "número de venta", "orden", "order_id", "código de la venta", "id"],
  tracking: ["número de envío", "nro de envio", "tracking", "código de seguimiento", "shipping_id"],
  itemTitle: ["título de la publicación", "producto", "item_title", "detalle", "descripción", "titulo"],
  amount: ["total (ars)", "monto", "precio unitario", "total", "importe", "amount"],
  status: ["estado de la venta", "estado", "status", "situación"],
  returnStatus: ["estado del envío de la devolución", "estado de devolución", "return_status", "subestado"],
  returnDate: ["fecha de despacho de devolución", "fecha de devolución", "fecha envio", "return_date", "fecha de admisión", "fecha"],
  isFull: ["tipo de logística", "logística", "full", "es_full", "canal de envío"]
};

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  
  // Detect separator: comma or semicolon
  const headerLine = lines[0];
  const sep = headerLine.includes(';') ? ';' : ',';
  
  const headers = headerLine.split(sep).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(sep).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    records.push(row);
  }
  return records;
}

function findKey(row, aliases) {
  const rowKeys = Object.keys(row);
  for (const alias of aliases) {
    const found = rowKeys.find(k => k.trim().toLowerCase() === alias.toLowerCase());
    if (found) return row[found];
  }
  return null;
}

class ReclaMeliEngine {
  constructor(options = {}) {
    this.minDaysStalled = options.minDaysStalled || 15;
    this.maxClaimWindowDays = options.maxClaimWindowDays || 30;
  }

  auditRecords(records, referenceDate = new Date()) {
    const discrepancies = [];
    const totalSales = records.length;

    for (const row of records) {
      const orderId = String(findKey(row, COLUMN_ALIASES.orderId) || 'S/D');
      const tracking = String(findKey(row, COLUMN_ALIASES.tracking) || 'S/D');
      const itemTitle = String(findKey(row, COLUMN_ALIASES.itemTitle) || 'Producto sin título');
      
      let amount = 0;
      const rawAmount = findKey(row, COLUMN_ALIASES.amount);
      if (rawAmount) {
        const cleaned = String(rawAmount).replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
        amount = parseFloat(cleaned) || 0;
      }

      const returnStatus = String(findKey(row, COLUMN_ALIASES.returnStatus) || '').trim().toLowerCase();
      const rawFull = findKey(row, COLUMN_ALIASES.isFull);
      const isFull = rawFull ? String(rawFull).toLowerCase().includes('full') : false;

      const rawDate = findKey(row, COLUMN_ALIASES.returnDate);
      let returnDate = null;
      let daysStalled = 0;

      if (rawDate) {
        const parsed = new Date(rawDate);
        if (!isNaN(parsed.getTime())) {
          returnDate = parsed;
          const diffMs = referenceDate.getTime() - parsed.getTime();
          daysStalled = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }
      }

      const daysToExpire = Math.max(0, this.maxClaimWindowDays - daysStalled);

      // Regla 1: Siniestro confirmado pero no indemnizado
      const isSiniestro = ['siniestrado', 'extraviado', 'perdido'].some(t => returnStatus.includes(t));
      if (isSiniestro) {
        const dateStr = returnDate ? returnDate.toISOString().slice(0, 10) : 'S/F';
        const dossier = generateClaimDossier({ orderId, trackingCode: tracking, itemTitle, dateReturnDispatchedStr: dateStr, daysStalled, isFull });
        discrepancies.push({
          orderId,
          tracking,
          itemTitle,
          amount,
          daysStalled,
          daysToExpire,
          discrepancyType: "Siniestro / Extravío No Indemnizado",
          carrierStatus: returnStatus,
          claimUrl: `https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
          navigationGuide: generateNavigationGuide(orderId),
          dossierText: dossier
        });
        continue;
      }

      // Regla 2: Devolución congelada en camino > minDaysStalled
      const isInTransit = ['en camino', 'en tránsito', 'demorado', 'revisión', 'en distribucion', 'retirando'].some(t => returnStatus.includes(t));
      const isDelivered = ['entregado', 'devuelto al vendedor', 'ingresado a stock'].some(t => returnStatus.includes(t));

      if (isInTransit && !isDelivered && daysStalled >= this.minDaysStalled) {
        const discType = isFull ? "Faltante Interno en Depósito Full" : "Devolución Congelada en Camino";
        const dateStr = returnDate ? returnDate.toISOString().slice(0, 10) : 'S/F';
        const dossier = generateClaimDossier({ orderId, trackingCode: tracking, itemTitle, dateReturnDispatchedStr: dateStr, daysStalled, isFull });

        discrepancies.push({
          orderId,
          tracking,
          itemTitle,
          amount,
          daysStalled,
          daysToExpire,
          discrepancyType: discType,
          carrierStatus: returnStatus,
          claimUrl: `https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
          navigationGuide: generateNavigationGuide(orderId),
          dossierText: dossier
        });
      }
    }

    const totalAmount = discrepancies.reduce((acc, d) => acc + d.amount, 0);
    const expiringSoon = discrepancies.filter(d => d.daysToExpire > 0 && d.daysToExpire <= 7).length;

    return {
      totalSalesAudited: totalSales,
      totalDiscrepancies: discrepancies.length,
      totalAmountRecoverable: totalAmount,
      criticalExpiringSoon: expiringSoon,
      records: discrepancies
    };
  }

  auditFile(filePath, referenceDate = new Date()) {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');
    let records = [];

    if (ext === '.json') {
      records = JSON.parse(content);
    } else if (ext === '.csv') {
      records = parseCSV(content);
    } else {
      throw new Error(`Formato no soportado directamente en modo puro: ${ext}. Usa .csv o .json`);
    }

    return this.auditRecords(records, referenceDate);
  }
}

module.exports = { ReclaMeliEngine, parseCSV };
