class ListaTrabalenguas {
    constructor() {
        this.listaElement = document.getElementById("listaTrabalenguas");
        
        this.inicializar();
        this.actualizarLista();
    }

    inicializar() {
        // Actualizar lista cuando cambie el trabalenguas actual
        const originalCambiarTrabalenguas = window.cambiarTrabalenguas;
        window.cambiarTrabalenguas = (nuevoTrabalenguas) => {
            if (originalCambiarTrabalenguas) {
                originalCambiarTrabalenguas(nuevoTrabalenguas);
            }
            this.actualizarLista();
        };

        // Observar cambios en la lista
        this.observarCambiosLista();
    }

    observarCambiosLista() {
        const self = this;
        trabalenguasLista = new Proxy(trabalenguasLista, {
            set(target, property, value) {
                const result = Reflect.set(target, property, value);
                setTimeout(() => self.actualizarLista(), 0);
                return result;
            }
        });

        const originalPush = Array.prototype.push;
        Array.prototype.push = function() {
            const result = originalPush.apply(this, arguments);
            if (this === trabalenguasLista) {
                setTimeout(() => self.actualizarLista(), 0);
            }
            return result;
        };
    }

    actualizarLista() {
        if (!this.listaElement) return;

        if (trabalenguasLista.length === 0) {
            this.listaElement.innerHTML = '';
            return;
        }

        let contenidoHTML = '';
        
        trabalenguasLista.forEach((trabalenguas, index) => {
            const esActual = trabalenguas === trabalenguasActual;
            const numero = (index + 1).toString().padStart(2, '0');
            
            if (esActual) {
                contenidoHTML += `<span style="color: #22c55e; font-weight: bold;">${numero}. ${trabalenguas}</span>\n\n`;
            } else {
                contenidoHTML += `<span>${numero}. ${trabalenguas}</span>\n\n`;
            }
        });

        this.listaElement.innerHTML = contenidoHTML;
    }

    actualizar() {
        this.actualizarLista();
    }
}

let listaTrabalenguasInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    listaTrabalenguasInstance = new ListaTrabalenguas();
    window.listaTrabalenguasInstance = listaTrabalenguasInstance;
});