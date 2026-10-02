# ReclaMeli 🚀
> **Motor determinístico de auditoría y recupero de fondos en Mercado Libre Argentina.**

[![GitHub](https://img.shields.io/badge/GitHub-juanoviedo1987--droid%2Freclameli-blue?logo=github)](https://github.com/juanoviedo1987-droid/reclameli)
[![Demo Online](https://img.shields.io/badge/Demo%20Online-GitHub%20Pages-emerald?logo=githubpages)](https://juanoviedo1987-droid.github.io/reclameli/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-green)](https://www.python.org/)

---

## 📌 Visión del Proyecto

En Mercado Libre Argentina, cuando un comprador inicia una devolución o reclamo, la plataforma ejecuta el reembolso de manera anticipada. Sin embargo, en el circuito logístico inverso:
1. **Mercado Envíos Tradicional:** Paquetes despachados por el comprador quedan congelados en estado *"En camino"* por semanas o meses, sin llegar a manos del vendedor.
2. **Mercado Envíos Full:** Devoluciones que ingresan al centro de distribución (Villa Madero) pero jamás son reingresadas al stock disponible para la venta (*merma oculta*).

**ReclaMeli** es un Micro-SaaS B2B que cruza los reportes exportados de Mercado Libre en segundos, detecta discrepancias de dinero no recuperado antes de la ventana de caducidad (30 días), y genera un **Dossier de Reclamo Fáctico** con los enlaces y textos exactos para perforar el bot de soporte de Mercado Libre y forzar la indemnización económica.

---

## 🧠 Lógica de Detección

El motor aplica reglas determinísticas sobre los reportes:

| Caso | Regla de Detección | Acción Generada |
|---|---|---|
| **Devolución Congelada** | `Reembolso = SÍ` + `Primer escaneo = SÍ` + `Tracking = En camino` + `Días inactivo > 15` | Alerta urgente con días restantes para los 30 días de caducidad. |
| **Siniestro No Acreditado** | `Estado = Siniestrado / Extraviado` + `Compensación MP = NO` | Reclamo directo por póliza de flete de Mercado Envíos. |
| **Faltante en Full** | `Devolución ingresada al CD` + `Alta en stock = NO (> 15 días)` | Intimación por *Programa de Protección Full (FPP)* para compensación de inventario. |

---

## 📂 Estructura del Repositorio

```text
reclameli/
├── src/
│   ├── __init__.py
│   ├── models.py            # Esquemas de datos (Venta, Devolución, Siniestro)
│   ├── engine.py            # Motor analítico de cruce de reportes
│   └── dossier.py           # Generador de plantillas de reclamo fácticas
├── data/
│   └── samples/             # Muestras sintéticas y reales de reportes
├── scripts/
│   ├── generate_sample.py   # Generador de datos de prueba para validación
│   └── run_audit.py         # Runner CLI para auditar archivos
├── tests/
│   └── test_engine.py       # Pruebas unitarias
├── requirements.txt
└── README.md
```

---

## 🚀 Inicio Rápido

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/juanoviedo1987-droid/reclameli.git
cd reclameli
pip install -r requirements.txt
```

### 2. Generar datos de prueba sintéticos
```bash
python scripts/generate_sample.py
```

### 3. Ejecutar la auditoría
```bash
python scripts/run_audit.py data/samples/reporte_ventas_mock.xlsx
```

---

## 🛡️ Tasa de Éxito de Reclamo (Ground Truth)
* **Vendedor pasivo (espera automática):** 35% - 45% de éxito.
* **Vendedor con ReclaMeli (dossier fáctico en término):** **80% - 90% de éxito**.

---
*Desarrollado para el ecosistema de e-commerce de Argentina.*
