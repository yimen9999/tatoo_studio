
$(function () {
  "use strict";

  var $ventana = $(window);

  /* AOS textos estudio */
  if (window.innerWidth <= 900) {
    $("#estudio [data-aos-anchor]").removeAttr(
      "data-aos-anchor data-aos-anchor-placement data-aos-offset",
    );
  }

  if (window.AOS) {
    AOS.init({
      once: false,
      mirror: true,
      offset: 80,
      easing: "ease-out-cubic",
    });

    $(window).on("load", function () {
      AOS.refreshHard();
    });
  }

  /*  sube segunda pagina al hero*/
  var capas = [];

  $(".capas").each(function () {
    var $fija = $(this).children(".capafija");
    var $sube = $(this).children(".capasube");
    var $efecto = $fija.find("video").first();
    if (!$efecto.length) {
      $efecto = $fija;
    }
    if ($fija.length && $sube.length) {
      capas.push({
        fija: $fija.get(0),
        sube: $sube.get(0),
        efecto: $efecto,
        encoger: $(this).is("[data-sin-encoger]") ? 0 : 0.1,
      });
    }
  });

  var capaspendiente = false;

  function animarcapas() {
    capaspendiente = false;

    $.each(capas, function (i, capa) {
      var alto = capa.fija.offsetHeight;
      var arriba = capa.sube.getBoundingClientRect().top;
      var progreso = Math.min(1, Math.max(0, 1 - arriba / alto));

      capa.efecto.css({
        transform: "scale(" + (1 - capa.encoger * progreso).toFixed(3) + ")",
        filter: "brightness(" + (1 - 0.6 * progreso).toFixed(3) + ")",
      });
      capa.sube.style.setProperty(
        "--esquinas",
        (28 * (1 - progreso)).toFixed(1) + "px",
      );
    });
  }

  if (capas.length) {
    $ventana.on("scroll resize", function () {
      if (!capaspendiente) {
        capaspendiente = true;
        window.requestAnimationFrame(animarcapas);
      }
    });
    animarcapas();
  }

  /*   2. MENUBURGER RESPONSIVE */
  var $header = $("header");
  var $boton = $(".hamburguesa");
  var $menu = $(".menu");
  var anchomovil = 900;

  function esmovil() {
    return window.innerWidth <= anchomovil;
  }

  function cerrarmenu() {
    $boton
      .removeClass("activo")
      .attr({ "aria-expanded": "false", "aria-label": "Abrir menú" });
    $boton.find("i").removeClass("fa-xmark").addClass("fa-bars");
    $header.removeClass("abierto");
    if (esmovil()) {
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
    $boton.find("i").toggleClass("fa-bars", !abrir).toggleClass("fa-xmark", abrir);
    $header.toggleClass("abierto", abrir);
    $menu.stop(true, true).slideToggle(250);
  });

  $menu.find("a").on("click", cerrarmenu);

  $ventana.on("resize", function () {
    if (!esmovil()) {
      $menu.removeAttr("style");
      $header.removeClass("abierto");
      $boton.removeClass("activo").attr("aria-expanded", "false");
      $boton.find("i").removeClass("fa-xmark").addClass("fa-bars");
    }
  });

  var $secciones = $("#estudio, #artistas, #estilos, #resenas, #faq, #reserva");
  var $enlacesmenu = $menu.find("a");

  function marcarmenu() {
    var marca = $ventana.scrollTop() + window.innerHeight * 0.35;
    var actual = "";
    $secciones.each(function () {
      if (marca >= $(this).offset().top) {
        actual = "#" + this.id;
      }
    });
    $enlacesmenu.each(function () {
      $(this).toggleClass("activo", $(this).attr("href") === actual);
    });
  }

  /*SIMPLEPARALLAX galería artistas*/

  var imagenesartistas = document.querySelectorAll(".artista img");
  if (window.SimpleParallax && imagenesartistas.length) {
    new SimpleParallax(imagenesartistas, {
      scale: 1.6,
      delay: 0.6,
      transition: "cubic-bezier(0,0,0,1)",
      orientation: "up",
      overflow: false,
    });
  }

  /*TARJETAS FLOTANTES estilos*/
  
  var $tarjetas = $(".estilo");
  var tarjetaspendientes = false;

  $tarjetas.on("click", function (e) {
    if ($(e.target).closest("a").length) {
      return;
    }
    window.location.href = $(this).find(".leermas").attr("href");
  });

  function limitar(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function animartarjetas() {
    tarjetaspendientes = false;

    $tarjetas.each(function (i) {
      var siguiente = $tarjetas.get(i + 1);
      if (!siguiente) {
        return;
      }

      var tarjeta = this;
      var toppegada = parseFloat(window.getComputedStyle(tarjeta).top) || 0;
      var topsiguientepegada =
        parseFloat(window.getComputedStyle(siguiente).top) || 0;
      var alto = tarjeta.offsetHeight;
      var hueco =
        parseFloat(window.getComputedStyle(tarjeta).marginBottom) || 0;

      var distancia = siguiente.getBoundingClientRect().top - toppegada;
      var recorrido = alto + hueco - (topsiguientepegada - toppegada);
      var progreso = limitar(
        1 - (distancia - (topsiguientepegada - toppegada)) / recorrido,
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

  function pediranimaciontarjetas() {
    if (!tarjetaspendientes) {
      tarjetaspendientes = true;
      window.requestAnimationFrame(animartarjetas);
    }
  }

  /*   Scroll*/

  $ventana.on("scroll resize", function () {
    marcarmenu();
    pediranimaciontarjetas();
  });
  marcarmenu();
  animartarjetas();

  /* CARRUSEL DE RESEÑAS*/
  (function carrusel() {
    var $carrusel = $(".carrusel");
    if (!$carrusel.length) {
      return;
    }

    var $ventanacarrusel = $carrusel.find(".carruselventana");
    var $pista = $carrusel.find(".carruselpista");
    var $items = $pista.children(".resena");
    var $puntos = $carrusel.find(".carruselpuntos");
    var total = $items.length;

    var velocidad = 45;
    var duracionsalto = 600;

    var encima = false;
    var destino = null;

    $items
      .clone()
      .attr("aria-hidden", "true")
      .addClass("resenacopia")
      .appendTo($pista);

    function anchoitem() {
      return $items.first().outerWidth() || 1;
    }

    function anchotanda() {
      return anchoitem() * total;
    }

    function posicion() {
      return -parseFloat($pista.css("left")) || 0;
    }

    for (var i = 0; i < total; i++) {
      $('<button type="button" role="tab"></button>')
        .attr("aria-label", "Ir a la reseña " + (i + 1))
        .data("indice", i)
        .appendTo($puntos);
    }

    function marcarpunto() {
      var actual = Math.round(posicion() / anchoitem()) % total;
      $puntos
        .children()
        .removeClass("activo")
        .attr("aria-selected", "false")
        .eq(actual)
        .addClass("activo")
        .attr("aria-selected", "true");
    }

    function avanzar() {
      var falta = anchotanda() - posicion();
      $pista.animate(
        { left: -anchotanda() },
        {
          duration: (falta / velocidad) * 1000,
          easing: "linear",
          step: marcarpunto,
          complete: function () {
            $pista.css("left", 0);
            avanzar();
          },
        },
      );
    }

    function ira(indice) {
      $pista.stop(true);

      if (posicion() >= anchotanda()) {
        $pista.css("left", -(posicion() - anchotanda()));
        indice -= total;
      }
      if (indice < 0) {
        $pista.css("left", -(posicion() + anchotanda()));
        indice += total;
      }

      destino = indice;
      $pista.animate({ left: -indice * anchoitem() }, duracionsalto, function () {
        destino = null;
        marcarpunto();
        if (!encima) {
          avanzar();
        }
      });
    }

    function moveruna(direccion) {
      var actual;
      if (destino !== null) {
        actual = destino;
      } else if (direccion > 0) {
        actual = Math.floor(posicion() / anchoitem() + 0.01);
      } else {
        actual = Math.ceil(posicion() / anchoitem() - 0.3);
      }
      ira(actual + direccion);
    }

    $carrusel.on("click", ".carruselsiguiente", function () {
      moveruna(1);
    });
    $carrusel.on("click", ".carruselanterior", function () {
      moveruna(-1);
    });
    $puntos.on("click", "button", function () {
      ira($(this).data("indice"));
    });

    function pausar() {
      encima = true;
      if (destino === null) {
        $pista.stop(true);
      }
    }

    function seguir() {
      encima = false;
      if (destino === null) {
        avanzar();
      }
    }

    $ventanacarrusel.on("mouseenter", pausar).on("mouseleave", seguir);

    var iniciox = null;
    $ventanacarrusel
      .on("touchstart", function (e) {
        iniciox = e.originalEvent.touches[0].clientX;
        pausar();
      })
      .on("touchend", function (e) {
        var dx = e.originalEvent.changedTouches[0].clientX - iniciox;
        encima = false;
        if (Math.abs(dx) > 40) {
          moveruna(dx < 0 ? 1 : -1);
        } else {
          seguir();
        }
      });

    var anchoantes = anchoitem();
    $ventana.on("resize", function () {
      var ancho = anchoitem();
      if (ancho === anchoantes) {
        return;
      }
      $pista.stop(true);
      $pista.css("left", (-posicion() / anchoantes) * ancho);
      anchoantes = ancho;
      destino = null;
      marcarpunto();
      if (!encima) {
        avanzar();
      }
    });

    marcarpunto();
    avanzar();
  })();

  /* ACORDEÓN FAQ*/

  (function acordeon() {
    var $preguntas = $("#faq .pregunta");
    if (!$preguntas.length) {
      return;
    }

    $preguntas.each(function (i) {
      var $p = $(this);
      var $boton = $p.find("h3 button");
      var $respuesta = $p.find(".respuesta");
      var id = "faqrespuesta" + (i + 1);

      $respuesta.attr({ id: id, role: "region" });
      $boton.attr({ "aria-controls": id, "aria-expanded": "false" });
      $respuesta.hide();
    });

    function abrir($p) {
      $p.addClass("abierta")
        .find("h3 button")
        .attr("aria-expanded", "true")
        .end()
        .find("h3 button i")
        .removeClass("fa-angle-down")
        .addClass("fa-angle-up")
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
        .find("h3 button i")
        .removeClass("fa-angle-up")
        .addClass("fa-angle-down")
        .end()
        .find(".respuesta")
        .stop(true, true)
        .slideUp(300);
    }

    $preguntas.find("h3 button").on("click", function () {
      var $p = $(this).closest(".pregunta");
      var estabaabierta = $p.hasClass("abierta");

      cerrar($preguntas.not($p));
      if (estabaabierta) {
        cerrar($p);
      } else {
        abrir($p);
      }
    });

  })();

  /*VALIDACIÓN DEL FORMULARIO DE CITAS*/
  
  (function formulario() {
    var $form = $("#formulario");
    if (!$form.length) {
      return;
    }

    var $mensaje = $form
      .find(".mensaje")
      .attr({ role: "status", "aria-live": "polite" });
    var renombre = /^[A-Za-zÀ-ÿñÑ][A-Za-zÀ-ÿñÑ' .-]{1,}$/;
    var reemail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var retelefono = /^(\+34|0034)?[6789]\d{8}$/;

    var reglas = {
      nombre: function (v) {
        if (!v) {
          return "Escribe tu nombre.";
        }
        if (!renombre.test(v)) {
          return "Introduce un nombre válido (solo letras, mínimo 2).";
        }
        return "";
      },
      apellidos: function (v) {
        if (!v) {
          return "Escribe tus apellidos.";
        }
        if (!renombre.test(v)) {
          return "Introduce unos apellidos válidos.";
        }
        return "";
      },
      telefono: function (v) {
        if (!v) {
          return "Escribe tu número de teléfono.";
        }
        if (!retelefono.test(v.replace(/[\s.-]/g, ""))) {
          return "Introduce un teléfono válido (9 cifras, ej. 654 786 284).";
        }
        return "";
      },
      email: function (v) {
        if (!v) {
          return "Escribe tu correo electrónico.";
        }
        if (!reemail.test(v)) {
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

    $form.find(".campo").each(function () {
      var $campo = $(this);
      var $control = $campo.find("input, select, textarea");
      var id = $control.attr("id") + "error";
      $('<span class="error" role="alert"></span>')
        .attr("id", id)
        .appendTo($campo);
      $control.attr("aria-describedby", id);
    });

    /* flecha del desplegable de artista */
    $form
      .find(".selector select")
      .on("focus", function () {
        $(this).next("i").removeClass("fa-angle-down").addClass("fa-angle-up");
      })
      .on("blur change", function () {
        $(this).next("i").removeClass("fa-angle-up").addClass("fa-angle-down");
      });

    var maxpalabras = 150;
    var $idea = $form.find("#idea");
    var $contador = $('<span class="contador" aria-live="polite"></span>');
    $idea.after($contador);

    function contarpalabras(texto) {
      var palabras = $.trim(texto).split(/\s+/);
      return palabras[0] === "" ? 0 : palabras.length;
    }

    function limitarpalabras() {
      var texto = $idea.val();
      if (contarpalabras(texto) > maxpalabras) {
        var corte = texto.match(new RegExp("^\\s*(\\S+\\s+){" + (maxpalabras - 1) + "}\\S+"));
        $idea.val(corte[0]);
      }
      var total = contarpalabras($idea.val());
      $contador
        .text(total + " / " + maxpalabras + " palabras")
        .toggleClass("lleno", total >= maxpalabras);
    }

    $idea.on("input", limitarpalabras);
    limitarpalabras();

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

      var $enviar = $form.find(".enviar").prop("disabled", true);
      window.setTimeout(function () {
        var nombre = $.trim($form.find("#nombre").val());
        $form[0].reset();
        $form
          .find(".invalido")
          .removeClass("invalido")
          .attr("aria-invalid", "false");
        $form.find(".error").text("");
        limitarpalabras();
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
