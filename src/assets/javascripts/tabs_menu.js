document.addEventListener('DOMContentLoaded', function () {

  // Get all "tabs" elements
  var $tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs ul li'), 0);

  // Check if there are any tabs
  if ($tabs.length > 0) {

    // Add a click event on each of them
    $tabs.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Hide all active elements
        var $allTabs = Array.prototype.slice.call(document.querySelectorAll('.tabs ul li'), 0);
        $allTabs.forEach(function ($tab) {
          $tab.classList.remove('is-active');
        });

        var $apiDocContent = Array.prototype.slice.call(document.querySelectorAll('.api-doc.content'), 0);
        $apiDocContent.forEach(function ($doc_content) {
          $doc_content.classList.add('is-hidden');
        });


        // Get the target from the "data-target" attribute
        var anchor = $el.querySelector('a');
        var target = anchor.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "tabs-menu" and the "tabs-content"
        $el.classList.add('is-active');
        $target.classList.remove('is-hidden');

      });
    });
  }

});
