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

  function shouldRewriteRelativeUrl(value) {
    return (
      value &&
      !/^(?:[a-z]+:|\/\/|#|\/)/i.test(value) &&
      !value.startsWith("data:")
    );
  }

  function isRootITAbsoluteUrl(value) {
    return /^https?:\/\/(?:www\.)?rootitsupport\.com(?=\/|$)/i.test(
      String(value || ""),
    );
  }

  function isRootRelativeUrl(value) {
    return typeof value === "string" && value.startsWith("/");
  }

  function buildLocalTarget(pathname, search, hash, attribute) {
    var cleanPath = String(pathname || "/");
    var lowerPath = cleanPath.toLowerCase();
    var query = search || "";
    var fragment = hash || "";

    if (
      lowerPath === "/favicon.ico" ||
      lowerPath === "/favicon.png" ||
      lowerPath.indexOf("/components/") === 0 ||
      lowerPath.indexOf("/userfiles/") === 0 ||
      lowerPath.indexOf("/images/") === 0 ||
      lowerPath.indexOf("/css/") === 0 ||
      lowerPath.indexOf("/js/") === 0 ||
      lowerPath.indexOf("/data/") === 0
    ) {
      return cleanPath.replace(/^\/+/, "") + query + fragment;
    }

    if (attribute === "src") {
      return cleanPath.replace(/^\/+/, "") + query + fragment;
    }

    if (lowerPath === "/" || lowerPath === "/index.html") {
      return "index.html" + query + fragment;
    }

    if (
      lowerPath === "/product-all" ||
      lowerPath === "/product-all.html" ||
      lowerPath.indexOf("/promotion") === 0 ||
      lowerPath.indexOf("/category-detail") === 0 ||
      lowerPath.indexOf("/product-categories") === 0 ||
      lowerPath.indexOf("/search-result") === 0
    ) {
      return "components/product-all.html" + fragment;
    }

    if (
      lowerPath.indexOf("/product/") === 0 ||
      lowerPath.indexOf("/promotion-detail") === 0
    ) {
      return "components/product-detail.html" + fragment;
    }

    if (lowerPath === "/contact-us" || lowerPath === "/contact-us.html") {
      return "components/contact-me.html" + query + fragment;
    }

    if (
      lowerPath === "/about-us" ||
      lowerPath === "/our-work" ||
      lowerPath === "/portfolio" ||
      lowerPath === "/portfolio.html"
    ) {
      return "components/portfolio.html" + fragment;
    }

    if (lowerPath.indexOf("/service/it-support") === 0) {
      return "components/it-support.html" + fragment;
    }

    if (lowerPath.indexOf("/service/time-attendance") === 0) {
      return "components/contact-me.html?subject=Time%20Attendance" + fragment;
    }

    if (lowerPath.indexOf("/service/camera-surveillance") === 0) {
      return (
        "components/contact-me.html?subject=Security%20Camera%20Systems" +
        fragment
      );
    }

    if (lowerPath.indexOf("/service/door-access") === 0) {
      return (
        "components/contact-me.html?subject=Access%20Control%20Systems" +
        fragment
      );
    }

    if (lowerPath.indexOf("/service/network-solutions") === 0) {
      return "components/contact-me.html?subject=Network%20Solutions" + fragment;
    }

    if (
      lowerPath === "/product-brand" ||
      lowerPath === "/product-brand.html"
    ) {
      return "components/product-brand.html" + fragment;
    }

    if (/\/[^/]+\.html$/i.test(lowerPath)) {
      return "components/product-brand.html" + fragment;
    }

    if (attribute === "action") {
      return "components/product-all.html" + fragment;
    }

    return "components/product-all.html" + fragment;
  }

  function toLocalSiteUrl(value, attribute) {
    if (!value) {
      return value;
    }

    if (isRootITAbsoluteUrl(value)) {
      var parsedAbsoluteUrl = new URL(value);
      return new URL(
        buildLocalTarget(
          parsedAbsoluteUrl.pathname,
          parsedAbsoluteUrl.search,
          parsedAbsoluteUrl.hash,
          attribute,
        ),
        siteRootUrl,
      ).href;
    }

    if (isRootRelativeUrl(value)) {
      var parsedRelativeUrl = new URL(value, siteRootUrl);
      return new URL(
        buildLocalTarget(
          parsedRelativeUrl.pathname,
          parsedRelativeUrl.search,
          parsedRelativeUrl.hash,
          attribute,
        ),
        siteRootUrl,
      ).href;
    }

    return value;
  }

  function rewriteLocalSiteUrls(container) {
    container
      .querySelectorAll("[href], [src], [action]")
      .forEach(function (node) {
        ["href", "src", "action"].forEach(function (attribute) {
          var value = node.getAttribute(attribute);
          if (!isRootITAbsoluteUrl(value) && !isRootRelativeUrl(value)) {
            return;
          }

          node.setAttribute(attribute, toLocalSiteUrl(value, attribute));
        });
      });
  }

  function rewritePartialUrls(container) {
    container
      .querySelectorAll("[href], [src], [action]")
      .forEach(function (node) {
        ["href", "src", "action"].forEach(function (attribute) {
          var value = node.getAttribute(attribute);
          if (isRootITAbsoluteUrl(value) || isRootRelativeUrl(value)) {
            node.setAttribute(attribute, toLocalSiteUrl(value, attribute));
            return;
          }

          if (!shouldRewriteRelativeUrl(value)) {
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
  window.RootITPartials.rewriteLocalSiteUrls = rewriteLocalSiteUrls;
  window.RootITPartials.toLocalSiteUrl = toLocalSiteUrl;

  document.addEventListener("DOMContentLoaded", function () {
    loadSharedPartials();
  });
})();
