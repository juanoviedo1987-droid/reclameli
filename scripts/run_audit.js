// Runner CLI para ejecutar auditorías en Node.js
const fs = require('fs');
const path = require('path');
const { ReclaMeliEngine } = require('../src/engine');

function formatCurrency(num) {
  return '$ ' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function main() {
  const args = process.argv.slice(2);
  const defaultFile = path.join(__dirname, '..', 'data', 'samples', 'sample_ventas_meli.csv');
  const targetFile = args[0] || defaultFile;

  if (!fs.existsSync(targetFile)) {
    console.error(`❌ Error: El archivo ${targetFile} no existe.`);
    process.exit(1);
  }

  console.log(`\n🔍 Analizando archivo: ${path.basename(targetFile)} con ReclaMeli Engine...`);
  const engine = new ReclaMeliEngine({ minDaysStalled: 15, maxClaimWindowDays: 30 });
  const summary = engine.auditFile(targetFile);

  console.log('\n' + '='.repeat(70));
  console.log('📊 RECLAMELI - REPORTE EJECUTIVO DE AUDITORÍA');
  console.log('='.repeat(70));
  console.log(`Total de ventas analizadas:         ${summary.totalSalesAudited}`);
  console.log(`Inconsistencias detectadas:         ${summary.totalDiscrepancies}`);
  console.log(`Monto Total Recuperable Estimado:   ${formatCurrency(summary.totalAmountRecoverable)} ARS`);
  console.log(`⚠️  Casos con Vencimiento Inminente: ${summary.criticalExpiringSoon} (caducan en < 7 días)`);
  console.log('='.repeat(70));

  if (summary.records.length > 0) {
    console.log('\n📋 DETALLE DE OPERACIONES PARA RECLAMO:\n');
    summary.records.forEach((r, idx) => {
      const urgencyBadge = r.daysToExpire <= 7 ? `🚨 ¡URGENTE! Vence en ${r.daysToExpire} días` : `Vence en ${r.daysToExpire} días`;
      console.log(`[#${idx + 1}] ORDEN: ${r.orderId} | TRACKING: ${r.tracking}`);
      console.log(`    Producto:    ${r.itemTitle}`);
      console.log(`    Monto:       ${formatCurrency(r.amount)} ARS`);
      console.log(`    Problema:    ${r.discrepancyType} (${r.daysStalled} días inmóvil)`);
      console.log(`    Estado:      ${r.carrierStatus}`);
      console.log(`    Caducidad:   ${urgencyBadge}`);
      console.log(`    Link Directo: ${r.claimUrl}`);
      console.log(`    Texto Reclamo (Ctrl+C):\n    "${r.dossierText}"`);
      console.log('-'.repeat(70));
    });

    // Guardar reporte JSON descargable
    const outJson = path.join(path.dirname(targetFile), `reclameli_resultado_${path.basename(targetFile, path.extname(targetFile))}.json`);
    fs.writeFileSync(outJson, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`\n📁 Reporte descargable generado en:\n👉 ${outJson}\n`);
  } else {
    console.log('\n✅ No se encontraron inconsistencias. Todas las devoluciones están al día.');
  }
}

main();
