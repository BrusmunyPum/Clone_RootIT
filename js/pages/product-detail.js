(function () {
  function initProductSwiper() {
    if (!$(".productThumbs").length || !$(".productSwiper").length) {
      return;
    }

    // Dedicated product gallery setup keeps this page independent from generic sliders.
    var swiperThumbs = new Swiper(".productThumbs", {
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

    var productSwiper = new Swiper(".productSwiper", {
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
      $(".product-swiper-next, .product-swiper-prev").toggleClass(
        "is-busy",
        isBusy,
      );
    }

    setProductSwiperBusy(false);

    productSwiper.on("transitionStart", function () {
      setProductSwiperBusy(true);
    });

    productSwiper.on("transitionEnd", function () {
      setProductSwiperBusy(false);
      productSwiper.updateAutoHeight();
    });

    $(".productSwiper img").on("load", function () {
      productSwiper.updateAutoHeight();
      productSwiper.update();
      swiperThumbs.update();
    });
  }

  function initSpecToggle() {
    var container = document.getElementById("specContainer");
    var btnWrapper = document.getElementById("specBtnWrapper");
    var btn = document.getElementById("toggleSpecBtn");

    if (!container || !btnWrapper || !btn) {
      return;
    }

    if (container.scrollHeight > 460) {
      btnWrapper.style.display = "block";
    } else {
      btnWrapper.style.display = "none";
      container.style.maxHeight = "none";
    }

    btn.addEventListener("click", function () {
      if (container.classList.contains("expanded")) {
        container.classList.remove("expanded");
        btn.innerHTML =
          'See more <i class="fa-solid fa-chevron-down" style="margin-left: 2px;"></i>';
        window.scrollTo({
          top: container.offsetTop - 100,
          behavior: "smooth",
        });
      } else {
        container.classList.add("expanded");
        btn.innerHTML =
          'See less <i class="fa-solid fa-chevron-up" style="margin-left: 2px;"></i>';
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProductSwiper();
  });

  window.addEventListener("load", function () {
    initSpecToggle();
  });
})();
