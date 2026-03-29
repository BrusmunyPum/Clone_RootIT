(function () {
  var INQUIRY_STORAGE_KEY =
    (window.RootITInquiry && window.RootITInquiry.storageKey) ||
    "rootit_demo_inquiry_items";

  function getStoredInquiryItems() {
    try {
      var raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
      var items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  }

  function setStoredInquiryItems(items) {
    try {
      window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // Ignore storage errors in static mode.
    }

    if (window.RootITInquiry && typeof window.RootITInquiry.setItems === "function") {
      window.RootITInquiry.setItems(items);
    }
  }

  function resolveProductImagePath(fileName) {
    if (!fileName) {
      return "";
    }

    if (/^(https?:|\/)/.test(fileName)) {
      return fileName;
    }

    return "../userfiles/products/" + fileName;
  }

  function initializeInquiryForm() {
    var form = document.querySelector(".action-buttons form");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var quantityInput = form.querySelector('input[name="pro_qty"]');
      var quantity = Math.max(1, Number(quantityInput ? quantityInput.value : 1) || 1);
      var id = form.querySelector('input[name="pro_id"]');
      var name = form.querySelector('input[name="pro_name"]');
      var price = form.querySelector('input[name="pro_price"]');
      var image = form.querySelector('input[name="pro_image"]');
      var skuSource = document.querySelector(".pro_overview ul li");
      var skuText = skuSource ? skuSource.textContent || "" : "";
      var sku = skuText.replace(/^.*?:\s*/, "").trim();
      var href = "/components/product-detail.html";

      var item = {
        id: id ? String(id.value || "").trim() : String(Date.now()),
        name: name ? String(name.value || "").trim() : document.title,
        href: href,
        image: resolveProductImagePath(image ? image.value : ""),
        price: Number(price ? price.value : 0) || 0,
        quantity: quantity,
        sku: sku,
      };

      var items = getStoredInquiryItems();
      var existingItem = items.find(function (entry) {
        return entry.id === item.id;
      });

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.price = item.price;
        existingItem.name = item.name;
        existingItem.image = item.image;
        existingItem.href = item.href;
        existingItem.sku = item.sku;
      } else {
        items.unshift(item);
      }

      setStoredInquiryItems(items);
      window.location.href = "/components/cart.html";
    });
  }

  function initializeProductSwiper() {
    var thumbsElement = document.querySelector(".productThumbs");
    var productElement = document.querySelector(".productSwiper");

    if (!thumbsElement || !productElement || typeof window.Swiper !== "function") {
      return;
    }

    var swiperThumbs = new Swiper(thumbsElement, {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      breakpoints: {
        320: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
      },
    });

    var productSwiper = new Swiper(productElement, {
      loop: true,
      autoHeight: true,
      speed: 450,
      spaceBetween: 10,
      watchOverflow: true,
      preloadImages: true,
      updateOnImagesReady: true,
      observer: true,
      observeParents: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      preventInteractionOnTransition: true,
      navigation: {
        nextEl: ".product-swiper-next",
        prevEl: ".product-swiper-prev",
      },
      thumbs: { swiper: swiperThumbs },
    });

    function setProductSwiperBusy(isBusy) {
      document
        .querySelectorAll(".product-swiper-next, .product-swiper-prev")
        .forEach(function (element) {
          element.classList.toggle("is-busy", isBusy);
        });
    }

    setProductSwiperBusy(false);

    productSwiper.on("transitionStart", function () {
      setProductSwiperBusy(true);
    });

    productSwiper.on("transitionEnd", function () {
      setProductSwiperBusy(false);
      productSwiper.updateAutoHeight();
    });

    productElement.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("load", function () {
        productSwiper.updateAutoHeight();
        productSwiper.update();
        swiperThumbs.update();
      });
    });
  }

  function initializeSpecToggle() {
    var container = document.getElementById("specContainer");
    var buttonWrapper = document.getElementById("specBtnWrapper");
    var button = document.getElementById("toggleSpecBtn");

    if (!container || !buttonWrapper || !button) {
      return;
    }

    if (container.scrollHeight > 460) {
      buttonWrapper.style.display = "block";
    } else {
      buttonWrapper.style.display = "none";
      container.style.maxHeight = "none";
    }

    button.addEventListener("click", function () {
      if (container.classList.contains("expanded")) {
        container.classList.remove("expanded");
        button.innerHTML =
          'See more <i class="fa-solid fa-chevron-down" style="margin-left: 2px;"></i>';
        window.scrollTo({
          top: container.offsetTop - 100,
          behavior: "smooth",
        });
      } else {
        container.classList.add("expanded");
        button.innerHTML =
          'See less <i class="fa-solid fa-chevron-up" style="margin-left: 2px;"></i>';
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initializeProductSwiper);
  document.addEventListener("DOMContentLoaded", initializeInquiryForm);
  window.addEventListener("load", initializeSpecToggle);
})();
