document.addEventListener("DOMContentLoaded", () => {
    const detectorVoz = new DetectorVoz();

    const esperarTrabalenguas = setInterval(() => {
        if (typeof trabalenguasActual !== "undefined" && trabalenguasActual !== null) {
            clearInterval(esperarTrabalenguas);
            const indice = trabalenguasLista.indexOf(trabalenguasActual);
            cambiarTrabalenguas(
                trabalenguasLista[(indice - 1 + trabalenguasLista.length) % trabalenguasLista.length]
            );
            if (window.listaTrabalenguasInstance) {
                window.listaTrabalenguasInstance.actualizar();
            }
        }
    }, 50);

    const elements = {
        startBtn: document.getElementById("startBtn"),
        stopBtn: document.getElementById("stopBtn"),
        recognitionStatus: document.getElementById("recognitionStatus"),
        twisterDisplay: document.getElementById("twisterDisplay"),
        showAnimationBtn: document.getElementById("showAnimationBtn")
    };

    if (elements.twisterDisplay && trabalenguasActual) {
        elements.twisterDisplay.textContent = trabalenguasActual;
    }

    const ocultarImagenPromedioSiEsNecesario = (boton) => 
        boton?.id !== 'showAnimationBtn' && ocultarImagenPromedio();

    const actualizarEstadoGrabacion = (grabando) => {
        elements.startBtn.disabled = grabando;
        elements.stopBtn.disabled = !grabando;
        
        if (elements.recognitionStatus) {
            if (grabando) {
                elements.recognitionStatus.textContent = "Grabando...";
                elements.recognitionStatus.className = "pequeno-tenue grabando";
            } else {
                elements.recognitionStatus.textContent = "Procesando...";
                elements.recognitionStatus.className = "pequeno-tenue procesando";
                setTimeout(() => {
                    elements.recognitionStatus.textContent = "Micrófono inactivo";
                    elements.recognitionStatus.className = "pequeno-tenue";
                }, 2000);
            }
        }
    };

    elements.startBtn?.addEventListener("click", (e) => {
        ocultarImagenPromedioSiEsNecesario(e.target);
        detectorVoz.reiniciarTranscripcion();
        const exito = detectorVoz.iniciarGrabacion();
        exito ? actualizarEstadoGrabacion(true) : alert("No se pudo iniciar la grabación");
    });

    elements.stopBtn?.addEventListener("click", (e) => {
        ocultarImagenPromedioSiEsNecesario(e.target);
        detectorVoz.detenerGrabacion();
        actualizarEstadoGrabacion(false);
    });

    elements.showAnimationBtn?.addEventListener("click", (e) => {
        puntuacionesPalabras?.length > 0 ? mostrarAnimacion() : alert("Primero debes realizar un análisis");
    });

    document.getElementById("anteriorBtn")?.addEventListener("click", (e) => {
        ocultarImagenPromedioSiEsNecesario(e.target);
        const indice = trabalenguasLista.indexOf(trabalenguasActual);
        cambiarTrabalenguas(trabalenguasLista[(indice - 1 + trabalenguasLista.length) % trabalenguasLista.length]);
        if (window.listaTrabalenguasInstance) {
            window.listaTrabalenguasInstance.actualizar();
        }
    });

    document.getElementById("siguienteBtn")?.addEventListener("click", (e) => {
        ocultarImagenPromedioSiEsNecesario(e.target);
        const indice = trabalenguasLista.indexOf(trabalenguasActual);
        cambiarTrabalenguas(trabalenguasLista[(indice + 1) % trabalenguasLista.length]);
        if (window.listaTrabalenguasInstance) {
            window.listaTrabalenguasInstance.actualizar();
        }
    });

    window.cambiarTrabalenguas = (nuevoTrabalenguas) => {
        trabalenguasActual = nuevoTrabalenguas;
        document.getElementById("twisterDisplay").textContent = trabalenguasActual;
        detectorVoz.actualizarTranscripcionUI();
        
        document.getElementById("wordTable").innerHTML = `
            <div class="puntuacion-palabra encabezado">
                <span class="texto-palabra">Original</span>
                <span class="texto-palabra">Dicho</span>
                <span class="insignia-puntuacion">Puntuación</span>
            </div>
        `;
        
        document.getElementById("globalScore").textContent = "0%";
        document.getElementById("progressBar").style.width = "0%";
        document.getElementById("finalMessage").textContent = "";
        
        transcripcion = "";
        puntuacionesPalabras = [];
        tiempoGrabacion = 0;
        detectorVoz.reiniciarTranscripcion();
    };
});