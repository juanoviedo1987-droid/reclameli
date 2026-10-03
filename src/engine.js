// Motor ReclaMeli en Node.js
const fs = require('fs');
const path = require('path');
const { generateClaimDossier, generateNavigationGuide } = require('./dossier');

let xlsx = null;
try {
  xlsx = require('xlsx');
} catch (e) {
  // Opcional si no está instalado
}

const COLUMN_ALIASES = {
  orderId: ["# de venta", "id de la venta", "nro. de venta", "número de venta", "orden", "order_id", "código de la venta", "id"],
  tracking: ["número de seguimiento", "número de envío", "nro de envio", "tracking", "código de seguimiento", "shipping_id"],
  itemTitle: ["título de la publicación", "producto", "item_title", "detalle", "descripción", "titulo"],
  amount: ["total (ars)", "ingresos por productos (ars)", "monto", "precio unitario", "total", "importe", "amount"],
  status: ["estado", "estado de la venta", "status", "situación"],
  statusDesc: ["descripción del estado", "subestado"],
  refundAmount: ["anulaciones y reembolsos (ars)"],
  openClaim: ["reclamo abierto"],
  closedClaim: ["reclamo cerrado"],
  returnStatus: ["estado del envío de la devolución", "estado de devolución", "return_status", "subestado"],
  returnDate: ["fecha en camino", "fecha de despacho de devolución", "fecha de devolución", "fecha envio", "return_date", "fecha de admisión", "fecha"],
  returnDeliveredDate: ["fecha entregado", "fecha de entrega de devolución", "fecha entregada", "fecha recibido"],
  dueDate: ["fecha prometida", "fecha límite", "fecha limite", "fecha estimada de entrega", "fecha estimada", "due_date", "vencimiento", "fecha compromiso", "plazo de reclamo"],
  isFull: ["tipo de logística", "logística", "full", "es_full", "canal de envío", "forma de entrega"]
};

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  
  const sep = lines[0].includes(';') ? ';' : ',';
  
  // Encontrar fila de encabezados salteando banners
  let headerIdx = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const lower = lines[i].toLowerCase();
    if (lower.includes('# de venta') || lower.includes('id de la venta') || lower.includes('order_id')) {
      headerIdx = i;
      break;
    }
  }

  const headers = lines[headerIdx].split(sep).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const records = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const values = lines[i].split(sep).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    records.push(row);
  }
  return records;
}

