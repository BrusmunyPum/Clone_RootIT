(function () {
  function initServiceGallery() {
    if (!document.querySelector("#service-gallery") || !document.querySelector("#service-thumbs")) {
      return;
    }

    var thumbs = new Swiper("#service-thumbs", {
      spaceBetween: 10,
      slidesPerView: 4,
      watchSlidesProgress: true,
      watchOverflow: true,
      breakpoints: {
        320: { slidesPerView: 4, spaceBetween: 8 },
        768: { slidesPerView: 4, spaceBetween: 10 },
      },
    });

    new Swiper("#service-gallery", {
      spaceBetween: 10,
      loop: true,
      autoHeight: true,
      watchOverflow: true,
      navigation: {
        nextEl: "#service-gallery .swiper-button-next",
        prevEl: "#service-gallery .swiper-button-prev",
      },
      thumbs: { swiper: thumbs },
    });
  }

  function initServiceWorkSlider() {
    if (!document.querySelector("#service-work-slider")) {
      return;
    }

    new Swiper("#service-work-slider", {
      slidesPerView: 1,
      spaceBetween: 22,
      navigation: {
        nextEl: "#work-next",
        prevEl: "#work-prev",
      },
      breakpoints: {
        480: { slidesPerView: 1.2, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 18 },
        992: { slidesPerView: 3, spaceBetween: 20 },
        1200: { slidesPerView: 4, spaceBetween: 22 },
      },
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initServiceGallery();
    initServiceWorkSlider();
  });
})();
