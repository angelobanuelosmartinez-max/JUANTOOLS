const estadosUsuarios = {};
function abrirCalculadora() {
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

/* JUANTOOLS 1.1.1 - MODO OSCURO */


 function alternarModoOscuro(boton) {
    document.body.classList.toggle("modo-oscuro");

    if (document.body.classList.contains("modo-oscuro")) {
        boton.textContent = "☀️ Modo claro";
    } else {
        boton.textContent = "🌙 Modo oscuro";
    }
}


console.log("JUANTOOLS: JavaScript cargado correctamente");







let estiloPantalla = 0;

function cambiarEstiloPantalla() {
    document.body.classList.toggle("estilo-oscuro");
}


function cerrarFuncionAnimada(elemento) {

    elemento.classList.add("cerrando");

    setTimeout(() => {
        elemento.classList.add("oculto");
        elemento.classList.remove("cerrando");
    }, 250);
}


function alternarFuncion(id) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    if (id === "juantssapp") {

        if (elemento.classList.contains("oculto")) {
            elemento.classList.remove("oculto");
            elemento.classList.remove("cerrando");
        } else {
            elemento.classList.add("oculto");
        }

        return;
    }

    if (elemento.classList.contains("oculto")) {

        elemento.classList.remove("oculto");
        elemento.classList.remove("cerrando");

        if (id === "notas") {

            const textoGuardado = localStorage.getItem("juantools_notas");

            if (textoGuardado !== null) {
                document.getElementById("textoNotas").value = textoGuardado;
                document.getElementById("estadoNotas").textContent =
                    "Notas recuperadas ✅";
            }
        }

    } else {

        cerrarFuncionAnimada(elemento);
    }
}

/* JUANTOOLS 1.2.0 - CUENTAS */

function registrarse() {

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    if (usuario === "" || contrasena === "") {
        document.getElementById("estadoCuenta").textContent =
            "Completa todos los campos ⚠️";
        return;
    }

    const cuenta = {
        usuario: usuario,
        contrasena: contrasena
    };

    localStorage.setItem("juantools_cuenta", JSON.stringify(cuenta));

    document.getElementById("estadoCuenta").textContent =
        "Cuenta creada correctamente ✅";
}

async function iniciarSesion() {

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const estado = document.getElementById("estadoCuenta");

    if (usuario === "" || contrasena === "") {
        estado.textContent = "Completa todos los campos ⚠️";
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: usuario,
                    contrasena: contrasena
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            estado.textContent =
                datos.mensaje || "Usuario o contraseña incorrectos ❌";
            return;
        }

        estado.textContent =
            "Sesión iniciada correctamente ✅";
        solicitarNotificaciones();

        localStorage.setItem(
            "juantools_sesion",
            datos.usuario.username
        );

        await cargarContactosReales();
        mostrarContactosReales();

    } catch (error) {

        estado.textContent =
            "No se pudo conectar con el servidor ⚠️";

        console.error("❌ Error de login:", error);
    }
}

function cerrarSesion() {

    if (typeof socket !== "undefined" && socket.connected) socket.disconnect();
    localStorage.removeItem("juantools_sesion");

    document.getElementById("estadoCuenta").textContent =
        "Sesión cerrada 🔴";
}

async function restaurarSesion() {

    const sesion = localStorage.getItem("juantools_sesion");

    if (sesion !== null) {

        const estado = document.getElementById("estadoCuenta");

        if (estado) {
            estado.textContent =
                "Sesión activa: " + sesion + " 🟢";
        }

        console.log("🔄 Restaurando sesión:", sesion);

        await cargarContactosReales();
        mostrarContactosReales();

        console.log("👥 Contactos restaurados");
    }
}


function cambiarFotoPerfil(event) {

    const archivo = event.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function() {

        const foto = lector.result;

        localStorage.setItem("juantools_foto", foto);

        document.getElementById("fotoPerfil").src = foto;
        document.getElementById("fotoPerfil").style.display = "block";
    };

    lector.readAsDataURL(archivo);
}

function mostrarEtiquetaUsuario() {

    const sesion = localStorage.getItem("juantools_sesion");

    if (sesion !== null) {

        const etiqueta = "Fundador";

        const elementoEtiqueta = document.getElementById("etiquetaUsuario"); if (elementoEtiqueta) elementoEtiqueta.textContent =
            sesion + " (" + etiqueta + ")";
    }
}

