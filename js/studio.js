/* =====================================================
   EL GATO NEGRO · Página STUDIO
   (el menú, AOS, el formulario con validación y el
   resto de interacciones comunes están en script.js)
   ===================================================== */
$(function () {
  "use strict";

  // Vídeo del hero: si el navegador bloquea el autoplay se queda el póster
  var video = document.querySelector(".st-hero video");
  if (video) {
    var intento = video.play();
    if (intento && typeof intento.catch === "function") {
      intento.catch(function () {});
    }
  }

  // AOS: recalcular posiciones cuando cargan las imágenes
  $(window).on("load", function () {
    if (window.AOS) {
      AOS.refresh();
    }
  });
});
