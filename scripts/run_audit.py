"""Script CLI para ejecutar una auditoría con ReclaMeli."""
import sys
from pathlib import Path
from tabulate import tabulate
import pandas as pd

# Agregar raíz al sys.path
sys.path.append(str(Path(__file__).parent.parent))

from src.engine import ReclaMeliEngine

def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/run_audit.py <ruta_del_reporte.xlsx>")
        sys.exit(1)

    file_path = Path(sys.argv[1])
    if not file_path.exists():
        print(f"❌ Error: El archivo {file_path} no existe.")
        sys.exit(1)

    print("\n🔍 Analizando reporte de ventas y devoluciones con ReclaMeli Engine...")
    engine = ReclaMeliEngine(min_days_stalled=15, max_claim_window_days=30)
    summary = engine.audit(file_path)

    print("\n" + "="*70)
    print("📊 RECLAMELI - REPORTE EJECUTIVO DE AUDITORÍA")
    print("="*70)
    print(f"Total de ventas analizadas:         {summary.total_sales_audited}")
    print(f"Inconsistencias detectadas:         {summary.total_discrepancies}")
    print(f"Monto Total Recuperable Estimado:   $ {summary.total_amount_recoverable:,.2f} ARS")
    print(f"⚠️  Casos con Vencimiento Inminente: {summary.critical_expiring_soon} (caducan en < 7 días)")
    print("="*70)

    if summary.records:
        table_data = []
        for r in summary.records:
            urgency = f"🚨 {r.days_to_expire} días" if r.days_to_expire <= 7 else f"{r.days_to_expire} días"
            table_data.append([
                r.order_id,
                r.item_title[:30] + "...",
                f"$ {r.amount:,.2f}",
                r.days_stalled,
                urgency,
                r.discrepancy_type.value
            ])

        headers = ["ID Venta", "Producto", "Monto", "Días Frenado", "Vence en", "Tipo de Problema"]
        print("\n" + tabulate(table_data, headers=headers, tablefmt="fancy_grid"))

        # Exportar resultado detallado a Excel
        out_excel = file_path.parent / f"reclameli_resultado_{file_path.stem}.xlsx"
        export_rows = []
        for r in summary.records:
            export_rows.append({
                "ID Venta": r.order_id,
                "Código de Seguimiento": r.tracking_code,
                "Producto": r.item_title,
                "Monto a Reclamar (ARS)": r.amount,
                "Días Inmóvil": r.days_stalled,
                "Días Restantes antes de Caducar": r.days_to_expire,
                "Tipo de Discrepancia": r.discrepancy_type.value,
                "Estado Postal Registrado": r.carrier_status,
                "Link Directo de Reclamo": r.claim_url,
                "Texto Irrefutable para Soporte (Ctrl+V)": r.dossier_text
            })
        
        pd.DataFrame(export_rows).to_excel(out_excel, index=False)
        print(f"\n📁 Reporte descargable con textos para reclamo generado en:\n👉 {out_excel.resolve()}\n")
    else:
        print("\n✅ No se encontraron inconsistencias en este archivo. Todas las devoluciones están al día.")

if __name__ == "__main__":
    main()
