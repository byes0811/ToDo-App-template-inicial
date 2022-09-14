const jwt = localStorage.getItem("jwt");

if(jwt){
    location.replace("/mis-tareas.html")
}

window.addEventListener('load', function () {


    /* ---------------------- obtenemos variables globales ---------------------- */
   
    const form = document.querySelector("form");
    const inputEmail = document.querySelector("#inputEmail");
    const inputPassword = document.querySelector("#inputPassword");

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
       event.preventDefault();

       console.log("SE HIZO LOGIN-SUBMIT");

       const usuario = {
        email: inputEmail.value,
        password: inputPassword.value,
       }

       realizarLogin(usuario);
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(user) {

        const url= "https://ctd-todo-api.herokuapp.com/v1/users/login";

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