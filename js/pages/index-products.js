(function () {
  window.RootITPage = window.RootITPage || {};

  var htmlDecoder = document.createElement("textarea");

  function decodeHtml(value) {
    htmlDecoder.innerHTML = String(value || "");
    return htmlDecoder.value;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeValue(value) {
    return escapeHtml(decodeHtml(value));
  }

  function renderProductCard(product, badgeLabel) {
    var productHref =
      window.RootITProductDirectory &&
      typeof window.RootITProductDirectory.buildListingHref === "function"
        ? window.RootITProductDirectory.buildListingHref(product, {
            basePath: "./product-details.html",
          })
        : product.href;

    var badgeMarkup = badgeLabel
      ? '<div class="pro_best_selling"><span>' +
        safeValue(badgeLabel) +
        "</span></div>"
      : "";

    return [
      '<div class="swiper-slide">',
      '  <div class="pro_box">',
      badgeMarkup,
      '    <div class="pro_img">',
      '      <a href="' + safeValue(productHref) + '">',
      '        <img src="' +
        safeValue(product.image) +
        '" width="230" height="210" alt="' +
        safeValue(product.alt || product.title) +
        '" loading="lazy" class="img-responsive center-block">',
      "      </a>",
      "    </div>",
      '    <div class="pro_title">',
      '      <h3><a href="' +
        safeValue(productHref) +
        '">' +
        safeValue(product.title) +
        "</a></h3>",
      "    </div>",
      '    <div class="pro_price">' + (product.priceHtml || "") + "</div>",
      "  </div>",
      "</div>",
    ].join("");
  }

  function renderProductSection(section) {
    var viewAllMarkup = section.viewAll
      ? '<a href="' +
        safeValue(section.viewAll) +
        '" class="btn-view-all">View All <i class="fa-solid fa-arrow-right"></i></a>'
      : "";
    var wrapperStyle = section.isMuted
      ? ' style="background-color: #f8f9fa;"'
      : "";

    return [
      '<div class="product_wrapper"' + wrapperStyle + ">",
      '  <div class="container-fluid">',
      '    <div class="section-header">',
      '      <h2 class="section-title">' + safeValue(section.title) + "</h2>",
      "      " + viewAllMarkup,
      "    </div>",
      '    <div class="swiper productSlider">',
      '      <div class="swiper-wrapper">',
      section.products
        .map(function (product) {
          return renderProductCard(product, section.badgeLabel);
        })
        .join(""),
      "      </div>",
      '      <div class="swiper-button-next"></div>',
      '      <div class="swiper-button-prev"></div>',
      "    </div>",
      "  </div>",
      "</div>",
    ].join("");
  }

  function renderIndexProductSections() {
    var mountNode = document.getElementById("index-product-sections");
    var data = window.RootITIndexData;

    if (!mountNode || !data || !Array.isArray(data.productSections)) {
      return;
    }

    mountNode.innerHTML = data.productSections
      .map(renderProductSection)
      .join("");

    if (
      window.RootITPartials &&
      typeof window.RootITPartials.rewriteLocalSiteUrls === "function"
    ) {
      window.RootITPartials.rewriteLocalSiteUrls(mountNode);
    }

    if (
      window.RootITAssets &&
      typeof window.RootITAssets.initLocalAssets === "function"
    ) {
      window.RootITAssets.initLocalAssets();
    }
  }

  window.RootITPage.renderIndexProductSections = renderIndexProductSections;
})();
