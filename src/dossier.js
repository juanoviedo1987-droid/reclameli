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
    `y el seguimiento postal permanece inmovilizado en 'En camino' habiendo superado la fecha prometida de entrega comprometida. ` +
    `Habiéndose realizado el débito de los fondos hacia el comprador y encontrándose el reclamo dentro del plazo de 60 días, ` +
    `solicito la indemnización/bonificación correspondiente a favor del vendedor bajo la póliza de transporte de la plataforma.`
  );
}

function generateNavigationGuide(orderId) {
  return [
    `1. Ingresar puntualmente a: https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
    `2. VERIFICACIÓN PREVIA: Asegurarse de que la fecha prometida de entrega de la devolución esté cumplida/vencida (soporte desestima el reclamo si la fecha estimada está vigente).`,
    `3. Ir al pie de página y pulsar 'Ayuda con la venta' (o en los tres puntos 'Necesito ayuda').`,
    `4. Seleccionar: 'Tengo un problema con un envío' -> 'El paquete de la devolución está demorado / no llega' -> 'No recibí la devolución'.`,
    `5. Si el bot responde diciendo que el paquete sigue en viaje y pregunta '¿Te sirvió esta información?', probá hacer clic en 'NO' para intentar derivar a un operador humano o pedir llamada.`,
    `6. Una vez habilitado el chat o la llamada, pegar el texto del dossier.`
  ].join('\n');
}

module.exports = { generateClaimDossier, generateNavigationGuide };
