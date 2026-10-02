# Roadmap de Ejecución - ReclaMeli 🎯

> **Plan de acción lean: validación operativa y técnica antes de inversión en marca.**

---

## Resumen del Flujo de Fases

```
[ FASE 1: Motor Funcional sin Marca ]
  (Parser + Detección + Dropzone Mínimo sobre datos sintéticos)
                ↓
[ FASE 2: Archivo Real y Validación del Caso Testigo ]
  (Correr archivo real de seller + Ejecutar reclamo con Hack del Botón NO)
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
  - Tabla de resultados: órdenes en riesgo, días congelados, fecha límite de 30 días y monto total en riesgo (ARS).
  - Visualización interactiva con botón de copiado de dossier y guía con el hack del botón "NO".

---

### 🔍 FASE 2: Archivo Real y Caso Testigo
- [ ] Obtener 1 reporte real de ventas/devoluciones de Mercado Libre de un seller de confianza (anonimizado).
- [ ] Ejecutar el archivo en el motor funcional para validar compatibilidad de columnas y formatos reales.
- [ ] Identificar un caso que cumpla las **4 condiciones clave**:
  1. Envío por Mercado Envíos (Colecta, Tradicional o Full).
  2. Devolución con escaneo inicial confirmado.
  3. Dinero reembolsado al comprador.
  4. Tracking congelado entre 15 y 29 días corridos.
- [ ] Guiar al seller para ingresar el reclamo en soporte ejecutando el **hack del botón "NO"** con el dossier de ReclaMeli.
- [ ] Medir tiempo de respuesta y resolución de soporte.

---

### 🛑 GATE DE DECISIÓN (Hito de Viabilidad)
* **Escenario A (Éxito directo):** Soporte indemniza emitiendo nota de crédito o acreditación en Mercado Pago en < 72 hs $\rightarrow$ **Avanzar a Fase 3.**
* **Escenario B (Éxito condicionado):** Soporte solicita comprobante adicional (remito/factura) y luego acredita $\rightarrow$ **Ajustar el dossier y avanzar a Fase 3.**
* **Escenario C (Rechazo):** Soporte rechaza el reclamo amparado en alguna cláusula no contemplada $\rightarrow$ **Pausar, reformular el modelo sin garantía de indemnización y reevaluar continuidad.**

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

---

### 🤝 FASE 5: Piloto con los Primeros 5 Sellers
- [ ] Onboarding de 5 sellers a Success Fee puro (10% - 15% post-cobro).
- [ ] Acompañamiento asistido para asegurar ejecución correcta.
- [ ] Recolección de capturas de pantalla de acreditación y testimonios para tracción comercial.
