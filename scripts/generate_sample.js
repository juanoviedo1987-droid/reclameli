// Generador de datos de prueba sintéticos en CSV para ReclaMeli
const fs = require('fs');
const path = require('path');

function generateSampleCSV() {
  const now = new Date();
  
  function getPastDate(daysAgo) {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }

  const rows = [
    // Encabezados estándar de exportación de Mercado Libre
    "ID de la venta,Número de envío,Título de la publicación,Total (ARS),Estado de la venta,Estado del envío de la devolución,Fecha de devolución,Tipo de logística",
    
    // Ventas normales sin problema
    `2000008912345671,43920192831,Auriculares Bluetooth F9 In-Ear,$ 34.500,Entregado,,,Mercado Envíos`,
    `2000008912345672,43920192832,Funda Silicona Antigolpe iPhone 15,$ 18.200,Entregado,,,Mercado Envíos`,
    
    // Caso 1: Devolución congelada en camino (hace 24 días) -> RIESGO DE CADUCIDAD INMINENTE (quedan 6 días!)
    `2000008912345680,43920192840,Zapatillas Running Talle 42,$ 86.400,Cancelada,En camino a sucursal,${getPastDate(24)},Mercado Envíos`,
    
    // Caso 2: Devolución congelada en camino (hace 18 días)
    `2000008912345681,43920192841,Smartwatch Reloj Sumergible IP68,$ 54.000,Cancelada,En tránsito por correo,${getPastDate(18)},Mercado Envíos`,
    
    // Caso 3: Siniestro confirmado pero no indemnizado (hace 21 días)
    `2000008912345682,43920192842,Taladro Percutor 20V + Maletín,$ 142.000,Cancelada,Extraviado por el transportista,${getPastDate(21)},Mercado Envíos`,
    
    // Caso 4: Faltante interno en Full (hace 22 días)
    `2000008912345683,43920192843,Cafetera Express Automática Inox,$ 210.000,Cancelada,En revisión en depósito Full,${getPastDate(22)},Full`,
    
    // Caso 5: Devolución normal que ya llegó al vendedor (no debe alertar)
    `2000008912345684,43920192844,Remera Algodón Peinado Manga Corta,$ 22.000,Cancelada,Entregado al vendedor,${getPastDate(12)},Mercado Envíos`
  ];

  const targetDir = path.join(__dirname, '..', 'data', 'samples');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, 'sample_ventas_meli.csv');
  fs.writeFileSync(filePath, rows.join('\n'), 'utf8');
  console.log('✅ Archivo de prueba generado exitosamente en:', filePath);
}

generateSampleCSV();
