"""Generador de datos sintéticos realistas de Mercado Libre Argentina para pruebas."""
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path

def generate_mock_report(output_path: str = "data/samples/reporte_ventas_mock.xlsx"):
    today = datetime.now()

    records = [
        # Ventas normales entregadas sin problema
        {
            "ID de la venta": "2000008912345671",
            "Número de envío": "43920192831",
            "Título de la publicación": "Auriculares Inalámbricos Bluetooth Pro F9",
            "Total (ARS)": "$ 34.500",
            "Estado de la venta": "Entregado",
            "Estado del envío de la devolución": "",
            "Fecha de devolución": "",
            "Tipo de logística": "Mercado Envíos"
        },
        {
            "ID de la venta": "2000008912345672",
            "Número de envío": "43920192832",
            "Título de la publicación": "Funda Silicona Antigolpe iPhone 15 Pro",
            "Total (ARS)": "$ 18.200",
            "Estado de la venta": "Entregado",
            "Estado del envío de la devolución": "",
            "Fecha de devolución": "",
            "Tipo de logística": "Mercado Envíos"
        },
        # Caso 1: Devolución congelada en camino (hace 24 días) -> RIESGO DE CADUCIDAD INMINENTE (quedan 6 días!)
        {
            "ID de la venta": "2000008912345680",
            "Número de envío": "43920192840",
            "Título de la publicación": "Zapatillas Deportivas Running Talle 42",
            "Total (ARS)": "$ 86.400",
            "Estado de la venta": "Cancelada",
            "Estado del envío de la devolución": "En camino a sucursal",
            "Fecha de devolución": (today - timedelta(days=24)).strftime("%Y-%m-%d"),
            "Tipo de logística": "Mercado Envíos"
        },
        # Caso 2: Devolución congelada en camino (hace 18 días)
        {
            "ID de la venta": "2000008912345681",
            "Número de envío": "43920192841",
            "Título de la publicación": "Smartwatch Reloj Inteligente Sumergible IP68",
            "Total (ARS)": "$ 54.000",
            "Estado de la venta": "Cancelada",
            "Estado del envío de la devolución": "En tránsito por correo",
            "Fecha de devolución": (today - timedelta(days=18)).strftime("%Y-%m-%d"),
            "Tipo de logística": "Mercado Envíos"
        },
        # Caso 3: Siniestro confirmado por transporte pero venta no indemnizada
        {
            "ID de la venta": "2000008912345682",
            "Número de envío": "43920192842",
            "Título de la publicación": "Taladro Inalámbrico Percutor 20V + Maletín",
            "Total (ARS)": "$ 142.000",
            "Estado de la venta": "Cancelada",
            "Estado del envío de la devolución": "Extraviado por el transportista",
            "Fecha de devolución": (today - timedelta(days=21)).strftime("%Y-%m-%d"),
            "Tipo de logística": "Mercado Envíos"
        },
        # Caso 4: Faltante interno en Full (hace 22 días)
        {
            "ID de la venta": "2000008912345683",
            "Número de envío": "43920192843",
            "Título de la publicación": "Cafetera Express Automática Acero Inoxidable",
            "Total (ARS)": "$ 210.000",
            "Estado de la venta": "Cancelada",
            "Estado del envío de la devolución": "En revisión en depósito Full",
            "Fecha de devolución": (today - timedelta(days=22)).strftime("%Y-%m-%d"),
            "Tipo de logística": "Full"
        },
        # Caso 5: Devolución normal que SÍ llegó al vendedor (no debe reportarse)
        {
            "ID de la venta": "2000008912345684",
            "Número de envío": "43920192844",
            "Título de la publicación": "Remera Algodón Peinado Manga Corta",
            "Total (ARS)": "$ 22.000",
            "Estado de la venta": "Cancelada",
            "Estado del envío de la devolución": "Entregado al vendedor",
            "Fecha de devolución": (today - timedelta(days=12)).strftime("%Y-%m-%d"),
            "Tipo de logística": "Mercado Envíos"
        }
    ]

    df = pd.DataFrame(records)
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(out, index=False)
    print(f"✅ Archivo de prueba generado exitosamente en: {out.resolve()}")

if __name__ == "__main__":
    generate_mock_report()
