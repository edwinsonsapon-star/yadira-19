# YADIRA — 19: Our Grand Line

## Estado del proyecto

- **YADIRA-001 — Opening Experience:** aprobado. Se conservan su diseño, CSS, JavaScript, partículas y tiempos.
- **YADIRA-002 — The Journey Begins:** recorrido aprobado; narrativa de cumpleaños actualizada en YADIRA-005.
- **YADIRA-003 — Our Grand Line:** aprobado; se conserva el mapa, la galería y su interacción.
- **YADIRA-004 — The Treasure:** cierre completo.
- **YADIRA-005 — Visual Polish:** assets integrados, pastel y fuegos artificiales, narrativa revisada; pendiente de aprobación visual.

Los capítulos se conectan por eventos. Journey se monta dentro de `#experience` al recibir `yadira:opening-complete`; Our Grand Line se monta dentro de `#grand-line` al recibir `yadira:journey-start`. Treasure se monta dentro de `#treasure` al recibir `yadira:grand-line-complete`. No se utiliza video, micrófono, WebGL, Three.js, dependencias de producción ni servicios externos. La galería funciona vacía hasta que se declaren fotografías en `content.js`.

## Música de fondo — YADIRA-010

Pista local: **`audio/audio.mp3`**, utilizada sin conversión ni modificación. La ruta es relativa y compatible con GitHub Pages. `src/scripts/audio.js` inicia la reproducción solamente al pulsar **ABRIR REGALO**, sin esperar ni bloquear la transición. Aplica un fade-in de 2.5 segundos hasta un volumen de 0.25 y utiliza loop nativo.

El pequeño control inferior derecho está deshabilitado hasta abrir el regalo; después permite pausar y reanudar sin reiniciar la pista, también dentro del visor. Los errores de reproducción son silenciosos y permiten reintentar con el control. **Volver al inicio** conserva la posición en sessionStorage si está disponible: la recarga pausa el audio y el siguiente **ABRIR REGALO** lo reanuda desde esa posición, nunca automáticamente al cargar.

## Abrir localmente

Abre `index.html` directamente o, desde la raíz, ejecuta con Python 3:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Visita <http://localhost:5173>. `npm start` ejecuta el mismo servidor; `npm run check` valida los seis scripts con Node.js. Recarga para repetir la experiencia: no hay persistencia del progreso narrativo.

## Estructura

```text
yadira/
├── audio/audio.mp3               # Pista original protegida
├── fotos/.gitkeep                 # Carpeta protegida
├── onepiece/Logo one piece.png    # Logo original protegido
├── src/
│   ├── scripts/
│   │   ├── main.js                # YADIRA-001, intacto
│   │   ├── journey.js             # YADIRA-002, conservado
│   │   ├── content.js             # Contenido editable de YADIRA-003 y YADIRA-004
│   │   ├── grand-line.js          # Mapa, recuerdos, frases, galería y visor
│   │   ├── treasure.js            # Zoro, Wanted, carta, cumpleaños y final
│   │   └── audio.js               # Música, fade-in, loop y pausa/reanudación
│   └── styles/
│       ├── main.css               # YADIRA-001, intacto; tokens compartidos
│       ├── journey.css            # Océano CSS del segundo capítulo
│       ├── grand-line.css         # Mapa y álbum del tercer capítulo
│       ├── treasure.css           # Arte y escenas del cierre
│       └── audio.css              # Control discreto de música
├── qa/
│   ├── verify-opening.cjs         # Regresión aislada de YADIRA-001
│   ├── verify-journey.cjs          # Regresión de YADIRA-002
│   ├── verify-grand-line.cjs       # Integración y QA de YADIRA-003
│   ├── verify-treasure.cjs         # QA de YADIRA-004
│   ├── results.json               # Informe del Opening
│   ├── journey-results.json       # Informe del Journey
│   ├── grand-line-results.json    # Informe de Our Grand Line
│   └── treasure-results.json      # Informe de The Treasure
├── .gitignore
├── index.html
├── package.json
└── README.md
```

