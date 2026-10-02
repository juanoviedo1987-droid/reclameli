"""Pruebas unitarias para el motor de ReclaMeli."""
import pytest
import pandas as pd
from datetime import datetime, timedelta
from src.engine import ReclaMeliEngine
from src.models import DiscrepancyType

def test_engine_detects_frozen_return():
    today = datetime.now()
    df = pd.DataFrame([{
        "ID de la venta": "1001",
        "Número de envío": "TRK1001",
        "Título de la publicación": "Item de prueba",
        "Total (ARS)": "50000",
        "Estado del envío de la devolución": "En camino",
        "Fecha de devolución": (today - timedelta(days=20)).strftime("%Y-%m-%d"),
        "Tipo de logística": "Mercado Envíos"
    }])

    engine = ReclaMeliEngine(min_days_stalled=15, max_claim_window_days=30)
    summary = engine.audit(df, reference_date=today)

    assert summary.total_discrepancies == 1
    assert summary.total_amount_recoverable == 50000.0
    rec = summary.records[0]
    assert rec.discrepancy_type == DiscrepancyType.FROZEN_RETURN
    assert rec.days_stalled == 20
    assert rec.days_to_expire == 10
    assert "TRK1001" in rec.dossier_text

def test_engine_ignores_delivered_returns():
    today = datetime.now()
    df = pd.DataFrame([{
        "ID de la venta": "1002",
        "Número de envío": "TRK1002",
        "Título de la publicación": "Item entregado",
        "Total (ARS)": "30000",
        "Estado del envío de la devolución": "Entregado al vendedor",
        "Fecha de devolución": (today - timedelta(days=25)).strftime("%Y-%m-%d"),
        "Tipo de logística": "Mercado Envíos"
    }])

    engine = ReclaMeliEngine()
    summary = engine.audit(df, reference_date=today)
    assert summary.total_discrepancies == 0

def test_engine_detects_full_inventory_missing():
    today = datetime.now()
    df = pd.DataFrame([{
        "ID de la venta": "1003",
        "Número de envío": "TRK1003",
        "Título de la publicación": "Item en Full",
        "Total (ARS)": "75000",
        "Estado del envío de la devolución": "En revisión",
        "Fecha de devolución": (today - timedelta(days=19)).strftime("%Y-%m-%d"),
        "Tipo de logística": "Full"
    }])

    engine = ReclaMeliEngine(min_days_stalled=15)
    summary = engine.audit(df, reference_date=today)

    assert summary.total_discrepancies == 1
    rec = summary.records[0]
    assert rec.discrepancy_type == DiscrepancyType.FULL_STOCK_MISSING
    assert "FPP" in rec.dossier_text
