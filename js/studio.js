/* el gato negro · página studio */
$(function () {
  "use strict";

  var video = document.querySelector(".studiohero video");
  if (video) {
    var intento = video.play();
    if (intento && typeof intento.catch === "function") {
      intento.catch(function () {});
    }
  }

  $(window).on("load", function () {
    if (window.AOS) {
      AOS.refresh();
    }
  });
});