Las capturas locales de QA se excluyen mediante `qa/*.png`.

## Archivos protegidos

No se modifican, mueven ni eliminan contenidos de `onepiece/` o `fotos/`. El recurso original sigue en `onepiece/Logo one piece.png` y el HTML lo carga mediante `onepiece/Logo%20one%20piece.png`.

SHA-256 del logo:

```text
206E75F1CD4F177F730DBB13FB7DDF166E40298D579A1F9E8FFE18140364E368
```

El Log Pose es un SVG original construido por el código: esfera, reflejos, anillos, soporte, base metálica y aguja. No utiliza imágenes oficiales.

## Secuencia y tiempos

Tras ABRIR REGALO y el interludio aprobado, aparece el océano nocturno. Cada frase se muestra individualmente; «Continuar» permite adelantar solamente la frase actual, sin acumular saltos durante las transiciones. Si no se interactúa, la secuencia avanza sola.

| Frase | Lectura efectiva |
|---|---:|
| Hoy celebramos sus 19. | 2,5 s |
| Y no podría estar más feliz de vivir este día a su lado. | 4,2 s |
| Este regalo está hecho con mi tiempo y todo mi cariño. | 4,2 s |
| Para celebrar los momentos que compartimos. | 3,5 s |
| Y la ilusión de seguir creando recuerdos juntos. | 3,7 s |
| Bienvenida a nuestra Grand Line. | 4,3 s |

Cada frase entra en 550 ms y sale en 450 ms. Después aparece el Log Pose: iluminación interior, búsqueda de 4,3 segundos con correcciones y dirección final de 44° hacia arriba/derecha. Un pulso precede a DESTINO ENCONTRADO, OUR GRAND LINE y COMENZAR VIAJE. El indicador de ruta muestra únicamente el punto de partida.

COMENZAR VIAJE se bloquea inmediatamente después de activarse. El objeto reacciona, se atenúa el ambiente y se desvanece la escena. Con movimiento reducido se omiten giros y desplazamientos, conservando íntegros los tiempos de lectura. Un cambio de esta preferencia durante una animación también finaliza ese movimiento.

## Contratos de integración

**Entrada a YADIRA-002:** `document` escucha `yadira:opening-complete` una sola vez. El montaje se difiere a una microtarea para que el contrato original de entrega de `#experience` vacío siga siendo observable durante el evento de YADIRA-001.

**Salida hacia YADIRA-003:** se emite exactamente una vez `yadira:journey-start`, sobre `document`, con propagación y `detail: { package: "YADIRA-002" }`. En ese momento la escena está oculta, `#grand-line` está visible, enfocado y literalmente vacío.

```js
document.addEventListener('yadira:journey-start', (event) => {
  // Punto de integración para un futuro paquete aprobado.
}, { once: true });
```

Los estados de `.journey-stage` son `ocean`, `narrative`, `searching`, `found`, `ready`, `departing` y `complete`. Se utiliza una sola región viva para las frases, botones nativos, foco visible y decoraciones fuera del árbol de accesibilidad.

## Editar el contenido esta noche

La configuración está en **`src/scripts/content.js`**, mediante `window.YADIRA_CONTENT`. No hay que modificar el HTML ni el código que renderiza las secciones.

- `timeline`: título, fecha, texto, ruta de imagen y descripción alternativa de cada momento. Las fechas son texto libre. Dejar `date`, `text` o `image` en `""` omite ese campo del recuerdo.
- `journey`: las seis frases del viaje y sus tiempos de lectura.
- `yadira`: título, introducción, ocho frases y cierre. Los textos iniciales son exclusivamente los autorizados en la tarea.
- `gallery`: una entrada por fotografía, con `src`, `alt`, `caption` y `story`.
- `history`, `memories` y `navigation`: títulos, subtítulos y etiquetas.

