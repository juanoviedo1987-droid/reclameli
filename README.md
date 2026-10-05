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

**ReclaMeli** es un Micro-SaaS B2B que cruza los reportes exportados de Mercado Libre en segundos, detecta discrepancias de dinero no recuperado según los plazos reglamentarios (revisión en 72hs, fecha prometida y límite general de 60 días), y genera un **Dossier de Reclamo Fáctico** con los enlaces y textos exactos para contactar a soporte de Mercado Libre y exigir la compensación económica.

---

## 🧠 Lógica de Detección

El motor aplica reglas determinísticas sobre los reportes:

| Caso | Regla de Detección | Acción Generada / Plazo Crítico |
|---|---|---|
| **🚨 Revisión Urgente Post-Entrega** | `Tracking = Entregado` + `≤ 3 días corridos (72hs)` | Intimación preventiva de retención de fondos al comprador por mercadería dañada, incompleta o cambiada. **Plazo crítico: 72 horas corridas**. |
| **Devolución Congelada en Tránsito** | `Tracking = En camino` + `Fecha prometida de entrega vencida` | Reclamo desde el detalle de la venta una vez vencida la fecha prometida. **Límite duro: 60 días corridos** desde creación de la devolución. |
| **Devolución Figura Entregada (No Recibida)** | `Tracking = Entregado` + `Vendedor no recibió paquete` | Reclamo formal por entrega no recibida física. Ventana: **hasta 30 días corridos** desde la supuesta entrega. |
| **Siniestro / Extravío Confirmado** | `Estado = Siniestrado / Extraviado` + `Compensación = NO` | Reclamo directo por póliza de flete de Mercado Envíos. Límite: **60 días corridos**. |
| **Faltante en Full** | `Devolución ingresada al CD` + `Alta en stock = NO (> 15 días)` | Intimación por *Programa de Protección Full (FPP)* para compensación de inventario en depósito. |

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

## 🛡️ Tasa de Éxito y Compensación (Hipótesis a Validar en Fase 2)
* **Vendedor pasivo (espera automática):** Riesgo de caducidad total al cumplirse los 60 días sin reclamo.
* **Vendedor con auditoría formal:** **[Tasa no confirmada — Sujeta a validación en caso testigo real]**.
* ⚠️ **Pregunta crítica abierta del negocio:** Según información de soporte oficial de MeLi, ante una demora prolongada puede corresponder una *bonificación* y no necesariamente el reembolso del 100% del valor del producto. La Fase 2 validará empíricamente **cuánto** paga MeLi respecto al valor de venta y mediante qué mecanismo (Mercado Pago o Nota de Crédito).

---
*Desarrollado para el ecosistema de e-commerce de Argentina.*
