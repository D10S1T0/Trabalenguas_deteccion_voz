class GeneradorTrabalenguas {
    constructor() {
        // Configuración específica para OpenRouter
        this.MODEL = "gpt-4o-mini"; // Modelo de OpenRouter
        this.generarBtn = document.getElementById("generarBtn");
        this.apiKeyInput = document.getElementById("apiKeyInput");
        
        this.inicializarEventos();
    }

    inicializarEventos() {
        this.generarBtn?.addEventListener("click", () => {
            this.generarTrabalenguas();
        });

        //Permitir generar con Enter
        this.apiKeyInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.generarTrabalenguas();
            }
        });
    }

    async generarTrabalenguas() {
        const API_KEY = this.apiKeyInput?.value.trim();
        
        if (!API_KEY) {
            alert("Por favor ingresa tu API Key de OpenRouter.");
            return;
        }

        this.generarBtn.disabled = true;
        this.generarBtn.textContent = "Generando...";

        try {
            //Prompt para generar los 10 trabalenguas
            const prompt = `Genera 10 trabalenguas en español con estas características:
            - Deben ser trabalenguas auténticos y divertidos
            - Solo texto plano, sin números (1, 2, 3) pero sí puedes usar números escritos (uno, dos, tres)
            - Cada trabalenguas en una línea separada
            - Sin numeración ni formato especial
            - Sí el trabalenguas pide pronunciar solo una letra como R cambiala por erre, ejemplo erre con erre cigarro
            - Dificultad variada para practicar pronunciación
            - Ejemplo: "Tres tristes tigres tragaban trigo en un trigal"`;

            const trabalenguas = await this.llamarAPIOpenRouter(API_KEY, prompt);
            this.procesarTrabalenguas(trabalenguas);
            
        } catch (error) {
            console.error("Error generando trabalenguas:", error);
            alert("Error al generar trabalenguas: " + error.message);
        } finally {
            this.generarBtn.disabled = false;
            this.generarBtn.textContent = "Generar Trabalenguas";
        }
    }

    async llamarAPIOpenRouter(apiKey, prompt) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin || "http://localhost",
                "X-Title": "Generador de Trabalenguas"
            },
            body: JSON.stringify({
                model: this.MODEL,
                messages: [
                    { 
                        role: "system", 
                        content: "Eres un experto en lengua española especializado en crear trabalenguas divertidos y creativos." 
                    },
                    { 
                        role: "user", 
                        content: prompt 
                    }
                ],
                max_tokens: 1000,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Error ${response.status}: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices?.[0]?.message?.content) {
            throw new Error("No se recibieron trabalenguas de la API");
        }

        return data.choices[0].message.content;
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
            alert("No se pudieron generar trabalenguas. Intenta con un prompt más específico.");
            return;
        }

        if (typeof trabalenguasLista !== 'undefined') {
            trabalenguasLista.push(...nuevosTrabalenguas);
        }

        if (window.cambiarTrabalenguas && nuevosTrabalenguas.length > 0) {
            window.cambiarTrabalenguas(nuevosTrabalenguas[0]);
        }

        if (window.listaTrabalenguasInstance) {
            window.listaTrabalenguasInstance.actualizar();
        }

        alert(`Se generaron ${nuevosTrabalenguas.length} trabalenguas exitosamente.`);
    }
}

//Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GeneradorTrabalenguas();
});