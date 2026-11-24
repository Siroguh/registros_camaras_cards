# Registros Cámaras — Tarjetas

Estas tarjetas pertenecen al proyecto **[Siroguh/registros_camaras](https://github.com/Siroguh/registros_camaras)**,
su repositorio padre y servidor API. El código fuente, las incidencias y las releases
de las tarjetas se mantienen exclusivamente en este repositorio independiente:
**[Siroguh/registros_camaras_cards](https://github.com/Siroguh/registros_camaras_cards)**.

Tres tarjetas independientes para Home Assistant: **Cámara**, **Nuevo lote** y
**Nuevo movimiento**. Un único complemento frontend, instalado y actualizado con HACS.
Requiere la integración [Registros Cámaras](https://github.com/Siroguh/registros_camaras_home_assistant)
**0.3.1 o posterior**, una conexión configurada y un usuario administrador de HA.

## Instalación desde la interfaz

1. Abre **HACS → Repositorios personalizados**.
2. Añade `https://github.com/Siroguh/registros_camaras_cards`, tipo **Dashboard**.
3. Busca **Registros Cámaras — Tarjetas** y pulsa **Descargar**.
4. Recarga la página de Home Assistant.
5. Abre **Editar dashboard → Añadir tarjeta** y busca **Registros Cámaras**.
6. Elige Cámara, Nuevo lote o Nuevo movimiento y selecciona la conexión en su editor visual.

HACS descarga el recurso JavaScript y lo registra en dashboards gestionados desde
la interfaz (modo storage). No hay que copiar archivos, editar el filesystem ni
escribir YAML. En instalaciones que gestionan los recursos mediante YAML, cambia
la gestión a la interfaz si quieres este flujo sin archivos manuales.

Este repositorio es **exclusivamente personalizado**. No se solicita ni se pretende
su inclusión en el catálogo de HACS. La CI HACS solo valida el formato técnico.

## Tarjetas

### Apariencia clara y oscura

Las tres tarjetas siguen automáticamente el tema de Home Assistant, incluido el modo
claro u oscuro elegido en tu perfil. Fondos, textos, campos, botones, diálogos y editores
visuales usan los colores del tema activo. Los controles nativos de fecha y selección
también siguen el modo de HA. No necesitas configurar cada tarjeta ni escribir YAML.
Cambiar de tema conserva los valores que estés introduciendo en los formularios.

### Scroll y formularios largos

Las tarjetas crecen hasta la altura disponible y desplazan únicamente su cuerpo.
La cabecera, las lecturas de cámara y las acciones permanecen visibles. Los diálogos
usan la misma estructura, con Cancelar y Guardar/Confirmar al pie. El historial y
los destinos comparten el scroll del cuerpo; cargar más conserva la posición.
La altura sigue el viewport visual, incluido el teclado móvil y las zonas seguras.

En pop-ups Bubble, el contenedor exterior debe ceder el scroll a la tarjeta
(`overflow: hidden`, altura limitada al viewport y contenido flex con `min-height: 0`).
La cabecera Bubble debe usar el título de la tarjeta: la tarjeta omite su título
interior en ese contexto. En dashboards normales conserva su propia cabecera.

### Cámara

Selecciona una cámara y, opcionalmente, sus entidades de temperatura/humedad existentes.
Presenta mediciones, rangos de consigna vigente, origen, fin de excepción manual,
lotes presentes y propuesta pendiente. No duplica sensores ambientales.

- **Revisar:** diálogo con consigna actual y propuesta.
  Confirma el identificador mostrado; una propuesta obsoleta se rechaza.
- **Consigna manual:** diálogo con rangos, inicio, fin obligatorio y motivo.
- **Editar manual:** modifica valores o intervalo de la consigna vigente, con control de revisión.
- **Finalizar manual:** confirmación breve; cierra el intervalo con la hora del servidor y
  recupera la última automática confirmada, sin aceptar una propuesta pendiente.
- **Actualizar:** vuelve a consultar la API.

Las consignas son referencias de la aplicación, no órdenes directas a actuadores.
Temperatura y humedad se muestran como rangos, sin inventar una media o un setpoint.

### Nuevo lote

Código, cantidad y fecha inicial. La API aplica la regla existente de entrada en la
cámara 102 al día siguiente. Las fechas se interpretan en la zona horaria indicada
en el formulario. El alta usa un UUID estable para evitar duplicados al reintentar.

### Nuevo movimiento

Filtra lotes, selecciona uno y una fecha. La API devuelve las porciones disponibles
en esa fecha y la revisión del lote; la tarjeta no reconstruye genealogías.
Permite mover todo a un destino o repartir cantidades, con selección explícita de
procedencias por destino. También permite declarar una mezcla física del origen.
La API valida cantidades, fechas, procedencias y cambios concurrentes.
**Movimientos** muestra los más recientes del lote y permite cargar más.
**Corregir** reutiliza el formulario de origen, destinos y procedencias, con la fecha y
cantidades existentes. La API devuelve las existencias anteriores a esa operación y
revalida todo el historial al guardar, incluidos los movimientos posteriores.
La entrada inicial se consulta pero no se corrige desde esta tarjeta.

## Arquitectura

```text
Tarjetas → WebSocket autenticado de HA → integración Python → API pública → base de datos
```

Las tarjetas no reciben claves de la API. No hablan directamente con el servidor ni
con GitHub durante el uso diario. No crean ayudantes de HA para guardar borradores.
Las reglas de lotes, movimientos y consignas pertenecen al servidor.

Las tres tarjetas comparten un único archivo JS autocontenido, sin dependencias en
CDN ni bibliotecas de frontend externas en tiempo de ejecución. Usan custom elements
y controles nativos del navegador, con diálogos modales y editores visuales. Se
actualizan cada 60 segundos; los formularios conservan su contenido durante el sondeo.

## Desarrollo y distribución

Este repositorio es la única fuente de las tarjetas y su distribución para HACS.
Se desarrollan directamente en `src/`; no se exportan desde el repositorio padre.
El servidor y sus reglas pertenecen a [registros_camaras](https://github.com/Siroguh/registros_camaras),
y la integración Python a [registros_camaras_home_assistant](https://github.com/Siroguh/registros_camaras_home_assistant).

Desde este repositorio: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`.
El bundle de `dist/` se publica como `registros-camaras-cards.js` en la raíz y en la release.

Copyright (C) 2026 Siroguh. **GPL-3.0-only**, consulta [LICENSE](LICENSE).
