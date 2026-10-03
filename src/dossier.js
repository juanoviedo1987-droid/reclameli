// Generador de Dossiers de Reclamo Fácticos para soporte de Mercado Libre

function generateClaimDossier({ orderId, trackingCode, itemTitle, dateReturnDispatchedStr, daysStalled, isFull = false, type = 'stalled' }) {
  if (type === 'three_day_review') {
    return (
      `Informo que la devolución de la orden ${orderId} (${itemTitle}) figura entregada con fecha ${dateReturnDispatchedStr}. ` +
      `Dentro del plazo reglamentario de 3 días corridos de revisión del vendedor, constato disconformidad con lo recibido: ` +
      `[Seleccionar motivo: el producto presenta roturas/daños / el paquete llegó vacío / recibí un producto diferente / no recibí la mercadería]. ` +
      `Solicito la retención preventiva del reembolso al comprador y la intervención de mediación para aplicar la cobertura al vendedor.`
    );
  }

  if (type === 'delivered_not_received') {
    return (
      `Informo que la devolución de la orden ${orderId} figura con estado 'Entregada' con fecha ${dateReturnDispatchedStr}, ` +
      `pero el paquete físico NO fue recibido en el domicilio del vendedor. ` +
      `Dentro del plazo reglamentario de 30 días corridos desde la fecha de entrega informada, ` +
      `solicito la investigación formal del envío con el transportista y la aplicación de la cobertura por extravío en última milla a favor del vendedor.`
    );
  }

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

function generateNavigationGuide(orderId, type = 'stalled') {
  if (type === 'three_day_review') {
    return [
      `1. Ingresar de inmediato a: https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
      `2. 🚨 ALERTA DE 3 DÍAS: Disponés de 72 horas corridas desde la entrega para reportar problemas antes de que MeLi libere el dinero al comprador de forma irreversible.`,
      `3. Ir al pie de página y pulsar 'Ayuda con la venta' -> 'Tengo un problema con la devolución' -> 'El producto llegó dañado / incompleto / recibí otro producto'.`,
      `4. Adjuntar fotos nítidas del paquete, etiqueta de envío del correo y del contenido recibido.`,
      `5. Si el bot responde evasivamente, hacer clic en 'NO' a '¿Te sirvió esta información?' para forzar la mediación humana.`
    ].join('\n');
  }

  if (type === 'delivered_not_received') {
    return [
      `1. Ingresar a: https://www.mercadolibre.com.ar/ventas/${orderId}/detalle`,
      `2. VERIFICACIÓN: Comprobar que figura 'Entregado' pero no superó los 30 días corridos desde esa fecha.`,
      `3. Ir a 'Ayuda con la venta' -> 'Tengo un problema con un envío' -> 'Figura entregado pero no lo tengo'.`,
      `4. Si el bot responde diciendo que ya fue entregado y pregunta '¿Te sirvió esta información?', probá hacer clic en 'NO' para intentar derivar a un operador humano.`,
      `5. Pegar el texto del dossier intimando la investigación de entrega.`
    ].join('\n');
  }

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
