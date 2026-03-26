(function () {
  window.RootITPage = window.RootITPage || {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderBrandCard(brand) {
    return [
      '<div class="col-md-2 col-sm-3 col-xs-4">',
      '  <a href="' + escapeHtml(brand.href) + '" class="brand_box">',
      '    <img src="' +
        escapeHtml(brand.image) +
        '" alt="' +
        escapeHtml(brand.name) +
        '" loading="lazy" class="img-responsive" />',
      "  </a>",
      "</div>",
    ].join("");
  }

  function renderBrandGrid() {
    var mountNode = document.getElementById("brand-grid");
    var data = window.RootITBrandData;

    if (!mountNode || !data || !Array.isArray(data.brands)) {
      return;
    }

    mountNode.innerHTML = data.brands.map(renderBrandCard).join("");

    if (
      window.RootITAssets &&
      typeof window.RootITAssets.initLocalAssets === "function"
    ) {
      window.RootITAssets.initLocalAssets();
    }
  }

  window.RootITPage.renderBrandGrid = renderBrandGrid;
  document.addEventListener("DOMContentLoaded", renderBrandGrid);
})();
