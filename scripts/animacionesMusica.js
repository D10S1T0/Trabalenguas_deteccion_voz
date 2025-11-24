let audioActual = null;
let temporizadorAnimacion = null;

function mostrarAnimacion() {
  const overlayAnimacion = document.getElementById("animationOverlay");
  const imagenAnimacion = document.getElementById("animationImage");
  const textoAnimacion = document.getElementById("animationText");
  const botonSaltar = document.getElementById("skipAnimation");
  
  if (!overlayAnimacion || !imagenAnimacion || !textoAnimacion) return;

  overlayAnimacion.classList.add('activa');

  const mayores = puntuacionesPalabras.filter(w => w.puntuacion >= 5).length;
  const menores = puntuacionesPalabras.filter(w => w.puntuacion < 5).length;
  puntuacionesPalabras.sort((a, b) => mayores >= menores ? a.puntuacion - b.puntuacion : b.puntuacion - a.puntuacion);

  const puntuacionesUnicas = [];
  const puntuacionesVistas = new Set();
  for (const palabra of puntuacionesPalabras) {
    if (!puntuacionesVistas.has(palabra.puntuacion)) {
      puntuacionesVistas.add(palabra.puntuacion);
      puntuacionesUnicas.push(palabra);
    }
  }

  let indiceActual = 0;

  function siguienteImagen() {
    if (indiceActual >= puntuacionesUnicas.length) {
      detenerAnimacion();
      return;
    }

    const palabra = puntuacionesUnicas[indiceActual];
    if (palabra.puntuacion < 1) palabra.puntuacion = 1;

    if (palabra.puntuacion >= 1 && palabra.puntuacion <= 8) {
      imagenAnimacion.src = `imgs/img${palabra.puntuacion}.png`;
      imagenAnimacion.alt = `Puntuación ${palabra.puntuacion}`;
      textoAnimacion.textContent = `Calificaciones obtenidas: ${palabra.puntuacion}/8`;
      
      imagenAnimacion.style.display = 'block';
      
      setTimeout(() => imagenAnimacion.classList.add('activa'), 100);

      if (audioActual) {
        audioActual.pause();
        audioActual.currentTime = 0;
      }

      audioActual = new Audio(`audios/${palabra.puntuacion}.mpeg`);
      audioActual.volume = 0.6;
      audioActual.play().catch(err => console.warn(`Error audio:`, err));

      audioActual.onended = () => {
        imagenAnimacion.classList.remove('activa');
        indiceActual++;
        temporizadorAnimacion = setTimeout(siguienteImagen, 100);
      };
    } else {
      indiceActual++;
      temporizadorAnimacion = setTimeout(siguienteImagen, 100);
    }
  }

  siguienteImagen();
  botonSaltar.onclick = detenerAnimacion;
}

function detenerAnimacion() {
  if (audioActual) {
    audioActual.pause();
    audioActual.currentTime = 0;
    audioActual = null;
  }

  if (temporizadorAnimacion) {
    clearTimeout(temporizadorAnimacion);
    temporizadorAnimacion = null;
  }

  const overlayAnimacion = document.getElementById("animationOverlay");
  const imagenAnimacion = document.getElementById("animationImage");
  
  if (overlayAnimacion) overlayAnimacion.classList.remove('activa');
  if (imagenAnimacion) imagenAnimacion.classList.remove('activa');
}

window.mostrarAnimacion = mostrarAnimacion;
window.detenerAnimacion = detenerAnimacion;