Para añadir una fotografía, colócala manualmente en `fotos/` y declara su ruta relativa, respetando mayúsculas y extensión:

```js
gallery: [
  { src: "fotos/nombre.jpg", alt: "Descripción de la fotografía", caption: "", story: "" }
]
```

No se escanea `fotos/`, por lo que funciona en hosting estático como GitHub Pages. Las imágenes del álbum utilizan `loading="lazy"` y mantienen su proporción. El visor utiliza `object-fit: contain`. Una imagen que no puede cargarse se retira de la interfaz; si ninguna carga, permanece la composición decorativa. Una ruta inexistente puede generar un 404 en la consola del navegador: hay que corregirla en `content.js`.

La configuración entregada no incluye fotografías ni fechas inventadas. Los momentos «Una tarde cualquiera» y «Hoy, sus 19» tienen textos autorizados sobre los recuerdos y el cumpleaños.

## YADIRA-003: interacción y salida

El mapa vertical tiene seis puntos interactivos. Cada uno abre un diálogo con los campos disponibles. Se puede cerrar con el botón, Escape o el fondo exterior. El foco vuelve al punto o fotografía que lo abrió; el diálogo nativo conserva el foco dentro mientras está abierto.

Las frases de la sección Yadira aparecen progresivamente al hacer scroll. Con movimiento reducido permanecen visibles sin desplazamientos. El indicador de ruta muestra el segundo punto del viaje.

CONTINUAR LA AVENTURA bloquea activaciones repetidas, desvanece la escena y muestra/enfoca `#treasure`, literalmente vacío. Después emite sobre `document`, con propagación, una sola vez:

```js
// detail: { package: "YADIRA-003" }
document.addEventListener('yadira:grand-line-complete', (event) => {
  // Punto de integración para el siguiente paquete aprobado.
}, { once: true });
```

El montaje de YADIRA-003 ocurre en una microtarea tras `yadira:journey-start`, para conservar la entrega vacía de `#grand-line` durante ese evento. YADIRA-004 escucha posteriormente el evento de salida de Grand Line.

## QA

Requiere Playwright disponible para Node.js (instalado localmente o mediante `NODE_PATH`) y Microsoft Edge instalado. Estas herramientas son de desarrollo y no son dependencias de la web. Con el servidor activo:

```powershell
node qa/verify-opening.cjs
node qa/verify-journey.cjs
node qa/verify-grand-line.cjs
node qa/verify-treasure.cjs
```

El primer script aísla el Opening desactivando únicamente la carga de `journey.js`, para comprobar su contrato original. El segundo prueba ambos capítulos aislando la carga de `grand-line.js` para conservar el contrato de salida de YADIRA-002. El tercero prueba el flujo completo en 390 × 844 y, en los otros tamaños, monta YADIRA-003 desde su evento de entrada; aísla `treasure.js` para comprobar la entrega vacía. Treasure tiene una prueba de integración desde Grand Line y pruebas de sus propias interacciones en todos los tamaños.

Se validan 360 × 640, 390 × 844, 430 × 932, 768 × 1024 y 1440 × 900, además de 390 × 844 con movimiento reducido. Journey comprueba las seis frases exactas, lectura automática conservada, avance manual, controles visibles, ausencia de overflow y solapamientos, dirección final, doble activación, eventos, foco final, contenedor vacío, integridad del logo y errores HTTP/consola. Las capturas permiten revisar el resultado; emular tamaños no sustituye probar dispositivos físicos.

El QA de YADIRA-003 comprueba mapa, recuerdos, cierre mediante botón/Escape/exterior, retorno de foco, contenido sin fotos, frases, galería, visor vertical/horizontal/cuadrado, imágenes fallidas retiradas, evento único de salida y `#treasure` vacío. Utiliza fixtures SVG virtuales servidos únicamente en el navegador de prueba bajo `/qa/fixtures/`; nunca escribe en `fotos/`. También comprueba movimiento reducido y ausencia de overflow horizontal y errores con el contenido entregado.

