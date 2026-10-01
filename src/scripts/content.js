"use strict";

// Editar aquí el contenido. Las rutas son relativas a index.html.
// Ejemplo de fotografía: image: "fotos/nombre.jpg". No se lista la carpeta.
// Dejar "" cuando no exista fecha, texto o fotografía: no se mostrará un hueco.
// rotation: -90 o 90 corrige la presentación sin modificar la fotografía original.
window.YADIRA_CONTENT = {
  // JOURNEY
  journey: [
    { text: "Hoy celebramos sus 19.", hold: 1600 },
    { text: "Y no podría estar más feliz de vivir este día a su lado.", hold: 3300 },
    { text: "Este regalo está hecho con todo mi amor.", hold: 2500, emphasis: "personal" },
    { text: "Para celebrar los momentos que me ha permitido pasar a su lado.", hold: 3200 },
    { text: "Y la ilusión de seguir creando recuerdos juntos.", hold: 2600 },
    { text: "Bienvenida a nuestra Grand Line.", hold: 1800, emphasis: "welcome" }
  ],

  // TIMELINE
  history: { title: "OUR GRAND LINE", subtitle: "Nuestra historia" },
  timeline: [
    { title: "Donde comenzó todo", date: "", text: "", image: "fotos/comienzo.jpeg", alt: "Donde comenzó nuestra historia" },
    { title: "Nuestra primera cita", date: "", text: "", image: "fotos/primera-cita.jpeg", alt: "Nuestra primera cita" },
    { title: "Nuestro primer beso", date: "", text: "", image: "fotos/primer-beso.jpeg", alt: "Nuestro primer beso", rotation: -90 },
    {
      title: "Un día que siempre voy a recordar", date: "",
      text: "Ese día pude pasar todo el día a su lado, y aunque quizá para alguien más podría parecer un día sencillo, para mí fue realmente especial. Poder compartir tantas horas con usted, hablar, reír, estar juntos y simplemente disfrutar de su compañía hizo que se convirtiera en uno de esos recuerdos que quiero guardar para siempre.",
      image: "fotos/momento-sencillo.jpeg", alt: "Una tarde cualquiera juntos"
    },
    {
      title: "Mi pequeña", date: "",
      text: [
        "Esa niña tan hermosa sigue estando en usted.",
        "Y me hace inmensamente feliz pensar que hoy puedo seguir viendo esos mismos ojitos, esa dulzura y esa pequeña que todavía forma parte de quien es.",
        "Me hace muy feliz poder estar a su lado, verla sonreír y tener la oportunidad de hacer todo lo que esté en mis manos para hacerla feliz.",
        "Hoy, en sus 19 años, solo espero que esa pequeña siga teniendo muchísimas razones para sonreír, soñar y sentirse muy amada."
      ].join("\n\n"),
      image: "fotos/mi-pequena.jpeg", alt: "Yadira de pequeña"
    },
    {
      title: "Hoy", date: "",
      text: [
        "Y aquí estamos, celebrando sus 19.",
        "Me hace muy feliz poder estar a su lado en un día tan especial para usted.",
        "Espero que este cumpleaños se convierta en uno de muchos recuerdos bonitos que podamos seguir construyendo juntos."
      ].join("\n\n"),
      image: "fotos/actualidad.jpeg", alt: "Yadira en la actualidad"
    }
  ],

  // YADIRA
  yadira: {
    title: "LO QUE HACE ESPECIAL A YADIRA",
    intro: [
      "Hoy quiero celebrar mucho más que una fecha.",
      "Quiero celebrar a la persona que hace especiales tantos de mis días."
    ],
    phrases: [
      "Su forma de abrazarme.", "Su manera de reírse.", "Su forma tan dulce de ser conmigo.",
      "Cómo me habla.", "Cómo me mira.", "La tranquilidad de tenerla a mi lado.",
      "Lo feliz que me hace al tenerla conmigo.",
      "La manera en la que trajo de vuelta la felicidad a mi vida.",
      "La forma en la que me ama."
    ],
    closing: [
      "Hoy me hace muy feliz poder celebrar sus 19 años a su lado.",
      "Y espero poder seguir creando muchos recuerdos con usted.",
      "Sobre todo, espero hacerla muy feliz."
    ]
  },

  // GALLERY
  memories: { title: "MAR DE RECUERDOS", subtitle: "Nuestros momentos juntos, guardados con cariño." },
  // Añadir una entrada por fotografía. No es necesario modificar el HTML.
  // { src: "fotos/nombre.jpg", alt: "Descripción breve", caption: "", story: "" }
  gallery: [
    { src: "fotos/galeria-01.jpeg", alt: "Recuerdo juntos, fotografía 1", caption: "", story: "" },
    { src: "fotos/galeria-02.jpeg", alt: "Recuerdo juntos, fotografía 2", caption: "", story: "" },
    { src: "fotos/galeria-03.jpeg", alt: "Recuerdo juntos, fotografía 3", caption: "", story: "" },
    { src: "fotos/galeria-04.jpeg", alt: "Recuerdo juntos, fotografía 4", caption: "", story: "" },
    { src: "fotos/galeria-05.jpeg", alt: "Recuerdo juntos, fotografía 5", caption: "", story: "" },
    { src: "fotos/galeria-06.jpeg", alt: "Recuerdo juntos, fotografía 6", caption: "", story: "" },
    { src: "fotos/galeria-07.jpeg", alt: "Recuerdo juntos, fotografía 7", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-08.jpeg", alt: "Recuerdo juntos, fotografía 8", caption: "", story: "" },
    { src: "fotos/galeria-09.jpeg", alt: "Recuerdo juntos, fotografía 9", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-10.jpeg", alt: "Recuerdo juntos, fotografía 10", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-11.jpeg", alt: "Recuerdo juntos, fotografía 11", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-12.jpeg", alt: "Recuerdo juntos, fotografía 12", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-13.jpeg", alt: "Recuerdo juntos, fotografía 13", caption: "", story: "", rotation: -90 },
    { src: "fotos/galeria-14.jpeg", alt: "Recuerdo juntos, fotografía 14", caption: "", story: "", rotation: -90 }
  ],
  navigation: { continue: "CONTINUAR LA AVENTURA", close: "Cerrar", viewPhoto: "Ver fotografía" }
};

// YADIRA-004. Editar estos textos y rutas antes de publicar.
// Las fotografías son opcionales: usar "fotos/nombre.jpg" o dejar "".
// TREASURE
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
    image: "fotos/wanted-yadira.jpeg", alt: "Retrato de Yadira", monogram: "Y", rotation: -90
  },
  // LETTER
  letter: {
    introduction: "PARA USTED", title: "Para usted, mi amor", open: "ABRIR CARTA",
    close: "Cerrar carta", continue: "CONTINUAR",
    body: [
      "Feliz cumpleaños, mi amor.",
      "Hoy celebra sus 19 años y no sabe lo feliz que me hace poder estar a su lado para compartir un día tan especial con usted.",
      "Quería darle algo diferente. Algo que no fuera solamente un regalo, sino un pequeño lugar construido con recuerdos, fotografías, tiempo y muchísimo amor.",
      "Cada parte de este viaje fue pensada para usted. Para recordarle lo especial que es para mí y lo feliz que me hace poder compartir tantos pequeños momentos a su lado.",
      "Gracias por su forma tan dulce de ser conmigo, por cada abrazo, por cada sonrisa y por la manera en la que me ama.",
      "Me hace muy feliz poder verla sonreír, poder acompañarla y poder seguir descubriendo cada día nuevas razones para quererla todavía más.",
      "Hoy deseo que sus 19 estén llenos de cosas bonitas, de sueños, de tranquilidad y de momentos que pueda recordar con una sonrisa.",
      "Y entre todos esos deseos hay uno que también es muy importante para mí: espero poder seguir estando a su lado y seguir encontrando muchas maneras de hacerla feliz.",
      "Este pequeño mundo existe porque quería regalarle algo que tuviera un pedacito de nosotros.",
      "Feliz cumpleaños, mi pequeña. La amo muchísimo."
    ]
  },
  // BIRTHDAY
  birthday: {
    prelude: "Y después de todo este viaje, solamente queda decir algo muy importante...",
    age: 19, name: "YADIRA", title: "Feliz cumpleaños, mi amor.",
    instruction: "Toque las velas para pedir un deseo.",
    wish: "Deseo guardado. ✦",
    afterWish: "Espero poder ayudar a que muchos de esos deseos se hagan realidad."
  },
  // ENDING
  ending: {
    image: "fotos/final.jpeg", alt: "Nuestro recuerdo final",
    lines: [
      "Hoy celebramos sus 19.",
      "Y yo celebro también la felicidad de poder estar a su lado.",
      "Gracias por cada sonrisa, cada abrazo y cada momento que me ha permitido compartir con usted.",
      "Espero que este sea solamente uno de muchos cumpleaños que pueda celebrar a su lado.",
      "Quiero seguir construyendo recuerdos con usted, acompañarla en sus sueños y seguir encontrando nuevas maneras de hacerla feliz.",
      "Feliz cumpleaños, mi amor."
    ],
    highlight: "Nuestra aventura apenas comienza.",
    highlightDetail: "Todavía nos quedan muchas islas por descubrir.",
    name: "YADIRA — 19", date: "01 • 10 • 2026",
    signature: "Hecho con amor para Yadira.", author: "Edwin", year: "2026",
    continuationLead: "Y esto definitivamente no termina aquí.",
    continued: "TO BE CONTINUED →", restart: "Volver al inicio"
  }
};
