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

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function renderBrandCard(brand) {
    return [
      '<div class="col-md-3 col-sm-4 col-6">',
      '  <a href="./product-all.html?brand=' + escapeHtml(slugify(brand.name)) + '" class="brand-card">',
      '    <img src="' +
        escapeHtml(brand.image) +
        '" alt="' +
        escapeHtml(brand.name) +
        '" loading="lazy" class="img-fluid" />',
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