Las capturas `qa/grand-line-{start,map,memory,yadira,gallery}-{390x844,1440x900}.png` documentan las cinco vistas solicitadas. Las capturas con `fixture` muestran únicamente pruebas internas, no contenido personal. Todas siguen ignoradas por Git.

## YADIRA-004 — The Treasure

Todo el contenido del cierre está en **`window.YADIRA_CONTENT.treasure`**, dentro del mismo **`src/scripts/content.js`**:

- `zoro`: título, homenaje, búsqueda, ERROR 404 y gag. Son textos de la interfaz; no es un error HTTP real.
- `wanted`: nombre, recompensa, moneda, subtítulo, delito, monograma, imagen y descripción alternativa.
- `letter`: introducción, título, array de párrafos `body`, botones y cierre. Sustituye o añade párrafos directamente; el render usa texto, no HTML.
- `birthday`: edad, nombre, felicitación, instrucción de las velas y confirmación del deseo.
- `ending`: imagen, descripción alternativa, líneas finales, fecha, firma, autor, año, TO BE CONTINUED y reinicio.

Las fotografías `wanted.image` y `ending.image` vienen vacías. Para configurarlas usa rutas como `fotos/nombre.jpg`. Se solicitan al revelar su escena y no aparecen hasta cargar correctamente. Si faltan o fallan, el Wanted mantiene su monograma y el final funciona con texto. El retrato del Wanted utiliza `object-fit: cover` y `object-position: center 35%` dentro del marco; el final mantiene `contain`, sin recortar.

**Flujo:** el evento `yadira:grand-line-complete` monta el cierre en una microtarea, conservando la entrega vacía observable por otros listeners. ENCONTRAR A ZORO muestra una búsqueda breve, el gag y un Wanted original en HTML/CSS. La paleta verde se limita al primer tramo. El cartel conduce por scroll al sobre.

ABRIR CARTA abre el sobre y revela una carta en el flujo del documento, con scroll natural. Se puede cerrar mediante Cerrar carta o Escape y volver a abrir. El foco vuelve al botón original. CONTINUAR inicia la revelación de 19, YADIRA, la felicitación y un pastel original de CSS con dos velas numéricas.

El pastel es un botón accesible por teclado y táctil. Al activarlo se bloquea, apaga las llamas y muestra humo, cuatro estrellas discretas y tres fuegos artificiales de corta duración. «Deseo guardado. ✦» permanece 2,3 segundos antes del fundido al final. La ruta aparece completamente recorrida. Volver al inicio recarga la página y reinicia todos los capítulos.

Las animaciones respetan movimiento reducido. Las transiciones instantáneas incluyen una breve guarda de 300 ms antes de habilitar los controles recién aparecidos, para que el segundo toque de una doble pulsación no active accidentalmente el siguiente paso. No se accede al micrófono ni se reproduce música.

### QA del cierre

`qa/verify-treasure.cjs` comprueba los cinco tamaños y 390 × 844 con movimiento reducido: entrada desde Grand Line, gag, Wanted sin imagen, apertura/cierre/reapertura de carta, doble activación, cumpleaños, velas, deseo, final, ruta completa y reinicio. Un caso adicional utiliza una carta de 20 párrafos y un fixture SVG virtual bajo `/qa/fixtures/treasure.svg` para probar imágenes verticales del cartel y final. No se escriben fixtures en `fotos/`.

Las capturas móviles cubren Zoro, ERROR 404, Wanted, sobre, carta, cumpleaños, velas apagadas, final y TO BE CONTINUED. En escritorio se capturan Wanted, carta y final. Permanecen excluidas de Git mediante `qa/*.png`.

Si varias suites coinciden, puede iniciarse un servidor local de QA con más capacidad de conexiones en el puerto 5174 y usar `YADIRA_QA_URL=http://127.0.0.1:5174`. Esto no cambia la web ni sus dependencias.

## Git

