# Modelo de Negocio - ReclaMeli 💼

> **Micro-SaaS B2B de Auditoría Forense y Recupero de Fondos para Sellers de Mercado Libre Argentina.**

---

## 1. Resumen Ejecutivo y Propuesta de Valor

### El Problema
Los vendedores de Mercado Libre (MeLi) en Argentina operan con márgenes cada vez más ajustados y sufren una pérdida sistemática e invisible: **entre el 2% y el 5% de su facturación bruta anual queda retenida o perdida** debido a:
1. **Devoluciones congeladas en tránsito:** El comprador despacha el producto, MeLi le reembolsa el dinero anticipadamente, pero el paquete queda congelado en estado *"En camino"* en el correo. Pasados **30 días corridos**, MeLi archiva la orden y el dinero se pierde definitivamente.
2. **Merma oculta en Mercado Envíos Full:** Mercadería devuelta que ingresa al centro de distribución (Villa Madero) pero jamás se reingresa al inventario vendible ni se indemniza automáticamente.
3. **Siniestros no compensados:** Paquetes declarados siniestrados o extraviados por la colecta/correo donde no se emite la compensación correspondiente en Mercado Pago.
4. **Fricción del soporte automatizado:** El bot de MeLi desvía las quejas indicando *"el paquete sigue en camino"*; el 60% de los sellers abandona el reclamo por falta de tiempo o desconocimiento de la normativa interna de la plataforma.

### La Solución
**ReclaMeli** audita en segundos los reportes estándar de ventas y devoluciones (Excel/CSV) que el seller ya descarga de la plataforma, detecta con precisión matemática cada peso retenido y genera un **Dossier Fáctico de Reclamo** con los textos normativos, enlaces directos y el instructivo exacto (incluyendo el hack del botón "NO") para sortear el bot y forzar la indemnización humana inmediata.

---

## 2. Segmentación de Clientes (ICP - Ideal Customer Profile)

| Segmento | Características | Volumen Mensual | Nivel de Dolor |
|---|---|---|---|
| **Tier 1 (Core Target)** | Sellers *MercadoLíder Platinum y Gold* que usan Mercado Envíos Colecta y Full. | > 500 envíos/mes | **Crítico:** Acumulan entre \$500.000 y \$3.000.000 ARS mensuales en mercadería retenida. |
| **Tier 2 (Growth)** | Sellers *MercadoLíder* medianos en crecimiento, sin departamento de conciliación administrativa. | 150 a 500 envíos/mes | **Alto:** Cada devolución no recuperada afecta sensiblemente su flujo de caja semanal. |
| **Canal Indirecto (Partners)** | Consultores certificados de Mercado Libre y agencias de gestión de cuentas (3PL / Ads). | Gestionan carteras de 10-30 cuentas | Buscan ofrecer a sus clientes una herramienta de alto impacto para justificar sus honorarios mensuales. |

---

## 3. Arquitectura de Precios y Embudo de Monetización

Para eliminar el riesgo de cobranza y la desconfianza del seller argentino, se define una estrategia en dos fases:

```
[ Auditoría Gratuita ] 
         ↓ (Detecta ej. $1.500.000 ARS retenidos)
[ Caballo de Troya ] 
         ↓ (Desbloqueo de 1 caso de alto valor GRATIS -> Seller cobra $60.000 en 48 hs)
[ Paywall de Desbloqueo ]
         ↓ (Paga Pack $39.900 ARS para desbloquear los otros 9 dossiers con la plata recién cobrada)
[ Suscripción SaaS Recurrente ]
           ($49.000 ARS/mes para auditorías continuas y prevención de los 30 días)
```

### Fase 1: Validación y Casos Testigo (Primeros 5 Sellers)
* **Modalidad:** *Concierge Onboarding* con **Success Fee puro (10% al 15%)**.
* **Condición:** Acompañamiento asistido en vivo (llamada de 15 min o guía directa) para garantizar que el seller ejecute el reclamo correctamente.
* **Cobro:** Únicamente contra la acreditación efectiva del dinero en su cuenta de Mercado Pago.
* **Objetivo estratégico:** 
  * Validar la tasa de éxito de cobro real (apuntando al 80%-90%).
  * Ajustar las plantillas del dossier frente a las respuestas reales de soporte.
  * Obtener métricas comprobables y testimonios en video/capturas de pantalla para marketing.

### Fase 2: Escala Comercial (Teaser + Caballo de Troya + Paywall)

