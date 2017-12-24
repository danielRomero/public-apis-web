document.addEventListener('DOMContentLoaded', function () {

  // Get all "anchor" elements starting at #
  var $anchors = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'), 0);

  // Check if there are any anchor starting at #
  if ($anchors.length > 0) {

    // Add a click event on each of them
    $anchors.forEach(function ($el) {
      $el.addEventListener('click', function () {

        location.hash = $el.getAttribute("href");

      });
    });
  }

});
