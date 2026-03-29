(function () {
  var PRODUCTS_PER_PAGE = 20;

  function decodeHtml(value) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = String(value || "");
    return textarea.value;
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

  function toSlug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function buildProductList() {
    if (
      window.RootITProductCatalog &&
      Array.isArray(window.RootITProductCatalog.products)
    ) {
      // Normalize the raw catalog data into one shape the renderer can use.
      return window.RootITProductCatalog.products.map(function (product, index) {
        var category = product.category || "Accessories";
        var brand = product.brand || "RootIT";
        return {
          id: product.id || "product-" + (index + 1),
          // Temporary frontend behavior: route every catalog card to the
          // single static detail page until the backend/Next.js detail flow exists.
          href: "./product-detail.html",
          image: product.image,
          title: product.title || "Product",
          shortTitle: product.shortTitle || product.title || "Product",
          alt: product.alt || product.title || "Product",
          description: product.description || "",
          category: category,
          categorySlug: toSlug(category),
          brand: brand,
          brandSlug: toSlug(brand),
          priceHtml: product.priceHtml || "<span>$99.00</span>",
          priceValue: typeof product.priceValue === "number" ? product.priceValue : 99,
          fileName: product.fileName || "",
        };
      });
    }

    return [];
  }

  function buildFacetItems(products, key) {
    var counts = {};

    products.forEach(function (product) {
      counts[product[key]] = (counts[product[key]] || 0) + 1;
    });

    return Object.keys(counts)
      .sort(function (a, b) {
        return a.localeCompare(b);
      })
      .map(function (label) {
        return {
          label: label,
          slug: toSlug(label),
          count: counts[label],
        };
      });
  }

  var allProducts = buildProductList();
  var categories = buildFacetItems(allProducts, "category");
  var brands = buildFacetItems(allProducts, "brand");

  var state = {
    category: "all",
    brand: "all",
    sort: "newest",
    page: 1,
  };

  function getFilteredProducts() {
    var filtered = allProducts.filter(function (product) {
      var categoryMatch =
        state.category === "all" || product.categorySlug === state.category;
      var brandMatch =
        state.brand === "all" || product.brandSlug === state.brand;
      return categoryMatch && brandMatch;
    });

    if (state.sort === "price-asc") {
      filtered.sort(function (a, b) {
        return a.priceValue - b.priceValue;
      });
    } else if (state.sort === "price-desc") {
      filtered.sort(function (a, b) {
        return b.priceValue - a.priceValue;
      });
    }

    return filtered;
  }

  function renderFacetList(items, selectedSlug, type) {
    return items
      .map(function (item) {
        var checked = item.slug === selectedSlug;
        return [
          '<div class="filter-link-item' + (checked ? " active-filter" : "") + '">',
          '  <input type="checkbox" ' +
            (checked ? 'checked="checked" ' : "") +
            'data-filter-type="' +
            type +
            '" data-filter-value="' +
            safeValue(item.slug) +
            '" id="' +
            type +
            "-" +
            safeValue(item.slug) +
            '">',
          '  <label for="' +
            type +
            "-" +
            safeValue(item.slug) +
            '">',
          "    <span>" + safeValue(item.label) + "</span> ",
          '    <span class="count-num">(' + item.count + ")</span>",
          "  </label>",
          "</div>",
        ].join("");
      })
      .join("");
  }

  function renderProductCard(product) {
    return [
      '<div class="product-card-col col-lg-3 col-md-6 col-sm-6 col-6">',
      '  <div class="catalog-product-card">',
      '    <div class="catalog-product-image">',
      '      <a href="' + safeValue(product.href) + '">',
      '        <img src="' +
        safeValue(product.image) +
        '" width="230" height="210" alt="' +
        safeValue(product.alt) +
        '" loading="lazy" class="img-responsive center-block">',
      "      </a>",
      "    </div>",
      '    <div class="catalog-product-title">',
      '      <h3><a href="' +
        safeValue(product.href) +
        '" title="' +
        safeValue(product.description || product.title) +
        '">' +
        safeValue(product.shortTitle || product.title) +
        "</a></h3>",
      "    </div>",
      '    <div class="catalog-product-price">' + product.priceHtml + "</div>",
      "  </div>",
      "</div>",
    ].join("");
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    var buttons = [];
    var startPage = Math.max(1, state.page - 2);
    var endPage = Math.min(totalPages, state.page + 2);

    if (startPage > 1) {
      buttons.push('<button class="pagination-btn" data-page="1">1</button>');
      if (startPage > 2) {
        buttons.push('<span class="pagination-btn" disabled="disabled">...</span>');
      }
    }

    for (var i = startPage; i <= endPage; i += 1) {
      buttons.push(
        '<button class="pagination-btn' +
          (i === state.page ? " active" : "") +
          '" data-page="' +
          i +
          '">' +
          i +
          "</button>",
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('<span class="pagination-btn" disabled="disabled">...</span>');
      }

      buttons.push(
        '<button class="pagination-btn" data-page="' +
          totalPages +
          '">' +
          totalPages +
          "</button>",
      );
    }

    return [
      '<div class="catalog-pagination">',
      '  <button class="pagination-btn" data-page="' +
        Math.max(1, state.page - 1) +
        '"' +
        (state.page === 1 ? ' disabled="disabled"' : "") +
        ">Prev</button>",
      buttons.join(""),
      '  <button class="pagination-btn" data-page="' +
        Math.min(totalPages, state.page + 1) +
        '"' +
        (state.page === totalPages ? ' disabled="disabled"' : "") +
        ">Next</button>",
      "</div>",
    ].join("");
  }

  function updateFilterSidebar() {
    var categoryNode = document.getElementById("category-filter-list");
    var brandNode = document.getElementById("brand-filter-list");
    var statusNode = document.getElementById("catalog-status-text");

    if (categoryNode) {
      categoryNode.innerHTML = renderFacetList(categories, state.category, "category");
    }

    if (brandNode) {
      brandNode.innerHTML = renderFacetList(brands, state.brand, "brand");
    }

    if (statusNode) {
      statusNode.textContent =
        allProducts.length + " uploaded products are ready for display.";
    }
  }

  function updateUrl() {
    var url = new URL(window.location.href);

    if (state.category !== "all") {
      url.searchParams.set("cat", state.category);
    } else {
      url.searchParams.delete("cat");
    }

    if (state.brand !== "all") {
      url.searchParams.set("brand", state.brand);
    } else {
      url.searchParams.delete("brand");
    }

    if (state.sort !== "newest") {
      url.searchParams.set("sort", state.sort);
    } else {
      url.searchParams.delete("sort");
    }

    if (state.page > 1) {
      url.searchParams.set("page", String(state.page));
    } else {
      url.searchParams.delete("page");
    }

    window.history.replaceState({}, "", url.toString());
  }

  function renderCatalog() {
    // Rebuild the visible product grid from the current filter/sort/page state.
    var filteredProducts = getFilteredProducts();
    var totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
    );

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    var startIndex = (state.page - 1) * PRODUCTS_PER_PAGE;
    var endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length);
    var pageProducts = filteredProducts.slice(startIndex, endIndex);

    var resultsNode = document.getElementById("filter-result");
    var resultsText = document.getElementById("results-text-display");

    if (filteredProducts.length) {
      resultsText.textContent =
        startIndex + 1 + " to " + endIndex + " of " + filteredProducts.length + " Results";
    } else {
      resultsText.textContent = "0 Results";
    }

    if (!pageProducts.length) {
      resultsNode.innerHTML =
        '<div class="products-empty"><i class="fa-solid fa-box-open fa-2x"></i><div>No products match the selected filter.</div></div>';
      updateFilterSidebar();
      updateUrl();
      return;
    }

    resultsNode.innerHTML = [
      '<div class="row product-grid">',
      pageProducts.map(renderProductCard).join(""),
      "</div>",
      renderPagination(totalPages),
    ].join("");

    updateFilterSidebar();
    updateUrl();
  }

  function syncInitialStateFromUrl() {
    var url = new URL(window.location.href);
    var validCategorySlugs = categories.map(function (item) {
      return item.slug;
    });
    var validBrandSlugs = brands.map(function (item) {
      return item.slug;
    });

    state.category = url.searchParams.get("cat") || "all";
    state.brand = url.searchParams.get("brand") || "all";
    state.sort = url.searchParams.get("sort") || "newest";
    state.page = parseInt(url.searchParams.get("page") || "1", 10);

    if (state.page < 1 || Number.isNaN(state.page)) {
      state.page = 1;
    }

    if (
      state.category !== "all" &&
      validCategorySlugs.indexOf(state.category) === -1
    ) {
      state.category = "all";
    }

    if (state.brand !== "all" && validBrandSlugs.indexOf(state.brand) === -1) {
      state.brand = "all";
    }
  }

  function bindEvents() {
    var sortSelect = document.getElementById("sort_by");
    var clearButton = document.getElementById("clear-filters-btn");
    var filterOpenButtons = document.querySelectorAll("[data-products-filter-open]");
    var filterCloseButtons = document.querySelectorAll("[data-products-filter-close]");

    sortSelect.value = state.sort;

    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      state.page = 1;
      renderCatalog();
    });

    clearButton.addEventListener("click", function (event) {
      event.preventDefault();
      state.category = "all";
      state.brand = "all";
      state.sort = "newest";
      state.page = 1;
      sortSelect.value = "newest";
      document.body.classList.remove("products-filters-open");
      renderCatalog();
    });

    document.addEventListener("change", function (event) {
      var target = event.target;

      if (target.matches("[data-filter-type='category']")) {
        state.category = target.checked ? target.getAttribute("data-filter-value") : "all";
        state.page = 1;
        if (window.innerWidth <= 991) {
          document.body.classList.remove("products-filters-open");
        }
        renderCatalog();
      }

      if (target.matches("[data-filter-type='brand']")) {
        state.brand = target.checked ? target.getAttribute("data-filter-value") : "all";
        state.page = 1;
        if (window.innerWidth <= 991) {
          document.body.classList.remove("products-filters-open");
        }
        renderCatalog();
      }
    });

    document.addEventListener("click", function (event) {
      var filterOpenButton = event.target.closest("[data-products-filter-open]");
      if (filterOpenButton) {
        document.body.classList.add("products-filters-open");
        return;
      }

      var filterCloseButton = event.target.closest("[data-products-filter-close]");
      if (filterCloseButton) {
        document.body.classList.remove("products-filters-open");
        return;
      }

      var filterToggle = event.target.closest("[data-filter-toggle]");
      if (filterToggle) {
        var filterSection = filterToggle.closest("[data-filter-section]");
        if (filterSection && window.innerWidth <= 991) {
          var isOpen = filterSection.classList.toggle("is-open");
          filterToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
        return;
      }

      var button = event.target.closest("[data-page]");
      if (!button) {
        return;
      }

      var nextPage = parseInt(button.getAttribute("data-page"), 10);
      if (!Number.isNaN(nextPage)) {
        state.page = nextPage;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.body.classList.remove("products-filters-open");
      }
    });

    Array.prototype.forEach.call(filterOpenButtons, function (button) {
      button.addEventListener("click", function () {
        document.body.classList.add("products-filters-open");
      });
    });

    Array.prototype.forEach.call(filterCloseButtons, function (button) {
      button.addEventListener("click", function () {
        document.body.classList.remove("products-filters-open");
      });
    });
  }

  function init() {
    syncInitialStateFromUrl();
    bindEvents();
    renderCatalog();
  }

  window.RootITPage = window.RootITPage || {};
  window.RootITPage.initProductAll = init;
})();
