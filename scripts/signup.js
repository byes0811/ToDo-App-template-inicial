window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   
    const form = document.querySelector("form");
    const nombre = document.querySelector("#inputNombre");
    const apellido = document.querySelector("#inputApellido");
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        console.log("SE HIZO SIGNUP-SUBMIT");
 
        const usuario = {
         firstName: nombre.value,
         lastName: apellido.value,
         email: email.value,
         password: password.value,
        }
 
        realizarRegister(usuario);
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(user) {
        
        const url= "https://ctd-todo-api.herokuapp.com/v1/users";

        const configuraciones = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        }

        fetch(url, configuraciones)
        .then((respuesta)=> respuesta.json())
        .then((data)=>{
            console.log("RESPUESTA DEL SERVIDOR: " + data);

            if(data.jwt){
                localStorage.setItem("jwt", data.jwt);

                location.replace("/mis-tareas.html");
            }
        })
    };
});