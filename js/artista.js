/* el gato negro · páginas de artista */
$(function () {
  "use strict";

  var $fotos = $(".obra");
  var $visor = $(".visor");
  var $imgvisor = $visor.find("img");
  var $contador = $visor.find(".visorcontador");
  var actual = 0;
  var ultimoboton = null;

  function mostrarfoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total;
    var $img = $fotos.eq(actual).find("img");

    $imgvisor.stop(true).fadeTo(150, 0, function () {
      $imgvisor.attr({ src: $img.attr("src"), alt: $img.attr("alt") }).fadeTo(200, 1);
    });
    $contador.text(actual + 1 + " / " + total);
  }

  function abrirvisor(i) {
    ultimoboton = $fotos.get(i);
    mostrarfoto(i);
    $("body").addClass("sinscroll");
    $visor.css("display", "flex").hide().fadeIn(250);
    $visor.find(".visorcerrar").trigger("focus");
  }

  function cerrarvisor() {
    $visor.fadeOut(200, function () {
      $("body").removeClass("sinscroll");
    });
    if (ultimoboton) {
      ultimoboton.focus();
    }
  }

  $fotos.on("click", function () {
    abrirvisor($fotos.index(this));
  });

  $visor.find(".visorcerrar").on("click", cerrarvisor);
  $visor.find(".visorantes").on("click", function () {
    mostrarfoto(actual - 1);
  });
  $visor.find(".visordespues").on("click", function () {
    mostrarfoto(actual + 1);
  });

  $visor.on("click", function (e) {
    if (e.target === this) {
      cerrarvisor();
    }
  });

  $(document).on("keydown", function (e) {
    if (!$visor.is(":visible")) {
      return;
    }
    if (e.key === "Escape") {
      cerrarvisor();
    } else if (e.key === "ArrowLeft") {
      mostrarfoto(actual - 1);
    } else if (e.key === "ArrowRight") {
      mostrarfoto(actual + 1);
    }
  });
});
