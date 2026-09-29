"use strict";

// Editar aquí el contenido. Las rutas son relativas a index.html.
// Ejemplo de fotografía: image: "fotos/nombre.jpg". No se lista la carpeta.
// Dejar "" cuando no exista fecha, texto o fotografía: no se mostrará un hueco.
window.YADIRA_CONTENT = {
  history: { title: "OUR GRAND LINE", subtitle: "Nuestra historia" },
  timeline: [
    { title: "Donde comenzó todo", date: "", text: "", image: "", alt: "" },
    { title: "Nuestra primera cita", date: "", text: "", image: "", alt: "" },
    { title: "Nuestro primer beso", date: "", text: "", image: "", alt: "" },
    {
      title: "Una tarde cualquiera", date: "",
      text: "Uno de mis recuerdos favoritos no necesitó un lugar extraordinario. Solo necesitó que usted estuviera conmigo.",
      image: "", alt: ""
    },
    { title: "Nosotros", date: "", text: "", image: "", alt: "" },
    { title: "Hoy", date: "", text: "", image: "", alt: "" }
  ],
  yadira: {
    title: "LA YADIRA QUE YO CONOZCO",
    intro: [
      "Muchas personas pueden conocer partes de usted...",
      "pero yo tengo la fortuna de conocer pequeños detalles que hacen que usted sea usted."
    ],
    phrases: [
      "Su forma de abrazarme.", "Su manera de reírse.", "Sus ocurrencias.",
      "Cómo me habla.", "Cómo me mira.", "La forma en que se queda conmigo."
    ],
    closing: [
      "Muchas personas pueden conocer su nombre.",
      "Pero yo tengo la fortuna de conocer pequeños detalles que hacen que usted sea usted.",
      "Y esa es mi versión favorita."
    ]
  },
  memories: { title: "MAR DE RECUERDOS", subtitle: "Algunos momentos merecen quedarse aquí." },
  // Añadir una entrada por fotografía. No es necesario modificar el HTML.
  // { src: "fotos/nombre.jpg", alt: "Descripción breve", caption: "", story: "" }
  gallery: [],
  navigation: { continue: "CONTINUAR LA AVENTURA", close: "Cerrar", viewPhoto: "Ver fotografía" }
};

// YADIRA-004. Editar estos textos y rutas antes de publicar.
// Las fotografías son opcionales: usar "fotos/nombre.jpg" o dejar "".
window.YADIRA_CONTENT.treasure = {
  zoro: {
    title: "EL RINCÓN DE ZORO",
    message: "Un pequeño homenaje a su espadachín favorito.",
    find: "ENCONTRAR A ZORO",
    searching: "Buscando a Zoro...",
    error: "ERROR 404",
    lost: "Zoro volvió a perderse.",
    clue: "Pero parece que dejó algo para usted..."
  },
  wanted: {
    title: "WANTED", name: "YADIRA", notice: "DEAD OR ALIVE",
    subtitle: "BIRTHDAY GIRL", reward: "19,000,000", currency: "BERRIES",
    crime: "Delito: robarle el corazón a cierto programador.",
    image: "", alt: "Retrato de Yadira", monogram: "Y"
  },
  letter: {
    introduction: "PARA USTED", title: "Para Yadira", open: "ABRIR CARTA",
    close: "Cerrar carta", continue: "CONTINUAR",
    // Añadir o sustituir párrafos aquí; no hay que editar HTML.
    body: [
      "Feliz cumpleaños, mi amor.",
      "Hoy no quería darle solamente un regalo.",
      "Quería construir algo que pudiera guardar pequeños pedazos de nosotros.",
      "Cada parte de este lugar fue pensada para usted."
    ]
  },
  birthday: {
    age: 19, name: "YADIRA", title: "Feliz cumpleaños, mi amor.",
    instruction: "Toque las velas para pedir un deseo.", wish: "Deseo guardado. ✦"
  },
  ending: {
    image: "", alt: "Nuestro recuerdo final",
    lines: ["Este no es el final de nuestra historia.", "Es solamente una de las primeras páginas."],
    birthday: "Feliz cumpleaños, mi amor.", name: "YADIRA — 19", date: "01 • 10 • 2026",
    signature: "Hecho con amor para Yadira.", author: "Edwin", year: "2026",
    continued: "TO BE CONTINUED →", restart: "Volver al inicio"
  }
};
