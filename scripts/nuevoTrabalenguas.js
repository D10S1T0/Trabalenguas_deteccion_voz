class AdministradorTrabalenguas {
    constructor() {
        this.contenedorPersonalizado = document.getElementById("customTwisterContainer");
        this.entradaPersonalizado = document.getElementById("customTwisterInput");
        this.botonGuardar = document.getElementById("saveCustomTwister");
        this.botonCancelar = document.getElementById("cancelCustomTwister");
        this.botonNuevo = document.getElementById("customTwisterBtn");
        
        this.inicializarEventos();
    }

    inicializarEventos() {
        this.botonNuevo?.addEventListener("click", () => {
            ocultarImagenPromedio();
            this.mostrarFormulario();
        });
        
        this.botonGuardar?.addEventListener("click", () => {
            ocultarImagenPromedio();
            this.guardarTrabalenguas();
        });
        
        this.botonCancelar?.addEventListener("click", () => {
            ocultarImagenPromedio();
            this.ocultarFormulario();
        });
        
        this.entradaPersonalizado?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                ocultarImagenPromedio();
                this.guardarTrabalenguas();
            }
        });
    }

    mostrarFormulario() {
        if (this.contenedorPersonalizado) this.contenedorPersonalizado.style.display = "block";
        if (this.entradaPersonalizado) {
            this.entradaPersonalizado.value = "";
            this.entradaPersonalizado.focus();
        }
    }

    ocultarFormulario() {
        if (this.contenedorPersonalizado) this.contenedorPersonalizado.style.display = "none";
    }

    guardarTrabalenguas() {
        const texto = this.entradaPersonalizado?.value.trim();
        
        if (!texto) {
            alert("Por favor, escribe un trabalenguas.");
            return;
        }

        if (texto.length < 5) {
            alert("El trabalenguas es muy corto.");
            return;
        }

        trabalenguasLista.push(texto);
        
        if (window.cambiarTrabalenguas) window.cambiarTrabalenguas(texto);

        this.ocultarFormulario();
        this.mostrarMensajeExito();
    }

    mostrarMensajeExito() {
        const mensaje = document.createElement("div");
        mensaje.textContent = "¡Trabalenguas agregado correctamente!";
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bueno);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: bold;
        `;
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            if (document.body.contains(mensaje)) document.body.removeChild(mensaje);
        }, 3000);
    }
}