mostrarEtiquetaUsuario();

function restaurarFotoPerfil() {

    const fotoGuardada = localStorage.getItem("juantools_foto");

    if (fotoGuardada !== null) {

        const foto = document.getElementById("fotoPerfil");

        if (foto) foto.src = fotoGuardada;
        if (foto) foto.style.display = "block";
    }
}

restaurarFotoPerfil();

/* JUANTSSAPP V0.3 - MENSAJES */

var chatActual = null;

async function enviarMensaje() {

    const input =
        document.getElementById("mensajeInput");

    if (!input) {
        console.error("❌ No existe mensajeInput");
        return;
    }

    const texto = input.value.trim();

    if (texto === "") {
        return;
    }

    if (chatActual === null) {
        console.error("❌ No hay chat seleccionado");
        return;
    }

    const usuarioActual =
        obtenerUsuarioActual();

    if (!usuarioActual) {
        console.error("❌ No hay sesión activa");
        return;
    }

    const contactos =
        window.contactosReales || [];

    const contacto = contactos.find(
        c => c.nombre === chatActual
    );

    if (!contacto) {
        console.error(
            "❌ Contacto no encontrado:",
            chatActual
        );
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/messages/send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    de: usuarioActual,
                    para: contacto.username,
                    texto: texto
                })
            }
        );

        const datos =
            await respuesta.json();

        console.log(
            "📨 RESPUESTA SERVIDOR:",
            datos
        );

        if (!respuesta.ok) {
            console.error(
                "❌ Servidor rechazó mensaje:",
                datos
            );
            return;
        }

        input.value = "";

        await cargarMensajesReales(
            contacto.username
        );

          const contenedorMensajes = document.getElementById("mensajes");

          if (contenedorMensajes) {
              contenedorMensajes.scrollTo({
                  top: contenedorMensajes.scrollHeight,
                  behavior: "smooth"
              });
          }

        console.log(
            "✅ MENSAJE ENVIADO A:",
            contacto.username
        );

    } catch (error) {

        console.error(
            "❌ ERROR FETCH:",
            error
        );
    }
}

function mostrarMensajes() {

    const contenedor =
        document.getElementById("mensajes");

    if (!contenedor || chatActual === null) {
        return;
    }

    const clave =
        "juantssapp_mensajes_" + chatActual;

    const mensajes =
        JSON.parse(localStorage.getItem(clave)) || [];

    const usuarioActual =
        localStorage.getItem("juantools_sesion") || "Usuario";

    contenedor.innerHTML = "";

    mensajes.forEach((mensaje) => {

        const elemento =
            document.createElement("div");

        elemento.className =
            "burbujaMensaje";

        if (mensaje.usuario === usuarioActual) {

            elemento.classList.add(
                "mensajePropio"
            );

        } else {

            elemento.classList.add(
                "mensajeOtro"
            );
        }

        const texto =
            document.createElement("span");

        texto.className =
            "textoMensaje";

        texto.textContent =
            mensaje.texto;

        const informacion =
            document.createElement("span");

        informacion.className =
            "infoMensaje";

        informacion.textContent =
            mensaje.hora +
            (
                mensaje.usuario === usuarioActual
                    ? (
                        mensaje.estado === "leido"
                            ? " ✓✓"
                            : " ✓"
                    )
                    : ""
            );

        elemento.appendChild(texto);

        elemento.appendChild(
            informacion
        );

        contenedor.appendChild(
            elemento
        );
    });

    contenedor.scrollTop =
        contenedor.scrollHeight;
}

/* JUANTSSAPP 0.2 - AMIGOS */

