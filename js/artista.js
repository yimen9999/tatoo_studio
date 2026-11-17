// js artista

// ventana flotante fotos

$(function () {
  "use strict";

  
  var $fotos = $(".obra, .studioimg");
  var $ventana = $(".ventana");
  var $imgventana = $ventana.find("img");
  var $contador = $ventana.find(".ventanacontador");
  var actual = 0; 
  var ultimoboton = null; 


  function mostrarfoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total; 
    var $img = $fotos.eq(actual).find("img");

    $imgventana.stop(true).fadeTo(150, 0, function () {
      $imgventana.attr({ src: $img.attr("src"), alt: $img.attr("alt") }).fadeTo(200, 1);
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
});
