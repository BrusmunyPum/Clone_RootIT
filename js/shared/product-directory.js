(function () {
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

  function toSlug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeRootAssetPath(value) {
    var path = String(value || "").trim();

    if (!path) {
      return "";
    }

    if (/^https?:\/\//i.test(path) || path.indexOf("//") === 0) {
      return path;
    }

    if (path.indexOf("../") === 0) {
      return "./" + path.slice(3);
    }

    if (path.indexOf("./") === 0 || path.indexOf("/") === 0) {
      return path;
    }

    return "./" + path;
  }

  function getFileName(value) {
    var clean = String(value || "").split("?")[0].split("#")[0];
    var parts = clean.split("/");
    return parts[parts.length - 1] || "";
  }

  function parseLegacyHref(href) {
    var value = String(href || "").trim();
    var lower = value.toLowerCase();
    var isPromotion = lower.indexOf("promotion-detail") !== -1;
    var productSlug = "";

    if (lower.indexOf("/product/") !== -1) {
      productSlug = decodeURIComponent(value.split("/product/").pop().split("?")[0]);
    } else if (lower.indexOf("promotion-detail") !== -1 && value.indexOf("name=") !== -1) {
      var query = value.split("name=").pop().split("&")[0];
      productSlug = decodeURIComponent(query.replace(/\+/g, " "));
    }

    return {
      href: value,
      slug: toSlug(productSlug),
      isPromotion: isPromotion,
    };
  }

  function normalizeProduct(product, source, categoryHint) {
    var legacy = parseLegacyHref(product && product.href);
    var title = decodeHtml((product && (product.title || product.shortTitle)) || "Product");
    var shortTitle = decodeHtml((product && product.shortTitle) || title);
    var image = normalizeRootAssetPath(product && product.image);
    var fallbackImage = normalizeRootAssetPath(
      (product && (product.fallbackImage || product.image)) || "",
    );
    var fileName =
      (product && product.fileName) ||
      getFileName(product && (product.fallbackImage || product.image));
    var priceValue =
      product && typeof product.priceValue === "number" ? product.priceValue : null;
    var brand = decodeHtml((product && product.brand) || "");
    var category = decodeHtml((product && product.category) || categoryHint || "Products");
    var slug =
      legacy.slug ||
      toSlug((product && product.id) || shortTitle || title || fileName.replace(/\.[^.]+$/, ""));

    return {
      id: (product && product.id) || slug,
      slug: slug,
      source: source || "unknown",
      legacyHref: legacy.href || "",
      isPromotion: legacy.isPromotion,
      title: title,
      shortTitle: shortTitle,
      alt: decodeHtml((product && product.alt) || title),
      image: image,
      fallbackImage: fallbackImage || image,
      fileName: fileName,
      category: category,
      brand: brand,
      description: decodeHtml((product && product.description) || ""),
      priceHtml: (product && product.priceHtml) || "",
      priceValue: priceValue,
    };
  }

  function mergeProducts(primary, secondary) {
    if (!primary) {
      return secondary;
    }

    var merged = {};
    Object.keys(secondary).forEach(function (key) {
      merged[key] = secondary[key];
    });
    Object.keys(primary).forEach(function (key) {
      if (
        primary[key] !== undefined &&
        primary[key] !== null &&
        primary[key] !== ""
      ) {
        merged[key] = primary[key];
      }
    });
    return merged;
  }

  function collectCatalogProducts() {
    if (
      !window.RootITProductCatalog ||
      !Array.isArray(window.RootITProductCatalog.products)
    ) {
      return [];
    }

    return window.RootITProductCatalog.products.map(function (product) {
      return normalizeProduct(product, "catalog");
    });
  }

  function collectIndexProducts() {
    if (
      !window.RootITIndexData ||
      !Array.isArray(window.RootITIndexData.productSections)
    ) {
      return [];
    }

    var items = [];

    window.RootITIndexData.productSections.forEach(function (section) {
      if (!Array.isArray(section.products)) {
        return;
      }

      section.products.forEach(function (product) {
        items.push(normalizeProduct(product, "index", section.title));
      });
    });

    return items;
  }

  function buildDirectory() {
    var map = {};

    collectIndexProducts().forEach(function (product) {
      if (!product.slug) {
        return;
      }

      map[product.slug] = mergeProducts(product, map[product.slug]);
    });

    collectCatalogProducts().forEach(function (product) {
      if (!product.slug) {
        return;
      }

      map[product.slug] = mergeProducts(product, map[product.slug]);
    });

    return Object.keys(map).map(function (key) {
      return map[key];
    });
  }

  function getAllProducts() {
    return buildDirectory();
  }

  function getProductBySlug(slug) {
    var target = toSlug(slug);
    var products = getAllProducts();

    for (var i = 0; i < products.length; i += 1) {
      if (products[i].slug === target || products[i].id === slug) {
        return products[i];
      }
    }

    return null;
  }

  function buildDetailUrl(product, basePath) {
    var normalized = normalizeProduct(product || {}, "runtime");
    var target = basePath || "./product-detail.html";
    return target + "?product=" + encodeURIComponent(normalized.slug);
  }

  function buildListingHref(product, options) {
    var normalized = normalizeProduct(product || {}, "runtime");

    if (normalized.isPromotion && normalized.legacyHref) {
      return normalized.legacyHref;
    }

    return buildDetailUrl(normalized, options && options.basePath);
  }

  window.RootITProductDirectory = {
    buildDetailUrl: buildDetailUrl,
    buildListingHref: buildListingHref,
    escapeHtml: escapeHtml,
    getAllProducts: getAllProducts,
    getFileName: getFileName,
    getProductBySlug: getProductBySlug,
    normalizeProduct: normalizeProduct,
    normalizeRootAssetPath: normalizeRootAssetPath,
    toSlug: toSlug,
  };
})();
