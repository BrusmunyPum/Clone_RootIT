window.RootITPartials = window.RootITPartials || {};

(function() {
  document.documentElement.classList.add("partials-loading");
  if (document.body) {
    document.body.classList.add("partials-loading");
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      document.body.classList.add("partials-loading");
    }, { once: true });
  }

  function loadPartial(targetSelector, filePath) {
    var target = document.querySelector(targetSelector);
    if (!target) {
      return Promise.resolve();
    }

    return fetch(filePath)
      .then(function(response) {
        if (!response.ok) {
          throw new Error("Failed to load partial: " + filePath);
        }
        return response.text();
      })
      .then(function(html) {
        target.innerHTML = html;
      })
      .catch(function(error) {
        console.error(error);
      });
  }

  function loadSharedPartials() {
    return Promise.all([
      loadPartial("#site-header", "./partials/header.html"),
      loadPartial("#site-footer", "./partials/footer.html")
    ]).then(function() {
      document.documentElement.classList.remove("partials-loading");
      if (document.body) {
        document.body.classList.remove("partials-loading");
      }
      document.dispatchEvent(new CustomEvent("partials:loaded"));
    });
  }

  window.RootITPartials.loadSharedPartials = loadSharedPartials;

  document.addEventListener("DOMContentLoaded", function() {
    loadSharedPartials();
  });
})();
