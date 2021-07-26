// varibles y selectores 

const formulario = document.querySelector("#agregar-gasto");
const GastoListado = document.querySelector("#gastos ul");

//Eventos
Eventos();

function Eventos () {
    document.addEventListener("DOMContentLoaded",PreguntarPresupuesto)
    formulario.addEventListener("submit",AgregarGasto);
}


// Clases
 class Presupuesto {
     constructor (presupuesto) {
         this.presupuesto = Number(presupuesto);
         this.restante = Number(presupuesto);
         this.gasto = [];
     }
     NuevoGasto (gasto) {
         this.gasto = [...this.gasto,gasto];
         console.log(this.gasto);
         this.CarcularRestante();
 
     }
     CarcularRestante () {
        const gastado = this.gasto.reduce( (total, gasto ) => total + gasto.CantidadGasto, 0 )
        console.log(gastado); 
        this.restante = this.presupuesto - gastado;
     }

     eliminarGasto (id) {
         this.gasto = this.gasto.filter( gasto => gasto.id !== id)
         this.CarcularRestante();

     }
 }

 class UI {

     insertarPresupuesto (cantidad) {
         //Creamos variables
        const {presupuesto, restante } = cantidad;

        // insertamos en el HTML

        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
     }

     MostrarAlerta (mensaje,tipo) {
         const div = document.createElement("div");
         div.classList.add("text-center","alert")

         if (tipo === "error" ) {
            div.classList.add("alert-danger");
         } else {
            div.classList.add("alert-success");
         }

         div.textContent = mensaje;

         document.querySelector(".primario").insertBefore(div,formulario);

         setTimeout(() => {
                div.remove();
         }, 2500);
     }

     AgregarGastoLista (gasto) {
        this.limpiarHTML();

         //iterar sobre los gasto
         console.log(gasto);

         gasto.forEach(elemento => {
            const {NombreGasto, CantidadGasto, id} = elemento;


            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between alig-items-center";
            li.dataset.id = id;

            li.innerHTML = `
                ${NombreGasto} : <span class = "badge badge-primary badge-pill" > ${CantidadGasto} COP </span>
            `;

            const btnborrar = document.createElement("button");
            btnborrar.textContent = "X";
            btnborrar.style.color = "#FFF";
            btnborrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnborrar.onclick = () => {
                eliminarGasto(id);
            }
            
            li.appendChild(btnborrar);

            GastoListado.appendChild(li);
             
         });
     }
     limpiarHTML() {
        while (GastoListado.firstChild) {
            GastoListado.removeChild(GastoListado.firstChild);
        }
    }

    ActualizarRestante (restante) {
        document.querySelector("#restante").textContent = restante;
    }

    ComprobarPresupuesto (presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const RestanteDiv = document.querySelector(".restante");
        if ( (presupuesto / 4) > restante ) {
            RestanteDiv.classList.remove("alert-success");
            RestanteDiv.classList.add("alert-danger");
        } else if ((presupuesto / 2) > restante) {
            RestanteDiv.classList.remove("alert-success");
            RestanteDiv.classList.add("alert-warning");
        } else {
            RestanteDiv.classList.remove("alert-danger","alert-warning");
            RestanteDiv.classList.add("alert-success")
        }

        if (restante <= 0) {
            ui.MostrarAlerta("Se agoto el presupuesto","error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }

 }

 const ui = new UI();

 let presupuesto;

// funciones
function PreguntarPresupuesto () {

    const PresupuestoUsuario = prompt("¿Cual es tu presupuesto de esta semana?");
    Number(PresupuestoUsuario);
    if (PresupuestoUsuario === "" || PresupuestoUsuario === null || isNaN(PresupuestoUsuario) || PresupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(PresupuestoUsuario);

    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function AgregarGasto (e) {
    e.preventDefault();

    const NombreGasto = document.querySelector("#gasto").value;
    const CantidadGasto = Number(document.querySelector("#cantidad").value);

    if (NombreGasto === "" || CantidadGasto === "") {
        ui.MostrarAlerta("Ambos campos son obligatorios","error");
        return;
    } else if (CantidadGasto <= 0 || isNaN(CantidadGasto)) {
        ui.MostrarAlerta("La cantidad no es valida","error");
        return;
    }

    const Gasto = {NombreGasto,CantidadGasto, id: Date.now()};
    
    presupuesto.NuevoGasto(Gasto);
    // mensaje de correcto

    ui.MostrarAlerta("Correcto");

    //Imprimir el HTML
    const {gasto, restante } = presupuesto;
    ui.AgregarGastoLista(gasto);

    //Actualizar Restante

    ui.ActualizarRestante(restante);

    //Comprobar Presupuesto 
    ui.ComprobarPresupuesto (presupuesto);

    // reinicia el formulario

    formulario.reset();
}

function eliminarGasto (id) {
    presupuesto.eliminarGasto(id);
    const {gasto, restante} = presupuesto;
    ui.AgregarGastoLista(gasto);

    //Actualizar Restante

    ui.ActualizarRestante(restante);

    //Comprobar Presupuesto 
    ui.ComprobarPresupuesto (presupuesto);
}