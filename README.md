# Registros Cámaras — Tarjetas

Tarjetas de Home Assistant para **Registros Cámaras 2**, mantenidas en
[Siroguh/registros_camaras_cards](https://github.com/Siroguh/registros_camaras_cards).
La versión **1.0** sustituye al cliente de la antigua aplicación `registros_camaras`.
Requiere la [integración Registros Cámaras](https://github.com/Siroguh/registros_camaras_home_assistant)
**1.0 o posterior** y Home Assistant **2026.10.3+**.

## Instalar

Añade este repositorio personalizado en HACS como **Dashboard**, instala y recarga
el navegador. En HA 2026.11+ se puede utilizar la Marketplace integrada. No se ha
solicitado la inclusión en el catálogo público. Un solo recurso ES module:

```yaml
url: /hacsfiles/registros_camaras_cards/registros-camaras-cards.js
type: module
```

Las tres tarjetas tienen editor visual y aparecen en **Añadir tarjeta**:

- `custom:registros-camera-card`: lecturas físicas de HA, consigna efectiva,
  propuesta exacta, revisión/confirmación, consigna manual con inicio/fin,
  edición/finalización y listado de lotes.
- `custom:registros-lot-card`: código, cantidad y día local de inicio.
- `custom:registros-movement-card`: búsqueda paginada, disponibilidad por fecha,
  traslado completo/parcial, reparto, mezcla, procedencias e historial con
  correcciones auditadas y motivo obligatorio.

Se conservan los estilos adaptados al tema HA, diálogos, alturas de popups,
scroll de formularios, botones fijos, adaptación al teclado móvil, mensajes
accesibles y restauración de foco. Las lecturas físicas nunca se sustituyen por
las consignas. Toda validación de stock y calendario permanece en el servidor.

## Configuración

```yaml
type: custom:registros-camera-card
entry_id: ID_DE_LA_ENTRADA_NUEVA
location_id: villarroya-01-01-102
title: 102 Salado
temperature_entity: sensor.camara_102_temperature
humidity_entity: sensor.camara_102_humidity
```

Las tarjetas de lote y movimiento solo requieren `type` y `entry_id`; `title` es
opcional. Selecciona la conexión y cámara desde el editor visual. No se incluyen
direcciones de servidor ni claves en YAML: se guardan únicamente en la integración.

## Contrato nuevo y actualización

`src/client.ts` traduce las vistas del diseño a las **acciones nativas** de HA,
mediante `call_service` con `return_response`. No usa el bridge anterior
`registros_camaras/operation` ni endpoints de la aplicación antigua.

La revisión del centro y el ID de propuesta son los mostrados al usuario al abrir
el formulario. No se refresca silenciosamente la revisión al confirmar. Cada
comando tiene un UUID estable durante los reintentos del formulario; una corrección
tiene un UUID nuevo distinto del movimiento original. Un conflicto requiere
actualizar y volver a revisar. Si se pierde la conexión tras enviar, reintenta desde
el mismo formulario para recuperar el recibo; no abras otra operación equivalente.

El servidor puede devolver `pending` mientras reconcilia o proyecta el estado:
se muestra un mensaje, nunca una cámara vacía o un historial inventado.
La integración conserva la última consigna automática hasta confirmación explícita.

Al sustituir la integración instalada:

1. Guarda una copia del dashboard y del componente.
2. Instala la integración nueva y conéctala al servidor nuevo (también admite `vp run dev`).
3. Sustituye `entry_id` y referencias a entidades antiguas, incluidas las incrustadas
   en CSS/JS de Bubble Card. Los límites nuevos incluyen `active_lots` para conservar
   los indicadores ambientales solo en cámaras ocupadas.
4. Mantén hashes de navegación, popup, sensores físicos y CSS de disposición.
5. Deja un único recurso de estas tarjetas, actualizado a la nueva versión, y retira
   la entrada/entidades/componentes antiguos. Recarga el navegador.

## Desarrollo y releases

```sh
pnpm install --frozen-lockfile
pnpm check
```

El build produce `dist/registros-camaras-cards.js` y copia el recurso a la raíz para
instalación HACS. No añadas credenciales al bundle. Los tests del adaptador verifican
revisión exacta, reintentos, estado pendiente y procedencias de corrección.
Las etiquetas `v*` disparan validación y release automática del recurso compilado.
