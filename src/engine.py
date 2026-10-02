"""Motor de Auditoría ReclaMeli."""
import pandas as pd
from datetime import datetime, timezone
from typing import Union
from pathlib import Path

from .models import DiscrepancyRecord, DiscrepancyType, AuditSummary
from .dossier import generate_claim_dossier, generate_navigation_guide

# Mapeo flexible de nombres de columnas usuales en exportaciones de Mercado Libre
COLUMN_ALIASES = {
    "order_id": ["id de la venta", "nro. de venta", "número de venta", "orden", "order_id", "código de la venta"],
    "tracking": ["número de envío", "nro de envio", "tracking", "código de seguimiento", "shipping_id"],
    "item_title": ["título de la publicación", "producto", "item_title", "detalle", "descripción"],
    "amount": ["total (ars)", "monto", "precio unitario", "total", "importe", "amount"],
    "status": ["estado de la venta", "estado", "status", "situación"],
    "return_status": ["estado del envío de la devolución", "estado de devolución", "return_status", "subestado"],
    "return_date": ["fecha de despacho de devolución", "fecha de devolución", "fecha envio", "return_date", "fecha de admisión"],
    "is_full": ["tipo de logística", "logística", "full", "es_full", "canal de envío"]
}

def _find_column(df: pd.DataFrame, aliases: list[str]) -> str | None:
    df_cols = {str(col).strip().lower(): col for col in df.columns}
    for alias in aliases:
        if alias in df_cols:
            return df_cols[alias]
    return None

class ReclaMeliEngine:
    def __init__(self, min_days_stalled: int = 15, max_claim_window_days: int = 30):
        self.min_days_stalled = min_days_stalled
        self.max_claim_window_days = max_claim_window_days

    def audit(self, data_or_path: Union[str, Path, pd.DataFrame], reference_date: datetime | None = None) -> AuditSummary:
        """Ejecuta la auditoría sobre un DataFrame o archivo Excel/CSV."""
        if reference_date is None:
            reference_date = datetime.now()

        if isinstance(data_or_path, (str, Path)):
            path = Path(data_or_path)
            if path.suffix.lower() in [".xlsx", ".xls"]:
                df = pd.read_excel(path)
            else:
                df = pd.read_csv(path)
        else:
            df = data_or_path.copy()

        # Identificar columnas
        col_order = _find_column(df, COLUMN_ALIASES["order_id"]) or "order_id"
        col_track = _find_column(df, COLUMN_ALIASES["tracking"]) or "tracking"
        col_title = _find_column(df, COLUMN_ALIASES["item_title"]) or "item_title"
        col_amount = _find_column(df, COLUMN_ALIASES["amount"]) or "amount"
        col_status = _find_column(df, COLUMN_ALIASES["status"]) or "status"
        col_ret_status = _find_column(df, COLUMN_ALIASES["return_status"]) or "return_status"
        col_ret_date = _find_column(df, COLUMN_ALIASES["return_date"]) or "return_date"
        col_full = _find_column(df, COLUMN_ALIASES["is_full"])

        discrepancies: list[DiscrepancyRecord] = []
        total_sales = len(df)

        for _, row in df.iterrows():
            order_id = str(row.get(col_order, "S/D"))
            tracking = str(row.get(col_track, "S/D"))
            title = str(row.get(col_title, "Producto sin título"))
            
            # Limpieza del monto
            try:
                raw_amount = str(row.get(col_amount, 0)).replace("$", "").replace(".", "").replace(",", ".")
                amount = float(raw_amount)
            except (ValueError, TypeError):
                amount = 0.0

            ret_status = str(row.get(col_ret_status, "")).strip().lower()
            sale_status = str(row.get(col_status, "")).strip().lower()

            # Parseo de fecha
            ret_date = row.get(col_ret_date)
            parsed_date = None
            if pd.notna(ret_date):
                try:
                    parsed_date = pd.to_datetime(ret_date).to_pydatetime()
                except Exception:
                    parsed_date = None

            # Es Full?
            is_full = False
            if col_full and pd.notna(row.get(col_full)):
                is_full = "full" in str(row.get(col_full)).lower()

            # Calcular días detenido
            days_stalled = 0
            if parsed_date:
                # Quitar timezone para cálculo uniforme
                parsed_naive = parsed_date.replace(tzinfo=None)
                ref_naive = reference_date.replace(tzinfo=None)
                days_stalled = max(0, (ref_naive - parsed_naive).days)

            days_to_expire = max(0, self.max_claim_window_days - days_stalled)

            # Regla 1: Siniestro confirmado pero venta cancelada sin acreditación
            if any(term in ret_status for term in ["siniestrado", "extraviado", "perdido"]):
                dossier = generate_claim_dossier(order_id, tracking, title, str(parsed_date)[:10], days_stalled, is_full)
                claim_url = f"https://www.mercadolibre.com.ar/ventas/{order_id}/detalle"
                discrepancies.append(
                    DiscrepancyRecord(
                        order_id=order_id,
                        tracking_code=tracking,
                        item_title=title,
                        amount=amount,
                        date_refunded=None,
                        date_return_dispatched=parsed_date,
                        days_stalled=days_stalled,
                        days_to_expire=days_to_expire,
                        discrepancy_type=DiscrepancyType.UNCREDITED_LOSS,
                        carrier_status=ret_status,
                        claim_url=claim_url,
                        dossier_text=dossier
                    )
                )
                continue

            # Regla 2: Devolución congelada en camino (Mercado Envíos tradicional o Full)
            # El comprador devolvió, pero nunca se marcó como 'entregado'
            is_in_transit = any(term in ret_status for term in ["en camino", "en tránsito", "demorado", "revisión", "en distribucion", "retirando"])
            is_delivered = any(term in ret_status for term in ["entregado", "devuelto al vendedor", "ingresado a stock"])

            if is_in_transit and not is_delivered and days_stalled >= self.min_days_stalled:
                # Si es Full y superó el tiempo
                disc_type = DiscrepancyType.FULL_STOCK_MISSING if is_full else DiscrepancyType.FROZEN_RETURN
                dossier = generate_claim_dossier(order_id, tracking, title, str(parsed_date)[:10], days_stalled, is_full)
                claim_url = f"https://www.mercadolibre.com.ar/ventas/{order_id}/detalle"

                discrepancies.append(
                    DiscrepancyRecord(
                        order_id=order_id,
                        tracking_code=tracking,
                        item_title=title,
                        amount=amount,
                        date_refunded=None,
                        date_return_dispatched=parsed_date,
                        days_stalled=days_stalled,
                        days_to_expire=days_to_expire,
                        discrepancy_type=disc_type,
                        carrier_status=ret_status,
                        claim_url=claim_url,
                        dossier_text=dossier
                    )
                )

        total_amount = sum(d.amount for d in discrepancies)
        expiring_soon = sum(1 for d in discrepancies if 0 < d.days_to_expire <= 7)

        return AuditSummary(
            total_sales_audited=total_sales,
            total_discrepancies=len(discrepancies),
            total_amount_recoverable=total_amount,
            critical_expiring_soon=expiring_soon,
            records=discrepancies
        )
