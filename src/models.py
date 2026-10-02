"""Data models for ReclaMeli audit engine."""
from dataclasses import dataclass
from enum import Enum
from typing import Optional
from datetime import datetime

class DiscrepancyType(str, Enum):
    FROZEN_RETURN = "Devolución Congelada en Camino"
    UNCREDITED_LOSS = "Siniestro / Extravío No Indemnizado"
    FULL_STOCK_MISSING = "Faltante Interno en Depósito Full"
    EXPIRED_RISK = "Riesgo de Caducidad Inminente (<7 días)"

@dataclass
class DiscrepancyRecord:
    order_id: str
    tracking_code: str
    item_title: str
    amount: float
    date_refunded: Optional[datetime]
    date_return_dispatched: Optional[datetime]
    days_stalled: int
    days_to_expire: int
    discrepancy_type: DiscrepancyType
    carrier_status: str
    claim_url: str
    dossier_text: str

@dataclass
class AuditSummary:
    total_sales_audited: int
    total_discrepancies: int
    total_amount_recoverable: float
    critical_expiring_soon: int
    records: list[DiscrepancyRecord]
