# Roadmap de Ejecución - ReclaMeli 🎯

> **Plan de acción lean: validación operativa y técnica antes de inversión en marca.**

---

## Resumen del Flujo de Fases

```
[ FASE 1: Motor Funcional sin Marca ]
  (Parser + Detección + Dropzone Mínimo sobre datos sintéticos)
                ↓
[ FASE 2: Archivo Real y Validación del Caso Testigo ]
  (Correr archivo real de seller + Reclamo con sugerencia de derivación humana)
                ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ GATE DE DECISIÓN CRÍTICO:                               ┃
┃ • Escenario A/B (MeLi indemniza o pide comprobante):    ┃
┃   → Continuar a Fase 3 con hipótesis validada.          ┃
┃ • Escenario C (MeLi rechaza sistemáticamente):          ┃
┃   → Pausar, reformular propuesta y evaluar viabilidad.   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                ↓ (Si A o B)
[ FASE 3: Marca, Identidad y Presencia ]
  (Naming definitivo, logo, paleta, landing page)
                ↓
[ FASE 4: MVP Completo y Pulido ]
  (Checkout Mercado Pago, exportación PDF de dossiers, UI final)
                ↓
[ FASE 5: Piloto con los Primeros 5 Sellers ]
  (Success fee 10-15%, acompañamiento concierge, recolección de testimonios)
```

---

## Detalle de Fases y Tareas

### 🚀 FASE 1: Motor Funcional sin Marca (Estado: ✅ COMPLETADA)
- [x] Arquitectura base de datos y modelos (`src/models.py`).
- [x] Lógica de detección determinística y reglas de caducidad (`src/engine.py`).
- [x] Generador de dossiers fácticos y rutas de navegación (`src/dossier.py`).
- [x] Interfaz mínima funcional (Dropzone web simple, sin diseño ni marca):
  - Arrastrar archivo `.xlsx` o `.csv` (procesamiento 100% local en navegador con SheetJS).
  - Parseo inmediato con alias flexibles de columnas.
  - Tabla de resultados: órdenes en riesgo, días congelados, límite de 60 días y monto total en riesgo (ARS).
  - Visualización interactiva con botón de copiado de dossier y guía con sugerencia de derivación humana.

---

### 🔍 FASE 2: Archivo Real y Caso Testigo
- [x] Prueba preliminar de compatibilidad de encabezados: Archivo real de Giuseppa Home (9 ventas reales, $0 ARS en riesgo, 0 falsos positivos confirmados).
- [ ] Obtener 1 reporte real de ventas/devoluciones con devoluciones/Full reales de un seller de confianza.
  - **Script de prospección vía WhatsApp:**
    > *"Hola [Nombre]! Estoy validando una herramienta que audita el reporte de ventas de Mercado Libre y detecta devoluciones que quedaron congeladas en el correo o siniestros sin indemnizar que MeLi a veces no te paga si no los reclamás antes de los 60 días. La podés probar vos mismo en 1 minuto sin dar claves ni instalar nada en https://juanoviedo1987-droid.github.io/reclameli/ subiendo tu Excel de Ventas. ¿Te sirve que lo probemos con tus ventas del último mes a ver si te quedaron fondos colgados?"*
- [ ] Ejecutar el archivo en el motor funcional para validar detección sobre devoluciones reales.
- [ ] Identificar un caso que cumpla las **condiciones fácticas obligatorias**:
  1. Envío por Mercado Envíos (Colecta, Tradicional o Full).
  2. Devolución despachada con tracking postal identificable.
  3. **Fecha prometida de entrega vencida** (o entrega dentro de las **72 hs para revisión de disconformidad**).
  4. **Menos de 60 días corridos desde la creación de la devolución** (plazo máximo de caducidad fijado por MeLi).
- [ ] Guiar al seller para ingresar el reclamo desde el **detalle de la venta puntual** (`/ventas/{id}/detalle`) aplicando la sugerencia de derivación humana con el dossier de ReclaMeli.
- [ ] Medir tiempo de respuesta, canal de acreditación (Mercado Pago vs Nota de Crédito) y **monto efectivamente liquidado**.

---

### 🛑 GATE DE DECISIÓN CRÍTICO (Hito de Viabilidad Económica)
* **Escenario A (Indemnización total):** MeLi compensa el 100% del valor de venta del producto $\rightarrow$ **Modelo validado con alta rentabilidad. Avanzar a Fase 3.**
* **Escenario B (Bonificación parcial por demora):** MeLi liquida una bonificación o compensación parcial de flete/gastos $\rightarrow$ **Medir el % real obtenido; recalibrar el pricing y la propuesta de valor antes de avanzar a Fase 3.**
* **Escenario C (Rechazo sistemático):** MeLi desestima el reclamo amparado en cláusulas restrictivas $\rightarrow$ **Pausar el proyecto, suprimir garantías y evaluar viabilidad.**

---

### 🎨 FASE 3: Marca, Identidad y Presencia (Post-Validación)
- [ ] Definición de Naming definitivo (evaluando blindaje legal frente a la marca MeLi).
- [ ] Identidad visual básica: logo, paleta de colores, tipografía.
- [ ] Landing page de alta conversión con calculadora de pérdidas estimadas y disclaimer de privacidad.

---

### 🛠️ FASE 4: MVP Completo y Pulido
- [ ] Integración de checkout de Mercado Pago para desbloqueo del lote de dossiers.
- [ ] Generación y descarga de Dossiers en PDF imprimible.
- [ ] Interfaz de usuario final responsiva y pulida.
- [ ] **Evolución a API Oficial de MeLi (Monitoreo Continuo para Suscripción SaaS):**
  - Implementar conexión OAuth2 para lectura en tiempo real mediante endpoints oficiales de postventa:
    - `/post-purchase/v1/claims/$CLAIM_ID`
    - `/post-purchase/v2/claims/$CLAIM_ID/returns`
    - `/shipments/$SHIPPING_ID/history`
  - Suscripción al feed de notificaciones (`claims` feed) para alertas automáticas 24/7 sin depender de la subida periódica de archivos Excel.
  - Consolidar el embudo en 2 etapas: **Adquisición con fricción cero (Excel local)** $\rightarrow$ **Retención SaaS (Conexión API con 1 clic)**.

---

### 🤝 FASE 5: Piloto con los Primeros 5 Sellers
- [ ] Onboarding de 5 sellers a Success Fee puro (10% - 15% post-cobro).
- [ ] Acompañamiento asistido para asegurar ejecución correcta.
- [ ] Recolección de capturas de pantalla de acreditación y testimonios para tracción comercial.
