// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const jwt = localStorage.getItem("jwt");

// si no hay token, lo saco de esa pantalla
if (!jwt) {
  location.replace("/");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */

  const btnCerrarSesion = document.querySelector("#closeApp");
  const nombreUsuario = document.querySelector(".user-info p");
  const contenedorTareasPendientes =
    document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas =
    document.querySelector(".tareas-terminadas");
  const formCrearTarea = document.querySelector(".nueva-tarea");
  console.log(formCrearTarea);
  const input = document.getElementById("nuevaTarea");
  console.log(input);

  const ENDPOINTBASE = "https://ctd-todo-api.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    const confirmacion = confirm("Seguro desea cerrar sesión?");
    if (confirmacion) {
      // limpiar local storage
      localStorage.removeItem("jwt");
      // redireccionar al inicio
      location.replace("/index.html");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${ENDPOINTBASE}/users/getMe`, configuraciones)
      .then((respuesta) => {
        //console.log("Promesa del fetch CONSULTAR USUARIO----------");
        //console.log(respuesta);
        return respuesta.json();
      })
      .then((data) => {
        //console.log("Promesa del .json() parseado");
        //console.log(data);
        // mostrar el nombre donde corresponde
        nombreUsuario.innerText = data.firstName;
      });
  }

  obtenerNombreUsuario();

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${ENDPOINTBASE}/tasks`, configuraciones)
      .then((respuesta) => {
        //console.log("Promesa del fetch CONSULTAR TAREAS----------");
        //console.log(respuesta);
        return respuesta.json();
      })
      .then((data) => {
        //console.log("Promesa del .json() parseado");
        //console.log(data);
        // uso el listado de data para pintarlas en pantalla👇
        renderizarTareas(data);
      });
  }
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();

    const tarea = {
      description: input.value,
      completed: false,
    };

    // aca desarrollamos el POST de crear tarea
    const configuraciones = {
      method: "POST",
      headers: {
        authorization: jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarea),
    };

    fetch(`${ENDPOINTBASE}/tasks`, configuraciones)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        // uso el listado de data para pintarlas en pantalla👇
        consultarTareas();
      })
      .catch((error) => console.log(error));
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    
    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";

    // filtramos las terminadas y las separamos segun su estado
    const listadoTareasTerminadas = listado.filter((item) => item.completed);
    const listadoTareasPendientes = listado.filter((item) => !item.completed);

    console.log(listadoTareasPendientes);
    console.log(listadoTareasTerminadas);

    listadoTareasPendientes.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${tarea.createdAt}</p>
        </div>
      </li>
      `;
    });
    listadoTareasTerminadas.forEach((tarea) => {
      // por cada tarea inyectamos un nodo li
      contenedorTareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-up">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="change completa" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `;
    });

    const botonesChange = document.querySelectorAll(".change");
    const botonesDelete = document.querySelectorAll(".borrar");

    botonesChange.forEach((boton) => {
      boton.addEventListener("click", function (evento) {
        botonesCambioEstado(evento.target);
      });
    });

    botonesDelete.forEach((boton) => {
      boton.addEventListener("click", function (evento) {
        botonBorrarTarea(evento.target);
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(nodo) {
    console.log(nodo);

    const terminada = nodo.classList.contains("completa");

    const cambio = {
      completed: !terminada,
    };

    const configuraciones = {
      method: "PUT",
      headers: {
        authorization: jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cambio),
    };

    fetch(`${ENDPOINTBASE}/tasks/${nodo.id}`, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((data) => {
        console.log(data);
        consultarTareas();
      });
  }
  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(nodo) {
    console.log(nodo);

    const configuraciones = {
      method: "DELETE",
      headers: {
        authorization: jwt,
        "Content-Type": "application/json",
      },
    };

    fetch(`${ENDPOINTBASE}/tasks/${nodo.id}`, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((data) => {
        console.log(data);
        consultarTareas();
      });
  }
});
