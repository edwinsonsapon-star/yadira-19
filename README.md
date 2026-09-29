# YADIRA — 19: Our Grand Line

## Paquete actual: YADIRA-001 — Opening Experience

Una única apertura cinematográfica, mobile-first, con referencia principal de 390 × 844 px. El proyecto avanza por paquetes sujetos a aprobación visual. No se implementa contenido de paquetes posteriores.

La interfaz presenta exclusivamente:

- PARA / YADIRA / 01 • OCTUBRE • 2026.
- Ornamento sutil y «Una aventura creada especialmente para usted.»
- Botón ABRIR REGALO y «Best experienced with sound ♫».
- El logo original como ambiente, gradientes CSS y 26 partículas discretas.

No se reproduce audio. El texto sobre sonido forma parte del diseño solicitado.

## Abrir localmente

Abre `index.html` directamente, o ejecuta desde la raíz con Python 3:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Visita <http://localhost:5173>. Detén el servidor con `Ctrl+C`. `npm start` ejecuta el mismo servidor; `npm run check` comprueba la sintaxis del JavaScript con Node.js. La aplicación no requiere paquetes, compilación, fuentes remotas ni servicios externos.

## Estructura

```text
yadira/
├── .git/                         # Repositorio existente
├── fotos/                        # Originales protegidos; actualmente vacía
├── onepiece/
│   └── Logo one piece.png        # Original protegido, sin modificaciones
├── src/
│   ├── scripts/main.js           # Partículas y secuencia de apertura
│   └── styles/main.css           # Tokens, ambiente, responsive y movimiento
├── qa/
│   ├── verify-opening.cjs        # Verificación automatizada en navegador
│   └── results.json             # Resultados de la última ejecución
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Logo y archivos protegidos

El recurso usado es `onepiece/Logo one piece.png`, referenciado desde HTML como `onepiece/Logo%20one%20piece.png`. La opacidad, el modo de mezcla y la máscara radial son estilos de presentación CSS: no se modifica, renombra, comprime ni reemplaza el archivo. No se realizan escrituras en `onepiece` ni en `fotos`.

SHA-256 del logo original:

```text
206E75F1CD4F177F730DBB13FB7DDF166E40298D579A1F9E8FFE18140364E368
```

## Secuencia y contrato de integración

Entrada: ambiente → logo → PARA → YADIRA → fecha → ornamento → frase → botón. Las animaciones usan principalmente opacidad y transformaciones, con desenfoque leve durante la entrada.

Al activar ABRIR REGALO, el botón se deshabilita inmediatamente y una guarda bloquea activaciones repetidas. Sigue una pequeña reacción visual de presión, aumento de luz, salida de la apertura y aparición de «Toda gran aventura comienza con un primer paso.». El mensaje se mantiene 2,2 segundos completamente visible y se desvanece junto con el ambiente.

Al terminar:

1. La apertura, el interludio y el ambiente quedan ocultos.
2. Se muestra y enfoca `#experience`, que permanece literalmente vacío.
3. Se emite **una sola vez**, sobre `document`, un `CustomEvent` llamado `yadira:opening-complete`, con propagación y `detail: { package: "YADIRA-001" }`.

Ejemplo para un futuro paquete, una vez aprobado (no incluido en la aplicación):

```js
document.addEventListener('yadira:opening-complete', (event) => {
  // Punto de integración del siguiente paquete.
}, { once: true });
```

Los estados de `.stage` son `opening`, `departing`, `interlude` y `complete`. No se guarda progreso entre recargas. Recargar permite revisar de nuevo la apertura. Con `prefers-reduced-motion: reduce` se omiten animaciones y desplazamientos; se conserva el tiempo de lectura del mensaje.

## QA

El informe de `qa/results.json` corresponde a una ejecución real de Microsoft Edge headless. Las capturas PNG se generan localmente durante las pruebas, se excluyen del repositorio mediante `qa/*.png` y se retiran al finalizar esta limpieza. Los nombres de captura del informe identifican esos archivos generados, que pueden reproducirse ejecutando el QA. `verify-opening.cjs` usa Playwright como herramienta de desarrollo, independiente de la aplicación. Requiere tener `playwright` disponible para Node.js (instalado localmente o mediante `NODE_PATH`) y Edge instalado; no descarga navegadores.

Con el servidor local activo:

```powershell
node qa/verify-opening.cjs
```

Se comprueban 360 × 640, 390 × 844, 430 × 932, 768 × 1024 y 1440 × 900, más 390 × 844 con movimiento reducido. El script valida ausencia de overflow, carga del logo, contenido dentro del viewport, 26 partículas, botón, bloqueo de activaciones repetidas, transición, evento único, foco final, contenedor vacío y ausencia de errores de consola. También comprueba activación por teclado en escritorio y la integridad SHA-256 del logo.

Las capturas permiten aprobar el aspecto visual. La emulación de viewport no sustituye una prueba en un dispositivo físico.

## Git

Se conserva el repositorio y el remoto existente. No se hace staging, commit ni push durante este paquete. Los cambios quedan disponibles para revisión visual.
