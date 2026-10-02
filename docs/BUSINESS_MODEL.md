# Modelo de Negocio - ReclaMeli 💼

> **Micro-SaaS B2B de Auditoría Forense y Gestión de Compensaciones para Sellers de Mercado Libre Argentina.**

---

## 1. Resumen Ejecutivo y Propuesta de Valor

### El Problema Operativo
Los vendedores de Mercado Libre (MeLi) en Argentina sufren pérdidas sistemáticas en el circuito de logística inversa debido a falta de seguimiento y opacidad en las políticas de soporte:
1. **Devoluciones congeladas en tránsito:** El comprador despacha la devolución y MeLi le reembolsa el dinero de forma anticipada. El paquete queda inmovilizado en *"En camino"*.
   * **Plazo real de reclamo:** La ventana de reclamo se habilita **únicamente una vez vencida la fecha prometida de entrega** de la devolución (no antes).
   * **Límite duro de caducidad:** Pasados **60 días corridos desde la creación de la devolución**, MeLi ya no reconoce reclamos ni bonificaciones por demora.
2. **Devoluciones marcadas como "Entregadas" no recibidas:** Si el tracking marca entrega al vendedor pero este no recibió el paquete, existe una ventana de **30 días corridos desde esa supuesta entrega** para reclamar.
3. **Canal de reclamo estricto:** El reclamo debe iniciarse puntualmente desde el **detalle de la venta afectada** (`/ventas/{id}/detalle`) una vez vencida la fecha prometida, adjuntando datos fácticos (número de envío, fecha de despacho, último movimiento postal y estado).

---

### ⚠️ Hallazgo Crítico de Negocio (Validado con Soporte de MeLi)
En consultas directas a soporte de Mercado Libre, la plataforma sostiene textualmente:
> *"Lo que puede solicitarse por una demora es una bonificación; no es un reembolso del valor del producto."*

Asimismo, MeLi aclara que:
* No garantiza compensación automática solo por seguimiento congelado (cada caso queda sujeto a revisión).
* La compensación puede instrumentarse mediante crédito en Mercado Pago o emisión de Nota de Crédito por cargos/tarifas.

> [!WARNING] **Impacto sobre la Hipótesis Central del Negocio:**
> El modelo original asumía que el seller recupera el 100% del valor de venta del producto extraviado. Si MeLi únicamente liquida una **bonificación parcial por demora de flete**, el volumen de dinero recuperado real será inferior a las estimaciones preliminares. **Determinar el porcentaje real de liquidación (bonificación vs. valor completo) es la incógnita prioritaria que debe resolver el Caso Testigo en Fase 2.**

---

## 2. Segmentación de Clientes (ICP - Ideal Customer Profile)

| Segmento | Volumen Mensual | Perfil y Necesidad | Impacto Económico Estimado* |
|---|---|---|---|
| **Tier 1 (Core Target)** | > 500 envíos/mes | Sellers *Platinum y Gold* con alto flujo de logística inversa (Colecta / Full). | Acumulan decenas de paquetes demorados mensualmente. *(Monto neto sujeto a validación de bonificación vs reembolso)*. |
| **Tier 2 (Growth)** | 150 a 500 envíos/mes | Sellers en crecimiento sin personal administrativo dedicado a conciliar trackings. | Sufren la pérdida de capital de trabajo por devoluciones no reintegradas. |
| **Partners (Indirecto)** | Carteras de 10-30 cuentas | Consultores certificados y agencias integrales de MeLi. | Buscan optimizar el balance mensual de sus clientes auditando ineficiencias de soporte. |

*\*Nota: Las proyecciones monetarias quedan catalogadas como **hipótesis preliminar** hasta medir empíricamente los importes liquidados por MeLi.*

---

## 3. Arquitectura de Precios y Embudo (Estado: EN REVISIÓN)