Trabajo actual en `feature/yadira-005-release`, la rama ya seleccionada al recibir el paquete. La implementación anterior ya estaba versionada; los dos nuevos JPG del usuario estaban sin seguimiento. No se hace staging, commit ni push. Las carpetas `onepiece/` y `fotos/` permanecen intactas.

## YADIRA-005 — Assets y narrativa

Se detectaron y se utilizan los tres archivos de `onepiece/` sin cambiar un solo byte:

| Archivo | Uso | SHA-256 |
|---|---|---|
| `Logo one piece.png` | Logo ambiental del Opening, conservado | `206E75F1CD4F177F730DBB13FB7DDF166E40298D579A1F9E8FFE18140364E368` |
| `cartel.jpg` | Base del Wanted | `3D2571723590956634575711822AC3B124323B4901FF74063C6CA8C779DF42BD` |
| `logo zoro.jpg` | Emblema de Zoro | `9AD8B53FC31AB333AFC9ADC298A5C22883D67617C0401282D1FE9A3E544A427B` |

El cartel suministrado contiene una fotografía y datos de Zoro. Paneles opacos de papel creados en CSS cubren los datos del personaje, dejando una composición para Yadira con textos HTML editables. Se conserva el WANTED impreso original; si se edita `wanted.title`, un panel cubre el título impreso y muestra el nuevo texto. El encabezado HTML permanece accesible en ambos casos. Las posiciones corresponden a esta plantilla concreta de 489 × 720; sustituir la plantilla por otra composición requiere revisar el CSS. Sin foto personal aparece un monograma grabado, un marco y una estrella. La foto futura ocupa exactamente ese marco. No se ha creado ni alterado ningún archivo de imagen.

`treasure.wanted.template` configura la base; `treasure.zoro.image` configura el emblema. El JPG de Zoro se integra mediante inversión y escala de grises por CSS sobre una iluminación verde tenue. Los archivos originales conservan sus colores. Si cualquiera de estos assets no carga, permanecen las composiciones CSS/SVG anteriores.

El pastel tiene dos niveles, acabado marfil/violeta, detalles dorados y velas numéricas más grandes. Al apagarlas aparecen tres fuegos artificiales con 36 rayos en total, animados una sola vez con opacity/transform durante 1,6 segundos y desfases de hasta 0,7 segundos. Con movimiento reducido aparecen destellos estáticos pequeños y tenues. No hay bucle de render, librerías nuevas ni audio.

La narrativa se revisó en HTML y todos los scripts: Opening, viaje, sección de Yadira, recuerdo del cumpleaños, álbum, Wanted, carta y final. El foco es Yadira y Edwin, sus 19 años, el tiempo dedicado al regalo y los recuerdos juntos. La carta sigue siendo provisional y editable; no se inventaron fechas ni historias adicionales. La referencia temática de Zoro conserva su gag.

### Personalización posterior

- Foto del Wanted: guardar manualmente, por ejemplo, `fotos/yadira-wanted.jpg` y usar esa ruta en `treasure.wanted.image`.
- Foto del final: `treasure.ending.image`, por ejemplo `fotos/nuestro-recuerdo.jpg`.
- Álbum: entradas `gallery` con `src`, `alt`, `caption` y `story`.
- Recuerdos del mapa: `timeline[].image` y `alt`.
- Carta provisional: `treasure.letter.body`, un párrafo por entrada.

Esos nombres son ejemplos, no archivos añadidos. Todas las rutas son relativas a `index.html`, compatibles con un subdirectorio de GitHub Pages. `fotos/` permanece intacta.

### Verificación del pulido

La suite Treasure ahora comprueba carga del emblema y de la plantilla, Wanted vacío y con retrato virtual, pastel de al menos 300 px de ancho, fuegos artificiales visibles y su variante sin animación, además de las interacciones previas. Journey y Grand Line comprueban los textos y tiempos actualizados. Las capturas siguen en `qa/*.png`, excluidas de Git.
