function mostrarCalculadora() {
    const calculadora = document.getElementById("calculadora");

    calculadora.classList.toggle("oculto");
}

function mostrarMensaje() {
    alert("Esta herramienta llegará en una próxima actualización 😎");
}

function calcular(operacion) {

    const numero1 = Number(document.getElementById("numero1").value);
    const numero2 = Number(document.getElementById("numero2").value);

    let resultado;

    if (operacion === "+") {
        resultado = numero1 + numero2;
    }

    if (operacion === "-") {
        resultado = numero1 - numero2;
    }

    if (operacion === "*") {
        resultado = numero1 * numero2;
    }

    if (operacion === "/") {

        if (numero2 === 0) {
            resultado = "No se puede dividir entre 0 💀";
        } else {
            resultado = numero1 / numero2;
        }

    }

    document.getElementById("resultado").textContent =
        "Resultado: " + resultado;
}
function mostrarNotas() {
    const notas = document.getElementById("notas");

    notas.classList.toggle("oculto");

    const textoGuardado = localStorage.getItem("juantools_notas");

    if (textoGuardado !== null) {
        document.getElementById("textoNotas").value = textoGuardado;
        document.getElementById("estadoNotas").textContent =
            "Notas recuperadas ✅";
    }
}

function guardarNotas() {
    const texto = document.getElementById("textoNotas").value;

    localStorage.setItem("juantools_notas", texto);

    document.getElementById("estadoNotas").textContent =
        "Guardado correctamente ✅";
}

function borrarNotas() {
    localStorage.removeItem("juantools_notas");

    document.getElementById("textoNotas").value = "";

    document.getElementById("estadoNotas").textContent =
        "Notas borradas 🗑️";
}
let tiempo = 0;
let intervalo = null;

function mostrarCronometro() {
    const cronometro = document.getElementById("cronometro");

    cronometro.classList.toggle("oculto");
}

function actualizarTiempo() {

    tiempo++;

    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor((tiempo % 3600) / 60);
    const segundos = tiempo % 60;

    const h = String(horas).padStart(2, "0");
    const m = String(minutos).padStart(2, "0");
    const s = String(segundos).padStart(2, "0");

    document.getElementById("tiempo").textContent =
        `${h}:${m}:${s}`;
}

function iniciarCronometro() {

    if (intervalo !== null) {
        return;
    }

    intervalo = setInterval(actualizarTiempo, 1000);
}

function pausarCronometro() {

    clearInterval(intervalo);
    intervalo = null;
}

function reiniciarCronometro() {

    clearInterval(intervalo);

    intervalo = null;
    tiempo = 0;

    document.getElementById("tiempo").textContent = "00:00:00";
}