Debido al hallazgo sobre las bonificaciones de MeLi, **el pricing final y la estructura de paywall quedan congelados hasta contar con datos empíricos de liquidación.**

```
[ Auditoría Diagnóstica ] 
         ↓ (Identifica trackings vencidos de fecha prometida dentro de la ventana de 60 días)
[ Caso Testigo / Fase Piloto ] 
         ↓ (Validar: ¿Cuánto paga MeLi en ARS respecto al valor del producto?)
[ Calibración de Modelo de Cobro ]
         ↓ (Fijar pricing acorde al valor económico real recuperado)
```

### Fase 1: Validación y Casos Testigo (Piloto Inicial)
* **Modalidad:** *Concierge Onboarding* con **Success Fee puro (10% al 15% del monto efectivamente liquidado)**.
* **Condición:** Reclamo asistido desde el detalle de la orden tras vencer la fecha prometida.
* **Cobro:** Únicamente contra la acreditación efectiva de fondos o nota de crédito comprobable.
* **Preguntas bloqueantes que este piloto debe responder:**
  1. ¿Mercado Libre indemniza el reclamo fáctico?
  2. **¿Cuánto paga exactamente?** ¿Reembolsa el valor de venta, el costo o una bonificación fija/variable de transporte?
  3. ¿Cómo lo liquida? ¿Saldo disponible en Mercado Pago o crédito para comisiones futuras?

### Fase 2: Escala Comercial (Provisoria - Sujeta a Calibración)
* **Diagnóstico Inicial:** Auditoría de reporte Excel/CSV para detectar órdenes con fecha prometida vencida antes del límite de 60 días.
* **Monetización (En definición):**
  * Si MeLi paga el **valor completo del producto** $\rightarrow$ Viable esquema de Packs fijos (\$29.900 - \$39.900 ARS) y Suscripción (\$49.000 ARS/mes).
  * Si MeLi paga solo una **bonificación simbólica por demora** $\rightarrow$ El pricing deberá reestructurarse a micro-tarifas por reclamo o Success Fee automatizado.
* **Política de Garantía:** **No se ofrecerá ninguna "Garantía de reembolso 100%"** hasta contar con la estadística real de pagos de soporte de MeLi.

---

## 4. Ventajas Competitivas y Moats

1. **Cumplimiento Estricto del Procedimiento MeLi:**
   * ReclaMeli no dispara reclamos a ciegas: audita que la **fecha prometida esté cumplida** y que el expediente esté dentro de los **60 días límite**, evitando rechazos automáticos de soporte.
2. **Generación del Dossier Quirúrgico:**
   * El expediente reúne los 4 datos obligatorios: número de venta/envío, fecha de despacho, estado/último movimiento y motivo fáctico.
3. **Enfoque No-API / Privacidad Total:**
   * Procesamiento local en navegador sobre reportes estándar que el seller ya posee, sin solicitar permisos invasivos de cuenta.

---

## 5. Estrategia de Adquisición (Go-To-Market)

1. **Enfoque Educativo y de Alerta Temprana:** Explicar a los sellers la regla no escrita: *"Pasados 60 días de la devolución, MeLi ya no reconoce reclamos ni bonificaciones"*.
2. **Auditoría de Demoras en 30 Segundos:** Demostración en vivo mediante la aplicación web para que el seller vea sus envíos en riesgo de caducar.
3. **Alianzas con Agencias y Gestores de Cuentas.**

---

## 6. Métricas Clave de Negocio (KPIs a Medir en Piloto)

* **Tasa de Resolución Favorable:** % de expedientes presentados que obtienen resolución económica de MeLi.
* **Ratio de Compensación Real (%):** $\frac{\text{Monto efectivamente liquidado por MeLi}}{\text{Valor de venta del producto}}$. (Métrica crítica para fijar el pricing final).
* **Plazo de Liquidación:** Días corridos desde la apertura del reclamo en el detalle de la venta hasta la acreditación.