async function buscarAmigos() {

    const input = document.getElementById("buscarAmigos");
    const resultados = document.getElementById("resultadosBusqueda");

    if (!input || !resultados) {
        return;
    }

    const busqueda = input.value.trim().toLowerCase();

    resultados.innerHTML = "";

    if (busqueda === "") {
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/users?username=" +
            encodeURIComponent(busqueda)
        );

        if (!respuesta.ok) {
            throw new Error("Error buscando usuario");
        }

        const usuarios = await respuesta.json();

        usuarios.forEach(usuario => {

            const resultado = document.createElement("div");

            resultado.className = "amigo";

            resultado.innerHTML = `
                <span class="avatarAmigo">👤</span>
                <span class="nombreAmigo">
                    ${usuario.nombre}<br>
                    <small>${usuario.username}</small>
                </span>
                <button type="button">➕</button>
            `;

            resultado.querySelector("button").onclick = async function(evento) {

                evento.stopPropagation();

                await agregarContacto(usuario.username);

            };

            resultados.appendChild(resultado);
        });

    } catch (error) {

        console.error("❌ Error buscando usuario:", error);

    }
}

window.abrirChat = function(nombre) {


    const pantalla = document.getElementById("pantallaChat");

    if (!pantalla) {
    }


    pantalla.classList.remove("oculto");

};


function volverAmigos() {

    document.getElementById("pantallaChat").classList.add("oculto");

    document.getElementById("listaAmigos").classList.remove("oculto");
    document.querySelector(".juantssapp-header").classList.remove("oculto");

    chatActual = null;
}

/* JUANTSSAPP 1.0 - ULTIMO MENSAJE */

function actualizarListaAmigos() {

    const amigos = document.querySelectorAll(".amigo");

    amigos.forEach((amigo) => {

        const nombreElemento =
            amigo.querySelector(".nombreAmigo");

        if (!nombreElemento) return;

        const nombre =
            nombreElemento.textContent.trim();

        const clave =
            "juantssapp_mensajes_" + nombre;

        const mensajes =
            JSON.parse(localStorage.getItem(clave)) || [];

        let info =
            amigo.querySelector(".infoAmigo");

        if (!info) {

            info = document.createElement("span");
            info.className = "infoAmigo";

            nombreElemento.replaceWith(info);
            info.appendChild(nombreElemento);

            const ultimo =
                document.createElement("span");

            ultimo.className = "ultimoMensaje";
            info.appendChild(ultimo);

            const hora =
                document.createElement("span");

            hora.className = "horaAmigo";
            amigo.appendChild(hora);
        }

        const ultimoMensaje =
            info.querySelector(".ultimoMensaje");

        const horaElemento =
            amigo.querySelector(".horaAmigo");

        if (mensajes.length === 0) {

            ultimoMensaje.textContent =
                "Sin mensajes";

            horaElemento.textContent = "";

            return;
        }

        const ultimo =
            mensajes[mensajes.length - 1];

        ultimoMensaje.textContent =
            ultimo.texto;

        horaElemento.textContent =
            ultimo.hora;
    });
}

actualizarListaAmigos();


/* JUANTSSAPP 1.0 - ULTIMO MENSAJE */


actualizarListaAmigos();


/* JUANTSSAPP 1.2 - MENSAJES LEIDOS */

function marcarMensajesLeidos() {

    if (chatActual === null) {
        return;
    }

    const clave =
        "juantssapp_mensajes_" + chatActual;

    const mensajes =
        JSON.parse(localStorage.getItem(clave)) || [];

    mensajes.forEach((mensaje) => {
        mensaje.estado = "leido";
    });

    localStorage.setItem(
        clave,
        JSON.stringify(mensajes)
    );

    mostrarMensajes();
}


/* JUANTSSAPP 1.4 - PERFILES */

const perfilesAmigos = {
    Juan: {
        avatar: "😼",
        estado: "En línea"
    },
    Ana: {
        avatar: "👩",
        estado: "En línea"
    },
    Bob: {
        avatar: "🧑",
        estado: "Desconectado"
    },
    Pedrito: {
        avatar: "👦",
        estado: "En línea"
    },
    Fulanito: {
        avatar: "🗿",
        estado: "Desconectado"
    },
    Sutanito: {
        avatar: "😎",
        estado: "En línea"
    }
};

function cargarPerfilesAmigos() {

    const amigos =
        document.querySelectorAll(".amigo");

    amigos.forEach((amigo) => {

        const nombreElemento =
            amigo.querySelector(".nombreAmigo");

        const avatarElemento =
            amigo.querySelector(".avatarAmigo");

        if (!nombreElemento || !avatarElemento) {
            return;
        }

        const nombre =
            nombreElemento.textContent.trim();

        const perfil =
            perfilesAmigos[nombre];

        if (!perfil) {
            return;
        }

        avatarElemento.textContent =
            perfil.avatar;
    });
}

