// Variables globales y lista de trabalenguas
let trabalenguasLista = [
  "Tres tristes tigres tragaban trigo en un trigal",
  "Pablito clavó un clavito, ¿qué clavito clavó Pablito?",
  "Pancha plancha con cuatro planchas. ¿Con cuántas planchas plancha Pancha?",
  "El perro de San Roque no tiene rabo porque Ramón Rodríguez se lo ha robado",
  "Pepe Pecas pica papas con un pico; con un pico pica papas Pepe Pecas",
  "La sucesión sucesiva de sucesos sucede sucesivamente con la sucesión del tiempo",
  "Cuando cuentes cuentos, cuenta cuántos cuentos cuentas, porque si no cuentas cuántos cuentos cuentas, nunca sabrás cuántos cuentos sabes contar",
  "R con R cigarro, R con R barril; rápido ruedan los carros cargados de azúcar del ferrocarril",
  "Compré pocas copas, pocas copas compré; como compré pocas copas, pocas copas pagué",
  "Si Sansón no sazona su salsa con sal, sabe sin sal la salsa que Sansón sazona",
  "Al volcán de Parangaricutirimícuaro lo quieren desemparangaricutirimicuarizar; el que lo desemparangaricutirimicuarizare será un buen desemparangaricutirimicuarizador",
  "Juan tuvo un tubo, y el tubo que tuvo se le rompió; y para recuperar el tubo que tuvo, tuvo que comprar un tubo igual al tubo que tuvo",
  "El cielo está enladrillado. ¿Quién lo desenladrillará? El desenladrillador que lo desenladrille, buen desenladrillador será",
  "María Chuchena su choza techaba, y un techador que por allí pasaba le dijo: 'María Chuchena, ¿tú techas tu choza o techas la ajena?'",
  "Pedro Pérez Pereira, pobre pintor, pinta preciosos paisajes por poca plata para poder partir pronto para París",
  "El hipopótamo Hipo está con hipo; ¿quién lo deshipopotamizará? El deshipopotamizador que lo deshipopotamice, buen deshipopotamizador será",
  "Pepe Pótamo patea pelotas por pura práctica para poder patear pronto perfectamente",
  "Rosa Rosales riza su rizo rosado sobre la roca rugosa del río",
  "Bajo el puente de Guadalajara hay un gato que se cuelga la cola al pasar",
  "Camila camina con calma con cien camas cargadas de caramelos",
  "Tu tío Tito tiene un trigo y tres trastos, y todos los trastos están en el trigo de tu tío Tito",
  "Me han dicho que has dicho un dicho, y ese dicho que te han dicho es un dicho mal dicho; y si yo hubiera dicho el dicho que tú dijiste, estaría mejor dicho que el dicho que te han dicho"
];

let trabalenguasActual = trabalenguasLista[0];
let grabando = false;
let transcripcion = "";
let temporizadorGrabacion = null;
let puntuacionesPalabras = [];
let inicioGrabacion = 0;
let tiempoGrabacion = 0;
