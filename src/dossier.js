// Generador de Dossiers de Reclamo Fácticos para soporte de Mercado Libre

function generateClaimDossier({ orderId, trackingCode, itemTitle, dateReturnDispatchedStr, daysStalled, isFull = false }) {
  if (isFull) {
    return (
      `Solicito revisión de inventario y aplicación del Programa de Protección de Envíos Full (FPP) ` +
      `para la orden ${orderId} (${itemTitle}). ` +
      `La devolución fue remitida al centro de almacenamiento con fecha ${dateReturnDispatchedStr} ` +
      `y no registra reingreso al inventario vendible ni clasificación como descarte tras más de ${daysStalled} días. ` +
      `Solicito investigación de inventario y liquidación de la compensación correspondiente por extravío en depósito.`
    );
  }

  return (
    `Solicito formalmente la intervención logística y aplicación de la cobertura por extravío de Mercado Envíos ` +
    `para la orden ${orderId}. ` +
    `La devolución fue admitida por el correo el ${dateReturnDispatchedStr} (Tracking: ${trackingCode}) ` +
    `y el seguimiento postal permanece inmovilizado en 'En camino' desde hace ${daysStalled} días corridos, ` +
    `superando largamente el plazo de entrega comprometido. ` +
    `Habiéndose realizado el débito de los fondos hacia el comprador, intimo la anulación del cargo o indemnización ` +
    `de la venta a favor del vendedor bajo la póliza de seguro de transporte de la plataforma.`
  );
}

function generateNavigationGuide(orderId) {
  return [
    `1. Ingresar a: https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
    `2. Ir al pie de página y pulsar 'Ayuda con la venta' (o en los tres puntos 'Necesito ayuda').`,
    `3. Seleccionar: 'Tengo un problema con un envío' -> 'El paquete de la devolución está demorado / no llega' -> 'No recibí la devolución'.`,
    `4. ¡TRUCO CLAVE!: Cuando el bot responda diciendo que el paquete sigue en viaje y pregunte '¿Te sirvió esta información?', hacer clic en 'NO'.`,
    `5. Se habilitarán los botones para 'Chatear con nosotros' o 'Pedir que me llamen'. Pegar el texto del dossier.`
  ].join('\n');
}

module.exports = { generateClaimDossier, generateNavigationGuide };