cargarPerfilesAmigos();


/* JUANTSSAPP 1.4B - ESTADO */

function mostrarEstadoAmigos() {

    const amigos = document.querySelectorAll(".amigo");

    amigos.forEach((amigo) => {

        const nombreElemento =
            amigo.querySelector(".nombreAmigo");

        if (!nombreElemento) {
            return;
        }

        const nombre =
            nombreElemento.textContent.trim();

        const perfil =
            perfilesAmigos[nombre];

        if (!perfil) {
            return;
        }

        let estadoElemento =
            amigo.querySelector(".estadoAmigo");

        if (!estadoElemento) {

            estadoElemento =
                document.createElement("span");

            estadoElemento.className =
                "estadoAmigo";

            nombreElemento.parentElement.appendChild(
                estadoElemento
            );
        }

        const contacto =
            window.contactosReales?.find(
                contacto => contacto.nombre === nombre
            );

        const username =
            contacto?.username;

        estadoElemento.textContent =
            estadosUsuarios[username]
                ? "🟢 En línea"
                : "⚪ Desconectado";
    });
}

mostrarEstadoAmigos();


/* JUANTSSAPP 1.4C - ESCRIBIENDO */

let temporizadorEscribiendo = null;

function mostrarEscribiendo() {

    if (chatActual === null) {
        return;
    }

    const nombreContacto =
        chatActual;

    let indicador =
        document.getElementById("indicadorEscribiendo");

    if (!indicador) {

        indicador =
            document.createElement("div");

        indicador.id =
            "indicadorEscribiendo";

        const mensajes =
            document.getElementById("mensajes");

        mensajes.parentElement.insertBefore(
            indicador,
            mensajes
        );
    }

    indicador.textContent =
        "✍️ " + nombreContacto + " está escribiendo...";

    indicador.style.display = "block";

    clearTimeout(temporizadorEscribiendo);

    temporizadorEscribiendo =
        setTimeout(() => {

            indicador.style.display = "none";

        }, 1500);
}



/* JUANTSSAPP 1.4D - RESPUESTA SIMULADA */