function parseXLSX(filePath) {
  if (!xlsx) {
    throw new Error("El paquete 'xlsx' no está instalado. Ejecuta npm install xlsx.");
  }
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(20, rows.length); i++) {
    const row = rows[i];
    if (Array.isArray(row)) {
      const rowText = row.map(c => String(c).toLowerCase()).join(' ');
      if ((rowText.includes('# de venta') || rowText.includes('número de venta') || rowText.includes('orden de compra')) && row.filter(c => c !== '').length > 5) {
        headerRowIndex = i;
        break;
      }
    }
  }

  const headers = rows[headerRowIndex].map(h => String(h || '').trim());
  const records = [];
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0 || !r.some(c => c !== '')) continue;
    const rowObj = {};
    headers.forEach((h, idx) => {
      if (h) rowObj[h] = r[idx] !== undefined ? r[idx] : '';
    });
    records.push(rowObj);
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
    this.maxClaimWindowDays = options.maxClaimWindowDays || 60;
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

      const returnStatus = String(findKey(row, COLUMN_ALIASES.returnStatus) || findKey(row, COLUMN_ALIASES.statusDesc) || '').trim().toLowerCase();
      const saleStatus = String(findKey(row, COLUMN_ALIASES.status) || '').trim().toLowerCase();
      const rawFull = findKey(row, COLUMN_ALIASES.isFull);
      const isFull = rawFull ? String(rawFull).toLowerCase().includes('full') : false;

      // Parseo de fecha de despacho de devolución
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

      // Prioridad 1: Si el archivo trae 'due_date' o 'fecha prometida' por fila, usar ESE dato exacto
      const rawDueDate = findKey(row, COLUMN_ALIASES.dueDate);
      let daysToExpire = Math.max(0, this.maxClaimWindowDays - daysStalled);
      let hasExplicitDueDate = false;

      if (rawDueDate) {
        const parsedDue = new Date(rawDueDate);
        if (!isNaN(parsedDue.getTime())) {
          hasExplicitDueDate = true;
          const diffMs = parsedDue.getTime() - referenceDate.getTime();
          daysToExpire = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }
      }

      // Parseo de fecha de entrega de devolución
      const rawDeliveredDate = findKey(row, COLUMN_ALIASES.returnDeliveredDate);
      let returnDeliveredDate = null;
      if (rawDeliveredDate) {
        const p = new Date(rawDeliveredDate);
        if (!isNaN(p.getTime())) returnDeliveredDate = p;
      }

      const isDelivered = ['entregado', 'devuelto al vendedor', 'ingresado a stock', 'llegó'].some(t => returnStatus.includes(t) || saleStatus.includes(t)) || !!returnDeliveredDate;

      // Regla 0 (NUEVA): Plazo crítico de 3 días corridos tras entrega de la devolución
      if (isDelivered && returnDeliveredDate) {
        const diffMs = referenceDate.getTime() - returnDeliveredDate.getTime();
        const daysSinceDelivered = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        const dateDeliveredStr = returnDeliveredDate.toISOString().slice(0, 10);

        if (daysSinceDelivered <= 3) {
          const daysLeft3d = Math.max(0, 3 - daysSinceDelivered);
          const dossier = generateClaimDossier({ orderId, trackingCode: tracking, itemTitle, dateReturnDispatchedStr: dateDeliveredStr, daysStalled: daysSinceDelivered, isFull, type: 'three_day_review' });
          discrepancies.push({
            orderId,
            tracking,
            itemTitle,
            amount,
            daysStalled: daysSinceDelivered,
            daysToExpire: daysLeft3d,
            isThreeDayWindow: true,
            hasExplicitDueDate: false,
            discrepancyType: "Revisión Urgente (Plazo de 3 Días post-entrega)",
            carrierStatus: `Entregado hace ${daysSinceDelivered}d`,
            claimUrl: `https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
            navigationGuide: generateNavigationGuide(orderId, 'three_day_review'),
            dossierText: dossier
          });
          continue;
        }
      }

      // Regla 1: Siniestro confirmado pero no indemnizado
      const isSiniestro = ['siniestrado', 'extraviado', 'perdido'].some(t => returnStatus.includes(t) || saleStatus.includes(t));
      if (isSiniestro) {
        const dateStr = returnDate ? returnDate.toISOString().slice(0, 10) : 'S/F';
        const dossier = generateClaimDossier({ orderId, trackingCode: tracking, itemTitle, dateReturnDispatchedStr: dateStr, daysStalled, isFull, type: 'stalled' });
        discrepancies.push({
          orderId,
          tracking,
          itemTitle,
          amount,
          daysStalled,
          daysToExpire,
          isThreeDayWindow: false,
          hasExplicitDueDate,
          discrepancyType: "Siniestro / Extravío No Indemnizado",
          carrierStatus: returnStatus || saleStatus,
          claimUrl: `https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
          navigationGuide: generateNavigationGuide(orderId, 'stalled'),
          dossierText: dossier
        });
        continue;
      }

      // Regla 2: Devolución congelada en camino > minDaysStalled
      const isInTransit = ['en camino', 'en tránsito', 'demorado', 'revisión', 'en distribucion', 'retirando'].some(t => returnStatus.includes(t));

      if (isInTransit && !isDelivered && daysStalled >= this.minDaysStalled) {
        const discType = isFull ? "Faltante Interno en Depósito Full" : "Devolución Congelada en Camino";
        const dateStr = returnDate ? returnDate.toISOString().slice(0, 10) : 'S/F';
        const dossier = generateClaimDossier({ orderId, trackingCode: tracking, itemTitle, dateReturnDispatchedStr: dateStr, daysStalled, isFull, type: 'stalled' });

        discrepancies.push({
          orderId,
          tracking,
          itemTitle,
          amount,
          daysStalled,
          daysToExpire,
          isThreeDayWindow: false,
          hasExplicitDueDate,
          discrepancyType: discType,
          carrierStatus: returnStatus,
          claimUrl: `https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
          navigationGuide: generateNavigationGuide(orderId, 'stalled'),
          dossierText: dossier
        });
      }
    }

    const totalAmount = discrepancies.reduce((acc, d) => acc + d.amount, 0);
    const expiringSoon = discrepancies.filter(d => (d.isThreeDayWindow && d.daysToExpire <= 2) || (!d.isThreeDayWindow && d.daysToExpire > 0 && d.daysToExpire <= 10)).length;

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
    let records = [];

    if (ext === '.xlsx' || ext === '.xls') {
      records = parseXLSX(filePath);
    } else if (ext === '.json') {
      const content = fs.readFileSync(filePath, 'utf8');
      records = JSON.parse(content);
    } else if (ext === '.csv') {
      const content = fs.readFileSync(filePath, 'utf8');
      records = parseCSV(content);
    } else {
      throw new Error(`Formato no soportado directamente: ${ext}. Usa .xlsx, .xls o .csv`);
    }

    return this.auditRecords(records, referenceDate);
  }
}

module.exports = { ReclaMeliEngine, parseCSV, parseXLSX };
