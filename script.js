// Elementos del DOM
const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const iniciarBtn = document.getElementById("iniciar");
const articuloTexto = document.getElementById("articulo");
const cables = document.querySelectorAll(".cable");
const contadorPregunta = document.getElementById("contadorPregunta");

let preguntas = [];
let preguntaActual = 0;

// Descripciones de los artículos para mostrar en el aviso
const descripciones = {
  14: "Igualdad ante la ley sin discriminación por razones de nacimiento, raza, sexo, religión, opinión o cualquier otra condición.",
  15: "Derecho a la vida, integridad física y moral. Prohibición de la tortura y tratos inhumanos o degradantes.",
  16: "Libertad ideológica, religiosa y de culto sin coerción estatal.",
  17: "Derecho a la libertad y seguridad. Regulación de la detención y el habeas corpus.",
  18: "Derecho al honor, la intimidad personal y familiar, y a la propia imagen. Inviolabilidad del domicilio y secreto de comunicaciones.",
  19: "Derecho a elegir libremente la residencia y circular por el territorio nacional, así como a salir y entrar en España.",
  20: "Libertad de expresión, creación literaria y científica, comunicación e información. Límites en el respeto a los derechos fundamentales.",
  21: "Derecho de reunión pacífica y sin armas, sin autorización previa para reuniones en lugares públicos.",
  22: "Derecho de asociación. Regulación de asociaciones ilegales y disolución por mandato judicial.",
  23: "Derecho a participar en los asuntos públicos directamente o mediante representantes. Acceso a funciones y cargos públicos en igualdad de condiciones.",
  24: "Derecho a la tutela judicial efectiva y a un juicio justo, sin indefensión.",
  25: "Prohibición de penas o sanciones sin ley previa. Derechos de los presos y rehabilitación.",
  26: "Prohibición de tribunales de honor en la administración civil y organizaciones profesionales.",
  27: "Derecho a la educación y libertad de enseñanza. Regulación de centros educativos y enseñanza religiosa.",
  28: "Derecho a la sindicación y a la huelga, con límites para las Fuerzas Armadas y cuerpos de seguridad.",
  29: "Derecho de petición individual y colectiva por escrito a las autoridades públicas."
};

// Iniciar el juego
iniciarBtn.addEventListener("click", () => {
  menu.classList.add("oculto");
  juego.classList.remove("oculto");
  cargarPregunta();
});

// Función para mezclar un array aleatoriamente
function mezclarArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Cargar preguntas desde JSON
fetch("preguntas.json")
  .then((response) => response.json())
  .then((data) => {
    preguntas = mezclarArray(data); // Mezclar preguntas al cargar
  });

function cargarPregunta() {
  if (preguntaActual >= preguntas.length) {
    Swal.fire({
      title: "¡Felicidades! 🎉",
      text: "Has completado todas las preguntas.",
      icon: "success",
      confirmButtonText: "Volver al inicio"
    }).then(() => location.reload());
    return;
  }

  // Actualizar el contador de la pregunta actual
  contadorPregunta.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

  const pregunta = preguntas[preguntaActual];
  articuloTexto.textContent = pregunta.texto;

  // Mezclar y asignar opciones
  const opciones = [pregunta.correcto, ...pregunta.incorrectos].sort(() => Math.random() - 0.5);
  cables.forEach((cable, index) => {
    cable.textContent = `Artículo ${opciones[index]}`;
    cable.dataset.articulo = opciones[index];
    cable.disabled = false;
    cable.style.opacity = "1";

    cable.onclick = () => {
      // Agregar un momento de tensión
      cable.classList.add("activo");
      setTimeout(() => {
        cable.classList.remove("activo");

        const articuloSeleccionado = parseInt(cable.dataset.articulo);

        if (articuloSeleccionado === pregunta.correcto) {
          Swal.fire({
            title: "¡BOOM! 💥",
            text: "Seleccionaste la opción correcta antes de tiempo.",
            icon: "error",
            confirmButtonText: "Reintentar"
          }).then(() => location.reload());
        } else {
          Swal.fire({
            title: "¡Cable incorrecto! 🎯",
            html: `El artículo ${articuloSeleccionado} trata sobre:<br><b>${descripciones[articuloSeleccionado]}</b>`,
            icon: "info",
            confirmButtonText: "Continuar"
          });

          cable.disabled = true;
          cable.style.opacity = "0.5";

          const cablesActivos = [...cables].filter((btn) => !btn.disabled);
          if (cablesActivos.length === 1) {
            Swal.fire({
              title: "¡Siguiente pregunta! ✂️",
              html: `El artículo ${articuloSeleccionado} trata sobre:<br><b>${descripciones[articuloSeleccionado]}</b>`,
              text: "Pasando a la siguiente pregunta.",
              icon: "success",
              confirmButtonText: "Siguiente"
            }).then(() => {
              preguntaActual++;
              cargarPregunta();
            });
          }
        }
      }, 1000);
    };
  });
}
