/* =====================================================
   EL GATO NEGRO · Páginas de ARTISTA
   Visor de fotos: al pinchar un trabajo se abre en grande
   y se puede pasar al anterior o al siguiente con jQuery.
   (el menú y el formulario con validación están en script.js)
   ===================================================== */
$(function () {
  "use strict";

  var $fotos = $(".obra");
  var $visor = $(".visor");
  var $imgVisor = $visor.find("img");
  var $contador = $visor.find(".visor-contador");
  var actual = 0;
  var ultimoBoton = null; // para devolver el foco al cerrar

  function mostrarFoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total; // da la vuelta al llegar al final
    var $img = $fotos.eq(actual).find("img");

    $imgVisor.stop(true).fadeTo(150, 0, function () {
      $imgVisor.attr({ src: $img.attr("src"), alt: $img.attr("alt") }).fadeTo(200, 1);
    });
    $contador.text(actual + 1 + " / " + total);
  }

  function abrirVisor(i) {
    ultimoBoton = $fotos.get(i);
    mostrarFoto(i);
    $("body").addClass("sin-scroll");
    $visor.css("display", "flex").hide().fadeIn(250);
    $visor.find(".visor-cerrar").trigger("focus");
  }

  function cerrarVisor() {
    $visor.fadeOut(200, function () {
      $("body").removeClass("sin-scroll");
    });
    if (ultimoBoton) {
      ultimoBoton.focus();
    }
  }

  $fotos.on("click", function () {
    abrirVisor($fotos.index(this));
  });

  $visor.find(".visor-cerrar").on("click", cerrarVisor);
  $visor.find(".visor-antes").on("click", function () {
    mostrarFoto(actual - 1);
  });
  $visor.find(".visor-despues").on("click", function () {
    mostrarFoto(actual + 1);
  });

  // clic en el fondo oscuro (fuera de la foto) también cierra
  $visor.on("click", function (e) {
    if (e.target === this) {
      cerrarVisor();
    }
  });

  // teclado: Escape cierra y las flechas cambian de foto
  $(document).on("keydown", function (e) {
    if (!$visor.is(":visible")) {
      return;
    }
    if (e.key === "Escape") {
      cerrarVisor();
    } else if (e.key === "ArrowLeft") {
      mostrarFoto(actual - 1);
    } else if (e.key === "ArrowRight") {
      mostrarFoto(actual + 1);
    }
  });
});
