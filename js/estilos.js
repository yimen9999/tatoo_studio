 
 
$(function () {
  "use strict";

  var $fotos = $(".collage .foto");
  var $ventana = $(".ventana");
  var $imgventana = $ventana.find("img");
  var $contador = $ventana.find(".ventanacontador");
  var actual = 0;
  var ultimoboton = null;

  /* JAPANESEblanco y negro a color*/
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

  /*VENTANA DE FOTOS*/

  function rutafoto(i) {
    var $img = $fotos.eq(i).find("img").first();
    return $img.data("color") || $img.attr("src");
  }

  function mostrarfoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total;
    var $img = $fotos.eq(actual).find("img").first();

    $imgventana.stop(true).fadeTo(150, 0, function () {
      $imgventana
        .attr({ src: rutafoto(actual), alt: $img.attr("alt") })
        .fadeTo(200, 1);
    });
    $contador.text(actual + 1 + " / " + total);
  }

  function abrirventana(i) {
    ultimoboton = $fotos.get(i);
    mostrarfoto(i);
    $("body").addClass("sinscroll");
    $ventana.css("display", "flex").hide().fadeIn(250);
    $ventana.find(".ventanacerrar").trigger("focus");
  }

  function cerrarventana() {
    $ventana.fadeOut(200, function () {
      $("body").removeClass("sinscroll");
    });
    if (ultimoboton) {
      ultimoboton.focus();
    }
  }

  $fotos.on("click", function () {
    abrirventana($fotos.index(this));
  });

  $ventana.find(".ventanacerrar").on("click", cerrarventana);
  $ventana.find(".ventanaantes").on("click", function () {
    mostrarfoto(actual - 1);
  });
  $ventana.find(".ventanadespues").on("click", function () {
    mostrarfoto(actual + 1);
  });

  $ventana.on("click", function (e) {
    if (e.target === this) {
      cerrarventana();
    }
  });

  /*   SIMPLEPARALLAXfotos de los artistas*/

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
