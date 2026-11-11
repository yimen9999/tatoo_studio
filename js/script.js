/* =====================================================
   EL GATO NEGRO · Estudio de tatuaje
   Interacciones de la HOME
   - Menú responsive (jQuery)
   - Animaciones AOS (textos del estudio)
   - SimpleParallax (galería de artistas)
   - Tarjetas flotantes de estilos (sticky + scroll)
   - Carrusel de reseñas (jQuery)
   - Acordeón FAQ (jQuery)
   - Validación del formulario de citas (jQuery)
   ===================================================== */
$(function () {
  "use strict";

  var $ventana = $(window);

  /* ---------------------------------------------
       1. AOS · textos sobre el estudio
    --------------------------------------------- */
  if (window.AOS) {
    AOS.init({
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });
  }

  /* ---------------------------------------------
       2. MENÚ RESPONSIVE
    --------------------------------------------- */
  var $header = $("header");
  var $boton = $(".hamburguesa");
  var $menu = $(".menu");
  var ANCHO_MOVIL = 900;

  function esMovil() {
    return window.innerWidth <= ANCHO_MOVIL;
  }

  function cerrarMenu() {
    $boton
      .removeClass("activo")
      .attr({ "aria-expanded": "false", "aria-label": "Abrir menú" });
    $header.removeClass("abierto");
    if (esMovil()) {
      $menu.stop(true, true).slideUp(250);
    }
  }

  $boton.attr("aria-expanded", "false").on("click", function () {
    var abrir = !$boton.hasClass("activo");
    $boton
      .toggleClass("activo", abrir)
      .attr({
        "aria-expanded": String(abrir),
        "aria-label": abrir ? "Cerrar menú" : "Abrir menú",
      });
    $header.toggleClass("abierto", abrir);
    $menu.stop(true, true).slideToggle(250);
  });

  // al elegir una opción se cierra el menú móvil
  $menu.find("a").on("click", cerrarMenu);

  // Escape cierra el menú
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $boton.hasClass("activo")) {
      cerrarMenu();
      $boton.trigger("focus");
    }
  });

  // al volver a escritorio se limpian los estilos en línea de jQuery
  $ventana.on("resize", function () {
    if (!esMovil()) {
      $menu.removeAttr("style");
      $header.removeClass("abierto");
      $boton.removeClass("activo").attr("aria-expanded", "false");
    }
  });

  // cabecera más opaca al hacer scroll + enlace de la sección activa
  var $secciones = $("#estudio, #artistas, #estilos, #resenas, #faq, #reserva");
  var $enlacesMenu = $menu.find("a");

  function marcarMenu() {
    $header.toggleClass("scrolled", $ventana.scrollTop() > 40);

    var marca = $ventana.scrollTop() + window.innerHeight * 0.35;
    var actual = "";
    $secciones.each(function () {
      if (marca >= $(this).offset().top) {
        actual = "#" + this.id;
      }
    });
    // el menú agrupa "ESTUDIO" bajo STUDIO
    $enlacesMenu.each(function () {
      $(this).toggleClass("activo", $(this).attr("href") === actual);
    });
  }

  /* ---------------------------------------------
       3. SIMPLEPARALLAX · galería de artistas
    --------------------------------------------- */
  var imagenesArtistas = document.querySelectorAll(".artista img");
  if (window.simpleParallax && imagenesArtistas.length) {
    new simpleParallax(imagenesArtistas, {
      scale: 1.25,
      delay: 0.5,
      transition: "cubic-bezier(0,0,0,1)",
      orientation: "up",
      overflow: false,
    });
  }

  /* ---------------------------------------------
       4. TARJETAS FLOTANTES · estilos de tatuaje
       Cada tarjeta se queda pegada (sticky) y la
       siguiente la va tapando; la anterior se
       encoge y se oscurece levemente.
    --------------------------------------------- */
  var $tarjetas = $(".estilo");
  var tarjetasPendientes = false;

  function limitar(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function animarTarjetas() {
    tarjetasPendientes = false;

    $tarjetas.each(function (i) {
      var siguiente = $tarjetas.get(i + 1);
      if (!siguiente) {
        return; // la última no se encoge
      }

      var tarjeta = this;
      var topPegada = parseFloat(window.getComputedStyle(tarjeta).top) || 0;
      var topSiguientePegada =
        parseFloat(window.getComputedStyle(siguiente).top) || 0;
      var alto = tarjeta.offsetHeight;
      var hueco =
        parseFloat(window.getComputedStyle(tarjeta).marginBottom) || 0;

      // distancia entre el borde superior de esta tarjeta (pegada) y el de la siguiente
      var distancia = siguiente.getBoundingClientRect().top - topPegada;
      var recorrido = alto + hueco - (topSiguientePegada - topPegada);
      var progreso = limitar(
        1 - (distancia - (topSiguientePegada - topPegada)) / recorrido,
        0,
        1,
      );

      var escala = 1 - 0.06 * progreso;
      tarjeta.style.transform =
        progreso > 0 ? "scale(" + escala.toFixed(4) + ")" : "";
      tarjeta.style.filter =
        progreso > 0
          ? "brightness(" + (1 - 0.5 * progreso).toFixed(3) + ")"
          : "";
    });
  }

  function pedirAnimacionTarjetas() {
    if (!tarjetasPendientes) {
      tarjetasPendientes = true;
      window.requestAnimationFrame(animarTarjetas);
    }
  }

  /* ---------------------------------------------
       Scroll / resize (un solo listener)
    --------------------------------------------- */
  $ventana.on("scroll resize", function () {
    marcarMenu();
    pedirAnimacionTarjetas();
  });
  marcarMenu();
  animarTarjetas();

  /* ---------------------------------------------
       5. CARRUSEL DE RESEÑAS (jQuery)
    --------------------------------------------- */
  (function carrusel() {
    var $slider = $(".slider");
    if (!$slider.length) {
      return;
    }

    var $ventanaSlider = $slider.find(".slider-ventana");
    var $pista = $slider.find(".slider-pista");
    var $items = $pista.children(".resena");
    var $puntos = $slider.find(".slider-puntos");
    var total = $items.length;
    var porVista = 3;
    var indice = 0;
    var intervalo = null;
    var TIEMPO = 2500;

    function calcularPorVista() {
      var ancho = window.innerWidth;
      if (ancho <= 700) {
        return 1;
      }
      if (ancho <= 1100) {
        return 2;
      }
      return 3;
    }

    function paginas() {
      return total - porVista + 1;
    }

    function crearPuntos() {
      $puntos.empty();
      for (var i = 0; i < paginas(); i++) {
        $('<button type="button" role="tab"></button>')
          .attr("aria-label", "Ir a la reseña " + (i + 1))
          .data("indice", i)
          .appendTo($puntos);
      }
    }

    function ir(nuevo, animar) {
      var max = paginas();
      indice = ((nuevo % max) + max) % max;

      $pista.css("transition", animar === false ? "none" : "");
      $pista.css(
        "transform",
        "translateX(-" + (indice * 100) / porVista + "%)",
      );

      $puntos.children().each(function (i) {
        $(this)
          .toggleClass("activo", i === indice)
          .attr("aria-selected", String(i === indice));
      });

      // lectores de pantalla: solo las reseñas visibles
      $items.each(function (i) {
        var visible = i >= indice && i < indice + porVista;
        $(this).attr("aria-hidden", String(!visible));
      });
    }

    function maquetar() {
      porVista = calcularPorVista();
      $items.css("flex-basis", 100 / porVista + "%");
      crearPuntos();
      ir(Math.min(indice, paginas() - 1), false);
    }

    function arrancar() {
      parar();
      // pase automático (slideshow); salta al inicio al llegar al final
      intervalo = window.setInterval(function () {
        if (!document.hidden) {
          ir(indice + 1);
        }
      }, TIEMPO);
    }

    function parar() {
      if (intervalo) {
        window.clearInterval(intervalo);
        intervalo = null;
      }
    }

    $slider.on("click", ".slider-next", function () {
      ir(indice + 1);
      arrancar();
    });
    $slider.on("click", ".slider-prev", function () {
      ir(indice - 1);
      arrancar();
    });
    $puntos.on("click", "button", function () {
      ir($(this).data("indice"));
      arrancar();
    });

    // pausa solo mientras el ratón está encima de las reseñas
    $ventanaSlider.on("mouseenter", parar).on("mouseleave", arrancar);

    // gesto táctil
    var inicioX = null;
    $ventanaSlider
      .on("touchstart", function (e) {
        inicioX = e.originalEvent.touches[0].clientX;
      })
      .on("touchend", function (e) {
        if (inicioX === null) {
          return;
        }
        var dx = e.originalEvent.changedTouches[0].clientX - inicioX;
        if (Math.abs(dx) > 40) {
          ir(indice + (dx < 0 ? 1 : -1));
          arrancar();
        }
        inicioX = null;
      });

    // flechas de teclado
    $slider.on("keydown", function (e) {
      if (e.key === "ArrowRight") {
        ir(indice + 1);
        arrancar();
      }
      if (e.key === "ArrowLeft") {
        ir(indice - 1);
        arrancar();
      }
    });

    $ventana.on("resize", function () {
      var nuevo = calcularPorVista();
      if (nuevo !== porVista) {
        maquetar();
      }
    });

    maquetar();
    arrancar();
  })();

  /* ---------------------------------------------
       6. ACORDEÓN FAQ (jQuery)
    --------------------------------------------- */
  (function acordeon() {
    var $preguntas = $("#faq .pregunta");
    if (!$preguntas.length) {
      return;
    }

    $preguntas.each(function (i) {
      var $p = $(this);
      var $boton = $p.find("h3 button");
      var $respuesta = $p.find(".respuesta");
      var id = "faq-respuesta-" + (i + 1);

      $respuesta.attr({ id: id, role: "region" });
      $boton.attr({ "aria-controls": id, "aria-expanded": "false" });
      $respuesta.hide();
    });

    function abrir($p) {
      $p.addClass("abierta")
        .find("h3 button")
        .attr("aria-expanded", "true")
        .end()
        .find(".respuesta")
        .stop(true, true)
        .slideDown(300);
    }

    function cerrar($p) {
      $p.removeClass("abierta")
        .find("h3 button")
        .attr("aria-expanded", "false")
        .end()
        .find(".respuesta")
        .stop(true, true)
        .slideUp(300);
    }

    $preguntas.find("h3 button").on("click", function () {
      var $p = $(this).closest(".pregunta");
      var estabaAbierta = $p.hasClass("abierta");

      cerrar($preguntas.not($p)); // solo una abierta a la vez
      if (estabaAbierta) {
        cerrar($p);
      } else {
        abrir($p);
      }
    });

    // todas empiezan cerradas
  })();

  /* ---------------------------------------------
       7. VALIDACIÓN DEL FORMULARIO DE CITAS (jQuery)
    --------------------------------------------- */
  (function formulario() {
    var $form = $("#formulario");
    if (!$form.length) {
      return;
    }

    var $mensaje = $form
      .find(".mensaje")
      .attr({ role: "status", "aria-live": "polite" });
    var reNombre = /^[A-Za-zÀ-ÿñÑ][A-Za-zÀ-ÿñÑ' .-]{1,}$/;
    var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var reTelefono = /^(\+34|0034)?[6789]\d{8}$/;

    // cada regla devuelve un texto de error o '' si es válido
    var reglas = {
      nombre: function (v) {
        if (!v) {
          return "Escribe tu nombre.";
        }
        if (!reNombre.test(v)) {
          return "Introduce un nombre válido (solo letras, mínimo 2).";
        }
        return "";
      },
      apellidos: function (v) {
        if (!v) {
          return "Escribe tus apellidos.";
        }
        if (!reNombre.test(v)) {
          return "Introduce unos apellidos válidos.";
        }
        return "";
      },
      telefono: function (v) {
        if (!v) {
          return "Escribe tu número de teléfono.";
        }
        if (!reTelefono.test(v.replace(/[\s.-]/g, ""))) {
          return "Introduce un teléfono válido (9 cifras, ej. 654 786 284).";
        }
        return "";
      },
      email: function (v) {
        if (!v) {
          return "Escribe tu correo electrónico.";
        }
        if (!reEmail.test(v)) {
          return "Introduce un correo válido (ej. nombre@gmail.com).";
        }
        return "";
      },
      artista: function (v) {
        return v ? "" : "Elige un artista (o “Sin preferencia”).";
      },
      zona: function (v) {
        if (!v) {
          return "Indica el lugar del cuerpo.";
        }
        if (v.length < 3) {
          return "Describe mejor la zona (mínimo 3 letras).";
        }
        return "";
      },
      idea: function (v) {
        if (!v) {
          return "Cuéntanos la idea de tu tatuaje.";
        }
        if (v.length < 15) {
          return "Cuéntanos un poco más (mínimo 15 caracteres).";
        }
        return "";
      },
    };

    // un hueco de error bajo cada campo
    $form.find(".campo").each(function () {
      var $campo = $(this);
      var $control = $campo.find("input, select, textarea");
      var id = $control.attr("id") + "-error";
      $('<span class="error" role="alert"></span>')
        .attr("id", id)
        .appendTo($campo);
      $control.attr("aria-describedby", id);
    });

    function validar($control) {
      var nombre = $control.attr("name");
      var regla = reglas[nombre];
      if (!regla) {
        return true;
      }

      var valor = $.trim($control.val());
      var error = regla(valor);
      var $texto = $control.closest(".campo").find(".error");

      $control
        .toggleClass("invalido", !!error)
        .attr("aria-invalid", error ? "true" : "false");
      $texto.text(error);
      return !error;
    }

    // al salir del campo y al escribir (si ya tenía error)
    $form.on("blur", "input, select, textarea", function () {
      validar($(this));
    });
    $form.on("input change", "input, select, textarea", function () {
      if ($(this).hasClass("invalido")) {
        validar($(this));
      }
    });

    $form.on("submit", function (e) {
      e.preventDefault();
      $mensaje.removeClass("ok ko").text("");

      var $primero = null;
      $form.find("input, select, textarea").each(function () {
        if (!validar($(this)) && !$primero) {
          $primero = $(this);
        }
      });

      if ($primero) {
        $mensaje
          .addClass("ko")
          .text("Revisa los campos marcados en rojo antes de enviar.");
        $primero.trigger("focus");
        return;
      }

      // aquí iría el envío real (fetch/AJAX); en la maqueta lo simulamos
      var $enviar = $form.find(".enviar").prop("disabled", true);
      window.setTimeout(function () {
        var nombre = $.trim($form.find("#nombre").val());
        $form[0].reset();
        $form
          .find(".invalido")
          .removeClass("invalido")
          .attr("aria-invalid", "false");
        $form.find(".error").text("");
        $enviar.prop("disabled", false);
        $mensaje
          .addClass("ok")
          .text(
            "¡Gracias, " +
              nombre +
              "! Hemos recibido tu solicitud y te escribiremos pronto para confirmar la cita.",
          );
      }, 600);
    });
  })();
});
