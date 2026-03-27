window.RootITPartials = window.RootITPartials || {};

(function () {
  var currentScript = document.currentScript;
  var scriptUrl = currentScript
    ? new URL(currentScript.getAttribute("src"), window.location.href)
    : new URL("./js/shared/partials.js", window.location.href);
  // Resolve the partial directory from the script location so pages in
  // different folders can share the same loader.
  var siteRootUrl = new URL("../../", scriptUrl);
  var partialsBaseUrl = new URL("partials/", siteRootUrl);

  document.documentElement.classList.add("partials-loading");
  if (document.body) {
    document.body.classList.add("partials-loading");
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        document.body.classList.add("partials-loading");
      },
      { once: true },
    );
  }

  function shouldRewriteUrl(value) {
    return (
      value && !/^(?:[a-z]+:|\/\/|#)/i.test(value) && !value.startsWith("data:")
    );
  }

  function rewritePartialUrls(container) {
    container
      .querySelectorAll("[href], [src], [action]")
      .forEach(function (node) {
        ["href", "src", "action"].forEach(function (attribute) {
          var value = node.getAttribute(attribute);
          if (!shouldRewriteUrl(value)) {
            return;
          }

          node.setAttribute(attribute, new URL(value, siteRootUrl).href);
        });
      });
  }

  function loadPartial(targetSelector, filePath) {
    var target = document.querySelector(targetSelector);
    if (!target) {
      return Promise.resolve();
    }

    var partialUrl = new URL(filePath, partialsBaseUrl);

    return fetch(partialUrl.href)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load partial: " + partialUrl.href);
        }
        return response.text();
      })
      .then(function (html) {
        var container = document.createElement("div");
        container.innerHTML = html;
        rewritePartialUrls(container);
        target.innerHTML = container.innerHTML;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function loadSharedPartials() {
    // Header and footer are loaded independently so one failure does not block both.
    return Promise.all([
      loadPartial("#site-header", "header.html"),
      loadPartial("#site-footer", "footer.html"),
    ]).then(function () {
      document.documentElement.classList.remove("partials-loading");
      if (document.body) {
        document.body.classList.remove("partials-loading");
      }
      document.dispatchEvent(new CustomEvent("partials:loaded"));
    });
  }

  window.RootITPartials.loadSharedPartials = loadSharedPartials;

  document.addEventListener("DOMContentLoaded", function () {
    loadSharedPartials();
  });
})();
