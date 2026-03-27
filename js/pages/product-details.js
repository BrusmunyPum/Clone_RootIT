(function () {
  var directory = window.RootITProductDirectory;

  if (!directory) {
    return;
  }

  function decodeHtml(value) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = String(value || "");
    return textarea.value;
  }

  function safeValue(value) {
    return directory.escapeHtml(decodeHtml(value));
  }

  function getQueryParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  }

  function uniqueItems(list) {
    var seen = {};
    return list.filter(function (item) {
      if (!item || seen[item]) {
        return false;
      }
      seen[item] = true;
      return true;
    });
  }

  function getFileNameWithoutExt(fileName) {
    return String(fileName || "").replace(/\.[^.]+$/, "");
  }

  function getFileExtension(fileName) {
    var match = String(fileName || "").match(/(\.[^.]+)$/);
    return match ? match[1] : ".jpg";
  }

  function loadImage(source) {
    return new Promise(function (resolve) {
      var image = new Image();

      image.onload = function () {
        resolve(source);
      };

      image.onerror = function () {
        resolve(null);
      };

      image.src = source;
    });
  }

  function buildImageCandidates(product) {
    var fileName =
      product.fileName || directory.getFileName(product.image || product.fallbackImage);
    var baseName = getFileNameWithoutExt(fileName);
    var extension = getFileExtension(fileName);
    var productImage = directory.normalizeRootAssetPath(product.image);
    var fallbackImage = directory.normalizeRootAssetPath(product.fallbackImage);
    var candidates = [
      "./userfiles/product-details/" + fileName,
      "./userfiles/product-details/" + baseName + "-2" + extension,
      "./userfiles/product-details/" + baseName + "-3" + extension,
      "./userfiles/product-details/" + baseName + "-4" + extension,
      "./userfiles/products/" + fileName,
      "./userfiles/thumbs/" + fileName,
      productImage,
      fallbackImage,
    ];

    return uniqueItems(candidates);
  }

  function renderGallery(images, product) {
    var slides = images
      .map(function (image, index) {
        return [
          '<div class="swiper-slide">',
          '  <img src="' +
            safeValue(image) +
            '" alt="' +
            safeValue(product.title) +
            " - " +
            (index + 1) +
            '" class="img-responsive center-block">',
          "</div>",
        ].join("");
      })
      .join("");

    var thumbs = images
      .map(function (image, index) {
        return [
          '<div class="swiper-slide">',
          '  <img src="' +
            safeValue(image) +
            '" alt="' +
            safeValue(product.title) +
            " thumbnail " +
            (index + 1) +
            '" class="img-responsive center-block">',
          "</div>",
        ].join("");
      })
      .join("");

    return [
      '<div class="product-gallery-box">',
      '  <div class="swiper productSwiper" style="position: relative;">',
      '    <div class="swiper-wrapper">' + slides + "</div>",
      '    <div class="swiper-button-next"></div>',
      '    <div class="swiper-button-prev"></div>',
      "  </div>",
      '  <div class="swiper productThumbs">',
      '    <div class="swiper-wrapper">' + thumbs + "</div>",
      "  </div>",
      "</div>",
    ].join("");
  }

  function buildSummaryList(product) {
    var fileName = product.fileName || directory.getFileName(product.image);
    return [
      "Brand: " + (product.brand || "Root IT Support"),
      "Category: " + (product.category || "IT Products"),
      "SKU: " + getFileNameWithoutExt(fileName || product.slug || product.id),
      "Availability: Contact for price and stock",
    ];
  }

  function renderSummaryList(product) {
    return buildSummaryList(product)
      .map(function (item) {
        return "<li>" + safeValue(item) + "</li>";
      })
      .join("");
  }

  function renderMetaList(product) {
    return [
      { label: "Product ID", value: product.id || product.slug },
      { label: "Brand", value: product.brand || "Root IT Support" },
      { label: "Category", value: product.category || "Products" },
      {
        label: "Image Source",
        value: product.fileName || directory.getFileName(product.image || ""),
      },
    ]
      .map(function (item) {
        return [
          "<li>",
          "  <span>" + safeValue(item.label) + "</span>",
          "  <strong>" + safeValue(item.value) + "</strong>",
          "</li>",
        ].join("");
      })
      .join("");
  }

  function renderProductCard(product) {
    var href = directory.buildDetailUrl(product, "./product-details.html");
    var image = product.image || product.fallbackImage;

    return [
      '<div class="col-md-4 col-sm-6 col-xs-6">',
      '  <div class="pro_box">',
      '    <div class="pro_img">',
      '      <a href="' + safeValue(href) + '">',
      '        <img src="' +
        safeValue(image) +
        '" alt="' +
        safeValue(product.alt || product.title) +
        '" loading="lazy" class="img-responsive center-block" onerror="this.onerror=null;this.src=\'' +
        safeValue(product.fallbackImage || image) +
        '\';">',
      "      </a>",
      "    </div>",
      '    <div class="pro_title">',
      '      <h3 class="ellipis"><a href="' +
        safeValue(href) +
        '">' +
        safeValue(product.shortTitle || product.title) +
        "</a></h3>",
      "    </div>",
      '    <div class="pro_price">' + (product.priceHtml || "<span>Contact us</span>") + "</div>",
      "  </div>",
      "</div>",
    ].join("");
  }

  function getSimilarProducts(product, allProducts) {
    var filtered = allProducts.filter(function (item) {
      return item.slug !== product.slug && !item.isPromotion;
    });

    var sameBrand = filtered.filter(function (item) {
      return product.brand && item.brand === product.brand;
    });

    var sameCategory = filtered.filter(function (item) {
      return item.category === product.category;
    });

    return uniqueProductList(sameBrand.concat(sameCategory, filtered)).slice(0, 6);
  }

  function getFeaturedProducts(product, allProducts) {
    var filtered = allProducts.filter(function (item) {
      return item.slug !== product.slug && !item.isPromotion;
    });

    filtered.sort(function (a, b) {
      var priceA = typeof a.priceValue === "number" ? a.priceValue : 0;
      var priceB = typeof b.priceValue === "number" ? b.priceValue : 0;
      return priceB - priceA;
    });

    return filtered.slice(0, 6);
  }

  function uniqueProductList(list) {
    var seen = {};
    return list.filter(function (item) {
      if (!item || seen[item.slug]) {
        return false;
      }
      seen[item.slug] = true;
      return true;
    });
  }

  function renderGridSection(title, products) {
    if (!products.length) {
      return "";
    }

    return [
      '<div class="product-grid-section">',
      '  <h2 class="h2-cus">' + safeValue(title) + "</h2>",
      '  <div class="row">',
      products.map(renderProductCard).join(""),
      "  </div>",
      "</div>",
    ].join("");
  }

  function renderPage(product, images, allProducts) {
    var app = document.getElementById("product-detail-app");
    var similar = getSimilarProducts(product, allProducts);
    var featured = getFeaturedProducts(product, allProducts);
    var description =
      product.description ||
      product.title +
        " is available from Root IT Support with business-ready support and delivery options.";

    document.title = product.title + " | Root IT Support";

    app.innerHTML = [
      '<div class="product-breadcrumb">',
      '  <a href="./index.html"><i class="fa-solid fa-house"></i></a>',
      "  <span>/</span>",
      '  <a href="./components/product-all.html">Products</a>',
      "  <span>/</span>",
      "  <strong>" + safeValue(product.brand || product.category || "Detail") + "</strong>",
      "</div>",
      '<div class="row">',
      '  <div class="col-md-7 col-sm-12">',
      renderGallery(images, product),
      "  </div>",
      '  <div class="col-md-5 col-sm-12">',
      '    <div class="product-summary">',
      "      <h1>" + safeValue(product.title) + "</h1>",
      '      <div class="pro_price" style="text-align:left;">' +
        (product.priceHtml || "<span>Contact us</span>") +
        "</div>",
      '      <ul class="product-short-specs">' + renderSummaryList(product) + "</ul>",
      '      <div class="availability-badge"><span class="dot"></span>Contact for Price &amp; Stock</div>',
      '      <div class="action-buttons" style="margin-top:20px;">',
      '        <div style="display:flex; gap:15px; flex-wrap:wrap; align-items:center;">',
      '          <a class="btnblue" href="./components/product-all.html"><i class="fa-solid fa-clipboard-list" style="margin-right:10px;"></i> Browse More Products</a>',
      '          <a class="btn-telegram" href="https://t.me/rootitsupport" target="_blank" rel="noopener"><i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i> Chat with Sales Team</a>',
      "        </div>",
      "      </div>",
      '      <div class="product-meta-card"><ul>' + renderMetaList(product) + "</ul></div>",
      "    </div>",
      "  </div>",
      "</div>",
      '<div class="product-description-box">',
      '  <h2 class="h2-cus">Description</h2>',
      "  <p>" + safeValue(description) + "</p>",
      "</div>",
      renderGridSection("Similar Products", similar),
      renderGridSection("Featured Products", featured),
    ].join("");

    if (
      window.RootITAssets &&
      typeof window.RootITAssets.initLocalAssets === "function"
    ) {
      window.RootITAssets.initLocalAssets();
    }

    initSwipers();
  }

  function initSwipers() {
    if (typeof window.Swiper !== "function") {
      return;
    }

    var thumbNode = document.querySelector(".productThumbs");
    var swiperNode = document.querySelector(".productSwiper");

    if (!thumbNode || !swiperNode) {
      return;
    }

    var thumbCount = thumbNode.querySelectorAll(".swiper-slide").length;
    var thumbs = new Swiper(".productThumbs", {
      spaceBetween: 10,
      slidesPerView: Math.min(4, thumbCount || 1),
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(".productSwiper", {
      loop: false,
      autoHeight: true,
      spaceBetween: 10,
      navigation: {
        nextEl: ".productSwiper .swiper-button-next",
        prevEl: ".productSwiper .swiper-button-prev",
      },
      thumbs: {
        swiper: thumbs,
      },
    });
  }

  function renderNotFound() {
    var app = document.getElementById("product-detail-app");
    app.innerHTML = [
      '<div class="product-empty-state">',
      '  <i class="fa-solid fa-circle-exclamation" style="font-size: 26px; color: #0132a1;"></i>',
      "  <h2>Product not found</h2>",
      "  <p>Please return to the catalog and choose another product.</p>",
      '  <p><a class="btnblue" href="./components/product-all.html">Open Product Catalog</a></p>',
      "</div>",
    ].join("");
  }

  function start() {
    var slug = getQueryParam("product");
    var allProducts = directory.getAllProducts();
    var product = directory.getProductBySlug(slug);

    if (!product && allProducts.length) {
      product = allProducts[0];
    }

    if (!product) {
      renderNotFound();
      return;
    }

    Promise.all(buildImageCandidates(product).map(loadImage)).then(function (images) {
      var resolvedImages = images.filter(Boolean);
      renderPage(product, resolvedImages.length ? resolvedImages : [product.image], allProducts);
    });
  }

  document.addEventListener("DOMContentLoaded", start);
})();