function respuestaAutomatica() {

    if (chatActual === null) {
        return;
    }

    const nombre =
        chatActual;

    const clave =
        "juantssapp_mensajes_" + nombre;

    const mensajes =
        JSON.parse(localStorage.getItem(clave)) || [];

    const respuestas = {
        Ana: "Todo bien bro 😼",
        Bob: "Qué ondaaa 🗿",
        Pedrito: "JAJA qué pasó",
        Fulanito: "👍",
        Sutanito: "Aquí andamos 😎",
        Juan: "Qué pasó bro"
    };

    mensajes.push({
        usuario: nombre,
        texto: respuestas[nombre] || "Todo bien bro 😼",
        estado: "recibido",
        hora: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    localStorage.setItem(
        clave,
        JSON.stringify(mensajes)
    );

    mostrarMensajes();
    actualizarListaAmigos();

    mostrarNotificacion(
	nombre,
	respuestas[nombre] || "todo bien bro"
);
}

/* JUANTSSAPP 1.4 FINAL ULTRA - NOTIFICACIONES */

function mostrarNotificacion(nombre, mensaje) {

    const anterior =
        document.querySelector(".juantssappNotificacion");

    if (anterior) {
        anterior.remove();
    }

    const notificacion =
        document.createElement("div");

    notificacion.className =
        "juantssappNotificacion";

    notificacion.innerHTML = `
        <div class="juantssappNotificacionIcono">💬</div>

        <div class="juantssappNotificacionTexto">
            <div class="juantssappNotificacionNombre">
                ${nombre}
            </div>

            <div class="juantssappNotificacionMensaje">
                ${mensaje}
            </div>
        </div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {

        notificacion.remove();

    }, 3800);
}
/* JUANTSSAPP - PERFIL DEL CONTACTO */

function mostrarPerfilContacto() {

    const contacto = window.contactosReales?.find(
        contacto => contacto.nombre === chatActual
    );

    if (!contacto) {
        console.error("❌ No se encontró el contacto:", chatActual);
        return;
    }

    const avatar = document.getElementById("avatarPerfilContacto");
    const nombre = document.getElementById("nombrePerfilContacto");
    const estado = document.getElementById("estadoPerfilContacto");
    const panel = document.getElementById("perfilContacto");

    if (!avatar || !nombre || !estado || !panel) {
        return;
    }

    avatar.textContent = "👤";
    nombre.textContent = contacto.nombre;
    estado.textContent = estadosUsuarios[contacto.username] ? "🟢 En línea" : "⚪ Desconectado";

    panel.classList.remove("oculto");
}

function cerrarPerfilContacto() {

    document.getElementById(
        "perfilContacto"
    ).classList.add("oculto");
}

/* JUANTSSAPP 2.0 - CONTACTOS REALES */

async function cargarContactosReales() {

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual) {
        console.error("❌ No hay una sesión activa");
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/contacts/" +
            encodeURIComponent(usuarioActual) +
            "/details"
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los contactos");
        }

        const contactos =
            await respuesta.json();

        window.contactosReales = contactos;

        console.log("👥 Contactos reales:", contactos);

    } catch (error) {

        console.error(
            "❌ Error conectando con JUANTSSAPP SERVER:",
            error
        );

    }
}

cargarContactosReales().then(mostrarContactosReales);

function mostrarContactosReales() {

    const lista = document.getElementById("listaAmigos");

    if (!lista || !window.contactosReales) {
        console.error("❌ No hay lista o contactos reales");
        return;
    }

    lista.innerHTML = "";

    window.contactosReales.forEach(contacto => {

        const boton = document.createElement("button");

        boton.className = "amigo";
        boton.type = "button";
        boton.dataset.username = contacto.username;

        boton.innerHTML = `
            <span class="avatar-amigo">👤</span>
            <span>
                <strong>${contacto.nombre}</strong><br>
                <small>${contacto.username}</small><br>
                <small class="estadoAmigo">⚪ Desconectado</small>
            </span>
            <span style="margin-left:auto;">💬</span>
        `;

        boton.addEventListener("touchstart", function() {


            const pantalla =
                document.getElementById("pantallaChat");

            if (!pantalla) {
                return;

            }

            pantalla.classList.remove("oculto");
                console.error("❌ pantallaChat NO EXISTE");

            chatActual = contacto.nombre;

            cargarMensajesReales(contacto.username)
                .then(() => {
                    console.log(
                        "✅ MENSAJES CARGADOS:",
                        contacto.username
                    );
                })
                .catch(error => {
                    console.error(
                        "❌ ERROR CARGANDO MENSAJES:",
                        error
                    );
                });

        }, { passive: true });

        lista.appendChild(boton);
    });
}

async function cargarMensajesReales(usernameContacto) {

    const usuarioActual =
        obtenerUsuarioActual();

    if (!usuarioActual || !usernameContacto) {
        console.error("❌ Falta usuario o contacto");
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/messages/" +
            encodeURIComponent(usuarioActual) +
            "/" +
            encodeURIComponent(usernameContacto)
        );

        if (!respuesta.ok) {
            throw new Error(
                "Servidor respondió: " + respuesta.status
            );
        }

        const mensajes =
            await respuesta.json();

        console.log(
            "💬 MENSAJES RECIBIDOS:",
            mensajes
        );

        mostrarMensajesReales(mensajes);

          const contenedorMensajes = document.getElementById("mensajes");

          if (contenedorMensajes) {
              contenedorMensajes.scrollTop =
                  contenedorMensajes.scrollHeight;
          }

    } catch (error) {

        console.error(
            "❌ ERROR CARGANDO MENSAJES:",
            error
        );
    }
}


async function agregarContacto(username) {

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual) {
        alert("❌ No hay una sesión activa");
        return;
    }

    try {

        const respuesta = await fetch(
            "http://192.168.0.9:3000/contacts/add",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: usuarioActual,
                    contacto: username
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert("⚠️ " + (datos.error || "No se pudo agregar el contacto"));
            return;
        }

        await cargarContactosReales();
        mostrarContactosReales();

        const buscar = document.getElementById("buscarAmigos");
        const resultados = document.getElementById("resultadosBusqueda");

        if (buscar) {
            buscar.value = "";
        }

        if (resultados) {
            resultados.innerHTML = "";
        }

        alert("✅ Contacto agregado: " + username);

    } catch (error) {

        console.error("❌ Error agregando contacto:", error);
        alert("❌ No se pudo conectar con el servidor");

    }
}
function obtenerUsuarioActual() {
    return localStorage.getItem("juantools_sesion");
}


console.log("🚨 LLEGUE AL SOCKET");
const socket = io("http://192.168.0.9:3000");

socket.on("connect", () => {

    console.log("⚡ JUANTSSAPP: Socket.IO conectado");

    const usuarioActual = obtenerUsuarioActual();

    if (usuarioActual) {

        socket.emit(
            "registrar_usuario",
            usuarioActual
        );

        console.log(
            "👤 Usuario registrado en Socket.IO:",
            usuarioActual
        );
    }
});

socket.on("nuevo_mensaje", async (mensaje) => {

    console.log(
        "📨 MENSAJE EN TIEMPO REAL:",
        mensaje
    );

    const usuarioActual =
        obtenerUsuarioActual();

    if (!usuarioActual) {
        return;
    }

    const contactoAbierto =
        window.contactosReales?.find(
            contacto =>
                contacto.username === mensaje.de ||
                contacto.username === mensaje.para
        );

    if (!contactoAbierto) {
        return;
    }

    const chatAbierto =
        chatActual === contactoAbierto.nombre;

    if (!chatAbierto) {
        return;
    }

    await cargarMensajesReales(
        contactoAbierto.username
    );
});

socket.on("nueva_notificacion", (notificacion) => {

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual) {
        return;
    }

    if (notificacion.para !== usuarioActual) {
        return;
    }

    const aviso = document.createElement("div");

    aviso.className = "notificacionJuantsapp";

    aviso.innerHTML = `
        <strong>💬 Nuevo mensaje</strong>
        <small>${notificacion.de}</small>
        <div>${notificacion.texto}</div>
    `;

    document.body.appendChild(aviso);

    setTimeout(() => {
        aviso.remove();
    }, 3000);
});


async function solicitarNotificaciones() {

    if (!("Notification" in window)) {
        console.log("⚠️ Este navegador no soporta notificaciones");
        return;
    }

    if (Notification.permission === "granted") {
        console.log("🔔 Notificaciones ya activadas");
        return;
    }

    if (Notification.permission === "denied") {
        console.log("🔕 Notificaciones bloqueadas");
        return;
    }

    const permiso = await Notification.requestPermission();

    if (permiso === "granted") {
        console.log("🔔 NOTIFICACIONES ACTIVADAS");
    } else {
        console.log("🔕 NOTIFICACIONES NO ACTIVADAS");
    }
}


function mostrarMensajesReales(mensajes) {

    const chat = document.getElementById("mensajes");

    if (!chat) {
        return;
    }

    const usuarioActual = obtenerUsuarioActual();

    chat.innerHTML = "";

    mensajes.forEach((mensaje, indice) => {

        const burbuja = document.createElement("div");

        burbuja.className =
            mensaje.de === usuarioActual
                ? "burbujaMensaje mensajePropio"
                : "burbujaMensaje mensajeOtro";

        burbuja.textContent = mensaje.texto;

        if (indice !== mensajes.length - 1) {
            burbuja.style.animation = "none";
        }

        chat.appendChild(burbuja);
    });
}


function mostrarMensajesReales(mensajes) {

    const chat = document.getElementById("mensajes");

    if (!chat) {
        return;
    }

    const usuarioActual = obtenerUsuarioActual();

    chat.innerHTML = "";

    mensajes.forEach((mensaje, indice) => {

        const burbuja = document.createElement("div");

        burbuja.className =
            mensaje.de === usuarioActual
                ? "burbujaMensaje mensajePropio"
                : "burbujaMensaje mensajeOtro";

        burbuja.textContent = mensaje.texto;

        if (indice !== mensajes.length - 1) {
            burbuja.style.animation = "none";
        }

        chat.appendChild(burbuja);
    });
}

