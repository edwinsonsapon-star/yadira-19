"use strict";

// Editar aquí el contenido. Las rutas son relativas a index.html.
// Ejemplo de fotografía: image: "fotos/nombre.jpg". No se lista la carpeta.
// Dejar "" cuando no exista fecha, texto o fotografía: no se mostrará un hueco.
window.YADIRA_CONTENT = {
  journey: [
    { text: "Hoy celebramos sus 19.", hold: 2500 },
    { text: "Y no podría estar más feliz de vivir este día a su lado.", hold: 4200 },
    { text: "Este regalo está hecho con mi tiempo y todo mi cariño.", hold: 4200, emphasis: "personal" },
    { text: "Para celebrar los momentos que compartimos.", hold: 3500 },
    { text: "Y la ilusión de seguir creando recuerdos juntos.", hold: 3700 },
    { text: "Bienvenida a nuestra Grand Line.", hold: 4300, emphasis: "welcome" }
  ],
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
    { title: "Hoy, sus 19", date: "", text: "Me hace muy feliz poder celebrar este día a su lado.", image: "", alt: "" }
  ],
  yadira: {
    title: "LO QUE HACE ESPECIAL A YADIRA",
    intro: [
      "Hoy quiero celebrar mucho más que una fecha.",
      "Quiero celebrar a la persona que hace especiales tantos de mis días."
    ],
    phrases: [
      "Su forma de abrazarme.", "Su manera de reírse.", "Sus ocurrencias.",
      "Cómo me habla.", "Cómo me mira.", "La tranquilidad de tenerla a mi lado.",
      "Cada pequeño momento que compartimos.",
      "La manera en que logra hacer especiales incluso los días más sencillos."
    ],
    closing: [
      "Hoy me hace muy feliz poder celebrar sus 19 años a su lado.",
      "Y espero poder seguir creando muchos recuerdos con usted.",
      "Sobre todo, espero hacerla muy feliz."
    ]
  },
  memories: { title: "MAR DE RECUERDOS", subtitle: "Nuestros momentos juntos, guardados con cariño." },
  // Añadir una entrada por fotografía. No es necesario modificar el HTML.
  // { src: "fotos/nombre.jpg", alt: "Descripción breve", caption: "", story: "" }
  gallery: [],
  navigation: { continue: "CONTINUAR LA AVENTURA", close: "Cerrar", viewPhoto: "Ver fotografía" }
};

// YADIRA-004. Editar estos textos y rutas antes de publicar.
// Las fotografías son opcionales: usar "fotos/nombre.jpg" o dejar "".
window.YADIRA_CONTENT.treasure = {
  zoro: {
    image: "onepiece/logo zoro.jpg",
    title: "EL RINCÓN DE ZORO",
    message: "Un pequeño homenaje a su espadachín favorito.",
    find: "ENCONTRAR A ZORO",
    searching: "Buscando a Zoro...",
    error: "ERROR 404",
    lost: "Zoro volvió a perderse.",
    clue: "Pero parece que dejó algo para usted..."
  },
  wanted: {
    template: "onepiece/cartel.jpg",
    title: "WANTED", name: "YADIRA", notice: "DEAD OR ALIVE",
    subtitle: "BIRTHDAY GIRL", reward: "19,000,000", currency: "BERRIES",
    crime: "Delito: robarle el corazón a Edwin.",
    image: "", alt: "Retrato de Yadira", monogram: "Y"
  },
  letter: {
    introduction: "PARA USTED", title: "Para Yadira", open: "ABRIR CARTA",
    close: "Cerrar carta", continue: "CONTINUAR",
    // Carta provisional: personalizar estos párrafos antes de la versión definitiva.
    body: [
      "Feliz cumpleaños, mi amor.",
      "Hoy celebramos sus 19 años, y para mí también es un día muy especial porque tengo la felicidad de poder celebrarlos a su lado.",
      "Quería darle algo que no fuera solamente un regalo, sino un pequeño lugar hecho con tiempo, cariño y recuerdos.",
      "Me hace muy feliz poder compartir este momento con usted.",
      "Espero que cada parte de este viaje consiga hacerla sonreír.",
      "Y más que cualquier otra cosa, deseo seguir estando a su lado, seguir creando recuerdos y seguir buscando maneras de hacerla feliz."
    ]
  },
  birthday: {
    age: 19, name: "YADIRA", title: "Feliz cumpleaños, mi amor.",
    instruction: "Toque las velas para pedir un deseo.", wish: "Deseo guardado. ✦"
  },
  ending: {
    image: "", alt: "Nuestro recuerdo final",
    lines: [
      "Hoy celebramos sus 19.",
      "Y yo celebro también la felicidad de poder estar aquí con usted.",
      "Gracias por cada sonrisa, cada momento y cada recuerdo.",
      "Espero que este sea solamente uno de muchos cumpleaños que pueda celebrar a su lado.",
      "Y espero seguir encontrando nuevas maneras de hacerla feliz."
    ],
    birthday: "Feliz cumpleaños, mi amor.", name: "YADIRA — 19", date: "01 • 10 • 2026",
    signature: "Hecho con amor para Yadira.", author: "Edwin", year: "2026",
    continued: "TO BE CONTINUED →", restart: "Volver al inicio"
  }
};
