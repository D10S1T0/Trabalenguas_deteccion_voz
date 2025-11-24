class DetectorVoz {
    constructor() {
        this.recognition = null;
        this.grabando = false;
        this.transcripcionCompleta = "";
        this.ultimoTextoFinal = "";
        this.inicializarReconocimiento();
    }

    inicializarReconocimiento() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return false;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = "es-MX";
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.configurarEventos();
        return true;
    }

    configurarEventos() {
        this.recognition.onstart = () => {
            grabando = true;
            inicioGrabacion = Date.now();
            transcripcion = this.transcripcionCompleta = this.ultimoTextoFinal = "";
            
            temporizadorGrabacion = setInterval(() => {
                tiempoGrabacion = Math.floor((Date.now() - inicioGrabacion) / 1000);
                this.actualizarTranscripcionUI();
            }, 500);
            
            document.getElementById("recognitionStatus").textContent = "Grabando...";
            document.getElementById("recognitionStatus").className = "pequeno-tenue grabando";
            this.actualizarTranscripcionUI();
        };

        this.recognition.onresult = (event) => {
            let textoFinal = "", textoIntermedio = "";
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const resultado = event.results[i];
                const texto = resultado[0].transcript.trim();
                resultado.isFinal ? textoFinal += texto + " " : textoIntermedio = texto;
            }

            if (textoFinal) this.procesarTextoFinal(textoFinal);
            textoIntermedio ? this.mostrarTextoIntermedio(textoIntermedio) : this.actualizarTranscripcionUI();
        };

        this.recognition.onend = () => this.grabando && this.recognition.start();
        this.recognition.onerror = (event) => {
            if (!['no-speech', 'audio-capture'].includes(event.error)) this.detenerGrabacion();
        };
    }

    esTextoNuevo = texto => !this.ultimoTextoFinal || this.calcularSimilitud(this.ultimoTextoFinal, texto) < 0.7;

    calcularSimilitud(texto1, texto2) {
        const palabras1 = new Set(texto1.toLowerCase().split(/\s+/));
        const palabras2 = new Set(texto2.toLowerCase().split(/\s+/));
        const coincidencias = [...palabras1].filter(p => palabras2.has(p)).length;
        const totalUnicas = new Set([...palabras1, ...palabras2]).size;
        return totalUnicas > 0 ? coincidencias / totalUnicas : 0;
    }

    procesarTextoFinal(textoFinal) {
        const textoLimpio = textoFinal.replace(/\s+/g, ' ').replace(/([.,!?;:])\s*/g, '$1 ').trim();
        if (textoLimpio && this.esTextoNuevo(textoLimpio)) {
            this.transcripcionCompleta = this.transcripcionCompleta ? `${this.transcripcionCompleta} ${textoLimpio}` : textoLimpio;
            this.ultimoTextoFinal = textoLimpio;
            transcripcion = this.transcripcionCompleta;
            this.actualizarTranscripcionUI();
        }
    }

    mostrarTextoIntermedio(textoIntermedio) {
        const element = document.getElementById("transcripcionContinua");
        if (!element) return;
        
        const contenido = `${this.transcripcionCompleta ? this.transcripcionCompleta + " " : ""}<em>${textoIntermedio}</em>\n\n${this.generarEstadisticas()}`;
        element.innerHTML = contenido;
        element.scrollTop = element.scrollHeight;
    }

    actualizarTranscripcionUI() {
        const element = document.getElementById("transcripcionContinua");
        if (!element) return;
        
        const contenido = `${this.transcripcionCompleta ? this.transcripcionCompleta + "\n\n" : "Habla ahora...\n\n"}${this.generarEstadisticas()}`;
        element.innerHTML = contenido;
        element.scrollTop = element.scrollHeight;
    }

    generarEstadisticas() {
        if (!trabalenguasActual) return "--- ESTADÍSTICAS ---\nTiempo: " + tiempoGrabacion + "s";
        
        const palabrasTwister = trabalenguasActual.split(/\s+/).filter(w => w.length > 0);
        const palabrasDetectadas = this.transcripcionCompleta ? this.transcripcionCompleta.split(/\s+/).filter(w => w.length > 0).length : 0;
        
        let coincidencias = 0;
        if (this.transcripcionCompleta) {
            const transcripcionLower = this.transcripcionCompleta.toLowerCase();
            coincidencias = palabrasTwister.filter(palabra => transcripcionLower.includes(palabra.toLowerCase())).length;
        }
        
        const porcentaje = Math.round((coincidencias / palabrasTwister.length) * 100);
        
        return `--- ESTADÍSTICAS ---
Trabalenguas: ${trabalenguasActual}
Palabras del trabalenguas: ${palabrasTwister.length}
Palabras detectadas: ${palabrasDetectadas}
Coincidencias: ${coincidencias}/${palabrasTwister.length} (${porcentaje}%)
Tiempo: ${tiempoGrabacion}s`;
    }

    iniciarGrabacion() {
        if (!this.recognition) {
            alert('Reconocimiento de voz no disponible');
            return false;
        }
        try {
            this.recognition.start();
            this.grabando = true;
            return true;
        } catch (error) {
            return false;
        }
    }

    detenerGrabacion() {
        if (this.recognition && this.grabando) {
            this.recognition.stop();
            this.grabando = grabando = false;
            
            if (temporizadorGrabacion) {
                clearInterval(temporizadorGrabacion);
                temporizadorGrabacion = null;
            }
            
            this.actualizarTranscripcionUI();
            
            const status = document.getElementById("recognitionStatus");
            if (status) {
                status.textContent = "Procesando...";
                status.className = "pequeno-tenue procesando";
            }
            
            setTimeout(() => typeof analizarPronunciacion === 'function' && analizarPronunciacion(), 500);
        }
    }

    // Eliminadas las funciones innecesarias que mencionaste
    reiniciarTranscripcion() {
        transcripcion = this.transcripcionCompleta = this.ultimoTextoFinal = "";
        this.actualizarTranscripcionUI();
    }
}