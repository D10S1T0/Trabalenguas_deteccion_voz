class GeneradorTrabalenguas {
    constructor() {
        this.MODEL = "gemini-2.0-flash-lite";
        this.generarBtn = document.getElementById("generarBtn");
        this.apiKeyInput = document.getElementById("apiKeyInput");
        
        this.inicializarEventos();
    }

    inicializarEventos() {
        this.generarBtn?.addEventListener("click", () => {
            this.generarTrabalenguas();
        });

        // Permitir generar con Enter
        this.apiKeyInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.generarTrabalenguas();
            }
        });
    }

    async generarTrabalenguas() {
        const API_KEY = this.apiKeyInput?.value.trim();
        
        if (!API_KEY) {
            alert("Por favor ingresa tu API Key de Google Gemini.");
            return;
        }

        this.generarBtn.disabled = true;
        this.generarBtn.textContent = "Generando...";

        try {
            const prompt = `Genera 10 trabalenguas en español con estas características:
            - Deben ser trabalenguas auténticos y divertidos
            - Solo texto plano, sin números (1, 2, 3) pero sí puedes usar números escritos (uno, dos, tres)
            - Cada trabalenguas en una línea separada
            - Sin numeración ni formato especial
            - Dificultad variada para practicar pronunciación
            - Ejemplo: "Tres tristes tigres tragaban trigo en un trigal"`;

            const trabalenguas = await this.llamarAPI(API_KEY, prompt);
            this.procesarTrabalenguas(trabalenguas);
            
        } catch (error) {
            console.error("Error generando trabalenguas:", error);
            alert("Error al generar trabalenguas: " + error.message);
        } finally {
            this.generarBtn.disabled = false;
            this.generarBtn.textContent = "Generar Trabalenguas";
        }
    }

    async llamarAPI(apiKey, prompt) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    contents: [
                        { 
                            role: "user", 
                            parts: [{ text: prompt }] 
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("No se recibieron trabalenguas");
        }

        return data.candidates[0].content.parts[0].text;
    }

    procesarTrabalenguas(texto) {
        const lineas = texto.split('\n')
            .map(linea => linea.trim())
            .filter(linea => 
                linea.length > 0 && 
                !linea.startsWith('**') && 
                !linea.match(/^\d+[\.\)]/)
            );

        const nuevosTrabalenguas = lineas.slice(0, 10);

        if (nuevosTrabalenguas.length === 0) {
            alert("No se pudieron generar trabalenguas. Intenta nuevamente.");
            return;
        }

        // Agregar a la lista global
        trabalenguasLista.push(...nuevosTrabalenguas);

        // Cambiar al primer trabalenguas generado
        if (window.cambiarTrabalenguas) {
            window.cambiarTrabalenguas(nuevosTrabalenguas[0]);
        }

        // Actualizar la lista de trabalenguas
        if (window.listaTrabalenguasInstance) {
            window.listaTrabalenguasInstance.actualizar();
        }

        alert(`Se generaron ${nuevosTrabalenguas.length} trabalenguas exitosamente.`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GeneradorTrabalenguas();
});