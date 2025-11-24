const trabalenguasLista = [
  "Tres tristes tigres tragaban trigo en un trigal",
  "Pablito clavó un clavito, ¿qué clavito clavó Pablito?"
];

let trabalenguasActual = trabalenguasLista[0];
let grabando = false;
let transcripcion = "";
let temporizadorGrabacion = null;
let puntuacionesPalabras = [];
let inicioGrabacion = 0;
let tiempoGrabacion = 0;