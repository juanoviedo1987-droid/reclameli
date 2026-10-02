"""Generador de Dossiers de Reclamo Fácticos para soporte de Mercado Libre."""

def generate_claim_dossier(
    order_id: str,
    tracking_code: str,
    item_title: str,
    date_return_dispatched_str: str,
    days_stalled: int,
    is_full: bool = False
) -> str:
    """Genera el texto estructurado irrefutable para presentar ante soporte."""
    if is_full:
        return (
            f"Solicito revisión de inventario y aplicación del Programa de Protección de Envíos Full (FPP) "
            f"para la orden {order_id} ({item_title}). "
            f"La devolución fue remitida al centro de almacenamiento con fecha {date_return_dispatched_str} "
            f"y no registra reingreso al inventario vendible ni clasificación como descarte tras más de {days_stalled} días. "
            f"Solicito investigación de inventario y liquidación de la compensación correspondiente por extravío en depósito."
        )

    return (
        f"Solicito formalmente la intervención logística y aplicación de la cobertura por extravío de Mercado Envíos "
        f"para la orden {order_id}. "
        f"La devolución fue admitida por el correo el {date_return_dispatched_str} (Tracking: {tracking_code}) "
        f"y el seguimiento postal permanece inmovilizado en 'En camino' desde hace {days_stalled} días corridos, "
        f"superando largamente el plazo de entrega comprometido. "
        f"Habiéndose realizado el débito de los fondos hacia el comprador, intimo la anulación del cargo o indemnización "
        f"de la venta a favor del vendedor bajo la póliza de seguro de transporte de la plataforma."
    )


def generate_navigation_guide(order_id: str) -> str:
    """Genera la ruta paso a paso para sortear el bot y hablar con un operador humano."""
    return (
        f"1. Ingresar a: https://www.mercadolibre.com.ar/ventas/{order_id}/detalle\n"
        f"2. Ir al pie de página y pulsar 'Ayuda con la venta' (o en los tres puntos 'Necesito ayuda').\n"
        f"3. Seleccionar: 'Tengo un problema con un envío' -> 'El paquete de la devolución está demorado / no llega' -> 'No recibí la devolución'.\n"
        f"4. ¡TRUCO CLAVE!: Cuando el bot responda diciendo que el paquete sigue en viaje y pregunte '¿Te sirvió esta información?', hacer clic en 'NO'.\n"
        f"5. Se habilitarán los botones para 'Chatear con nosotros' o 'Pedir que me llamen'. Pegar el texto del dossier."
    )