#### Paso A: Diagnóstico Teaser (100% Gratuito)
* El seller sube su archivo Excel/CSV sin registro previo ni permisos invasivos de API.
* El motor analiza los datos en < 30 segundos y muestra una pantalla de impacto:
  > *"Detectamos **\$1.850.000 ARS** en 14 reclamos recuperables en riesgo de caducidad."*

#### Paso B: El "Caballo de Troya" (Derribo de la Desconfianza)
* Se desbloquea de forma **100% gratuita el dossier del reclamo de mayor valor individual** (ej. una orden de \$60.000 ARS).
* El seller lo presenta en soporte siguiendo el instructivo paso a paso.
* Al recibir el dinero en su cuenta en 48-72 hs, la barrera de desconfianza queda destruida: el producto probó su valor con dinero real en mano.

#### Paso C: Packs de Desbloqueo y Suscripción (Monetización Directa)
Los dossiers restantes se entregan mediante pago por adelantado (vía Mercado Pago Checkout):

1. **Pack "Rescate de Lote" (Pago Único por Auditoría):**
   * **Precio sugerido:** **\$29.900 a \$39.900 ARS**.
   * **Propuesta:** Recupera entre \$300.000 y \$2.000.000 ARS con un ROI de 10x a 50x inmediato.
   * **Garantía Blindada (Riesgo Cero):** Si Mercado Libre rechaza un caso imputable a un error del dossier, se reembolsa el 100% del pago.

2. **Plan "Monitoreo Preventivo" (Suscripción Mensual SaaS):**
   * **Precio sugerido:** **\$49.000 ARS / mes** (o abono trimestral bonificado).
   * **Incluye:**
     * Auditorías semanales ilimitadas.
     * Alertas de semáforo (Verde: < 10 días, Amarillo: 10-20 días, Rojo URGENTE: 21-29 días).
     * Soporte prioritario con actualizaciones de cambios en las políticas de MeLi.
     * Dossiers ejecutables ilimitados.

---

## 4. Ventajas Competitivas y Barreras de Entrada (Moats)

1. **Cero Fricción de Integración (No-API First):**
   * Las herramientas tradicionales exigen permisos OAuth completos de la cuenta de Mercado Libre, lo que genera rechazo inmediato por miedo al baneo, robo de datos o suspensión.
   * ReclaMeli opera sobre exportes de Excel que el seller ya tiene a mano: privacidad total, sin riesgo para la cuenta.
2. **Especialización Forense en Jurisprudencia de MeLi Argentina:**
   * No es un simple dashboard visual; es un motor de litigio administrativo que conoce los programas internos (FPP en Full, primer escaneo en Tradicional, plazos de 30 días, notas de crédito de ajuste).
3. **El Dossier Fáctico:**
   * Soporte de MeLi rechaza reclamos genéricos. Los dossiers de ReclaMeli citan número de envío, fecha de primer escaneo, tracking congelado, artículos de los Términos y Condiciones de Mercado Envíos y el texto exacto listo para pegar.

---

## 5. Estrategia de Adquisición (Go-To-Market)

1. **Outbound Quirúrgico a Sellers Platinum:** Identificación de vendedores líderes en categorías de alta tasa de devolución (Indumentaria, Calzado, Autopartes, Electrónica). Oferta: *"Te auditamos gratis el último trimestre en 2 minutos"*.
2. **Comunidades y Grupos de Sellers:** Participación en grupos de Facebook ("Vendedores de Mercado Libre Argentina"), foros y canales de Telegram/WhatsApp compartiendo tips operativos reales y ofreciendo el diagnóstico gratuito.
3. **Alianzas con Consultores MeLi:** Comisión del 20% recurrente para consultores y agencias que incorporen ReclaMeli dentro de su servicio mensual a sellers.

---

## 6. Métricas Clave de Negocio (KPIs)

* **Tasa de Recupero:** % de expedientes presentados que resultan en indemnización o nota de crédito (Meta: > 80%).
* **Tiempo Promedio de Indemnización:** Días desde la presentación del dossier hasta el cobro en Mercado Pago (Meta: < 5 días hábiles).
* **Conversión Teaser -> Pago Único:** % de usuarios que desbloquean el lote completo tras el diagnóstico gratuito (Meta: > 25%).
* **Conversión Pago Único -> Suscripción:** % de usuarios que pasan a la suscripción mensual tras recuperar su primer lote (Meta: > 35%).
* **LTV / CAC:** Ratio proyectado superior a 4:1 debido a la bajísima tasa de churn en sellers con alto volumen de devoluciones.
