function analizarPronunciacion() {
  if (!transcripcion?.trim()) {
    document.getElementById("recognitionStatus").textContent = "No se detectó voz";
    document.getElementById("finalMessage").textContent = "Habla más claro";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    return;
  }

  const analisis = analisisDetallado();
  puntuacionesPalabras = analisis.puntuacionesPalabras;
  
  animarBarraProgreso(analisis.precision);
  mostrarResultados(analisis);
  mostrarImagenPromedio(analisis.precision);

  document.getElementById("recognitionStatus").textContent = "Análisis listo";
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
}

function analisisDetallado() {
  const palabrasEsperadas = trabalenguasActual.toLowerCase().replace(/[.,¿?!¡:;]/g, '').split(' ');
  const palabrasHablas = transcripcion.toLowerCase().replace(/[.,¿?!¡:;]/g, '').trim().split(/\s+/);
  const puntuacionesPalabras = [];
  const palabrasUsadas = new Set(); //Para evitar reutilizar la misma palabra hablada

  let puntuacionTotal = 0;

  palabrasEsperadas.forEach((palabraEsperada, i) => {
    let mejorCoincidencia = null;
    let mejorPuntuacion = 0;
    let mejorIndice = -1;

    //Buscar la mejor coincidencia no utilizada
    for (let j = 0; j < palabrasHablas.length; j++) {
      if (palabrasUsadas.has(j)) continue; //Saltar palabras ya usadas
      
      const similitud = calcularSimilitud(palabraEsperada, palabrasHablas[j]);
      if (similitud > mejorPuntuacion) {
        mejorPuntuacion = similitud;
        mejorCoincidencia = palabrasHablas[j];
        mejorIndice = j;
      }
    }

    if (mejorCoincidencia && mejorPuntuacion >= 0.4) {
      palabrasUsadas.add(mejorIndice); //Marcar como usada
      const puntuacionFinal = Math.max(1, Math.round(mejorPuntuacion * 8));
      
      puntuacionesPalabras.push({
        esp: palabraEsperada,
        hab: mejorCoincidencia,
        puntuacion: puntuacionFinal,
        calidad: puntuacionFinal >= 6 ? "buena" : puntuacionFinal >= 3 ? "media" : "mala"
      });
      puntuacionTotal += puntuacionFinal;
    } else {
      puntuacionesPalabras.push({
        esp: palabraEsperada,
        hab: "(no detectada)",
        puntuacion: 0,
        calidad: "mala"
      });
    }
  });

  const precision = (puntuacionTotal / (palabrasEsperadas.length * 8)) * 100;
  return { puntuacionesPalabras, precision };
}

function calcularSimilitud(pal1, pal2) {
  if (pal1 === pal2) return 1.0;
  
  const maxLen = Math.max(pal1.length, pal2.length);
  if (maxLen === 0) return 0;
  
  let coincidencias = 0;
  const minLen = Math.min(pal1.length, pal2.length);
  
  for (let i = 0; i < minLen; i++) {
    if (pal1[i] === pal2[i]) coincidencias++;
  }
  
  return coincidencias / maxLen;
}

function animarBarraProgreso(porcentajeFinal) {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;
  
  let porcentajeActual = 0;
  const animar = () => {
    porcentajeActual += 2;
    if (porcentajeActual >= porcentajeFinal) {
      progressBar.style.width = porcentajeFinal + "%";
      return;
    }
    progressBar.style.width = porcentajeActual + "%";
    requestAnimationFrame(animar);
  };
  animar();
}

function mostrarImagenPromedio(porcentaje) {
  const calificacion = Math.max(1, Math.min(8, Math.round(porcentaje * 8 / 100)));
  const container = document.getElementById("imagenPromedioContainer");
  const imagen = document.getElementById("imagenPromedio");
  
  if (container && imagen) {
    imagen.src = `imgs/img${calificacion}.png`;
    imagen.alt = `Calificación ${calificacion}/8`;
    container.style.display = "block";
  }
}

function ocultarImagenPromedio() {
  document.getElementById("imagenPromedioContainer").style.display = "none";
}

function mostrarResultados(analisis) {
  const globalScore = document.getElementById("globalScore");
  const finalMessage = document.getElementById("finalMessage");
  const wordTable = document.getElementById("wordTable");
  
  if (globalScore) globalScore.textContent = `${Math.round(analisis.precision)}%`;
 
  if (finalMessage) {
    if (analisis.precision >= 80) {
      finalMessage.textContent = "¡Excelente!";
      finalMessage.style.color = "var(--bueno)";
    } else if (analisis.precision >= 60) {
      finalMessage.textContent = "Bueno, puede mejorar";
      finalMessage.style.color = "#eab308";
    } else {
      finalMessage.textContent = "Practica más";
      finalMessage.style.color = "var(--malo)";
    }
  }
 
  if (wordTable) {
    wordTable.innerHTML = `
      <div class="puntuacion-palabra encabezado">
        <span class="texto-palabra">Dicho</span>
        <span class="texto-palabra">Original</span>
        <span>Puntuación</span>
      </div>
    `;
    
    analisis.puntuacionesPalabras.forEach(item => {
      const fila = document.createElement("div");
      fila.className = "puntuacion-palabra";
      fila.innerHTML = `
        <span class="texto-palabra">${item.hab}</span>
        <span class="texto-palabra">${item.esp}</span>
        <span class="insignia-puntuacion ${item.calidad}">${item.puntuacion}/8</span>
      `;
      wordTable.appendChild(fila);
    });
  }
}

window.analizarPronunciacion = analizarPronunciacion;
window.ocultarImagenPromedio = ocultarImagenPromedio;
window.mostrarImagenPromedio = mostrarImagenPromedio;