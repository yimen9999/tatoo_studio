/* =====================================================
   EL GATO NEGRO · Páginas de ESTILOS
   (realismo, lettering, japanese, fine line, black & grey)
   - Visor de fotos: ventana modal con jQuery
   - Japanese: la foto pasa a color al pasar el ratón (jQuery)
   - SimpleParallax en las fotos de los artistas
   El menú, AOS y el formulario están en script.js
   ===================================================== */
$(function () {
  "use strict";

  var $fotos = $(".collage .foto");
  var $visor = $(".visor");
  var $imgVisor = $visor.find("img");
  var $contador = $visor.find(".visor-contador");
  var actual = 0;
  var ultimoBoton = null; // para devolver el foco al cerrar

  /* ---------------------------------------------
       1. JAPANESE · blanco y negro → color
       Las fotos que tienen data-color pasan poco a poco
       a la versión en color al pasar el ratón por encima.
       Ponemos la foto en color encima de la de blanco y
       negro (invisible) y el CSS la hace aparecer suave.
    --------------------------------------------- */
  $fotos.find("img[data-color]").each(function () {
    var $img = $(this);
    // con .attr() para que width y height sean atributos
    // (si van en el objeto, jQuery los pone como estilo en línea)
    $("<img>")
      .attr({
        src: $img.data("color"),
        alt: "",
        class: "foto-color",
        width: $img.attr("width"),
        height: $img.attr("height"),
      })
      .insertAfter($img);
  });

  $fotos
    .on("mouseenter focus", function () {
      $(this).addClass("en-color");
    })
    .on("mouseleave blur", function () {
      $(this).removeClass("en-color");
    });

  /* ---------------------------------------------
       2. VISOR DE FOTOS (ventana modal)
    --------------------------------------------- */
  function rutaFoto(i) {
    var $img = $fotos.eq(i).find("img").first();
    // en japanese el visor enseña la foto en color
    return $img.data("color") || $img.attr("src");
  }

  function mostrarFoto(i) {
    var total = $fotos.length;
    actual = (i + total) % total; // da la vuelta al llegar al final
    var $img = $fotos.eq(actual).find("img").first();

    $imgVisor.stop(true).fadeTo(150, 0, function () {
      $imgVisor
        .attr({ src: rutaFoto(actual), alt: $img.attr("alt") })
        .fadeTo(200, 1);
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

  /* ---------------------------------------------
       3. SIMPLEPARALLAX · fotos de los artistas
    --------------------------------------------- */
  var fotosArtistas = document.querySelectorAll(".persona img");
  if (window.simpleParallax && fotosArtistas.length) {
    new simpleParallax(fotosArtistas, {
      scale: 1.2,
      delay: 0.4,
      transition: "cubic-bezier(0,0,0,1)",
      orientation: "up",
    });
  }

  // AOS: recalcular posiciones cuando terminan de cargar las fotos
  $(window).on("load", function () {
    if (window.AOS) {
      AOS.refresh();
    }
  });
});
