/* el gato negro · páginas de estilos */
$(function () {
  "use strict";

  var $fotos = $(".collage .foto");
  var $visor = $(".visor");
  var $imgvisor = $visor.find("img");
  var $contador = $visor.find(".visorcontador");
  var actual = 0;
  var ultimoboton = null;

  /* 1. japanese · blanco y negro → color */
  $fotos.find("img[data-color]").each(function () {
    var $img = $(this);
    $("<img>")
      .attr({
        src: $img.data("color"),
        alt: "",
        class: "fotocolor",
        width: $img.attr("width"),
        height: $img.attr("height"),
      })
      .insertAfter($img);
  });

  $fotos
    .on("mouseenter focus", function () {
      $(this).addClass("encolor");
    })
    .on("mouseleave blur", function () {
      $(this).removeClass("encolor");
    });

  /* 2. visor de fotos */
  function rutafoto(i) {
    var $img = $fotos.eq(i).find("img").first();
    return $img.data("color") || $img.attr("src");
  }

  function mostrarfoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total;
    var $img = $fotos.eq(actual).find("img").first();

    $imgvisor.stop(true).fadeTo(150, 0, function () {
      $imgvisor
        .attr({ src: rutafoto(actual), alt: $img.attr("alt") })
        .fadeTo(200, 1);
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

  /* 3. simpleparallax · fotos de los artistas */
  var fotosartistas = document.querySelectorAll(".persona img");
  if (window.SimpleParallax && fotosartistas.length) {
    new SimpleParallax(fotosartistas, {
      scale: 1.25,
      delay: 0.4,
      transition: "cubic-bezier(0,0,0,1)",
      orientation: "up",
      overflow: false,
    });
  }
});
