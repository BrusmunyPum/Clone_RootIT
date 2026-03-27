document.documentElement.style.overflowX = "hidden";

window.RootITPage = window.RootITPage || {};

window.RootITAuth = window.RootITAuth || {
  demoUser: {
    firstName: "Demo",
    lastName: "User",
    email: "demo@rootit.local",
    password: "RootIT123!",
    phone: "012345678",
  },
  storageKey: "rootit_demo_auth_user",
};

function getStoredAuthUser() {
  try {
    var raw = window.localStorage.getItem(window.RootITAuth.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setStoredAuthUser(user) {
  try {
    if (user) {
      window.localStorage.setItem(window.RootITAuth.storageKey, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(window.RootITAuth.storageKey);
    }
  } catch (error) {
    // Ignore demo storage errors in static mode.
  }
}

window.RootITAuth.getUser = getStoredAuthUser;
window.RootITAuth.setUser = setStoredAuthUser;

function renderHeaderAuthState() {
  var loginLink = document.getElementById("loginTrigger");
  if (!loginLink) {
    return;
  }

  var userDropdown = loginLink.closest(".user-dropdown");
  var userMenu = document.getElementById("userDropdownMenu");
  var user = getStoredAuthUser();
  if (!userDropdown) {
    return;
  }
  if (!user) {
    loginLink.setAttribute("href", "/components/login.html");
    loginLink.setAttribute("aria-label", "Sign in to your account");
    loginLink.innerHTML = '<i class="fa-solid fa-user"></i> Sign In';
    loginLink.classList.remove("auth-user-link");
    userDropdown.classList.remove("is-authenticated");
    if (userMenu) {
      userMenu.style.display = "none";
    }
    return;
  }

  loginLink.setAttribute("href", "/components/dashboard.html");
  loginLink.setAttribute("aria-label", "Open your dashboard");
  loginLink.classList.add("auth-user-link");
  userDropdown.classList.add("is-authenticated");
  loginLink.innerHTML =
    '<i class="fa-solid fa-circle-user"></i> ' +
    (user.firstName ? user.firstName : "Account") +
    ' <i class="fa-solid fa-chevron-down"></i>';

  if (userMenu) {
    userMenu.style.display = "";
  }
}

function bindAuthActions() {
  $(document)
    .off("click.rootitLogout", "#logoutTrigger")
    .on("click.rootitLogout", "#logoutTrigger", function (e) {
      e.preventDefault();
      setStoredAuthUser(null);
      renderHeaderAuthState();

      if (
        window.location.pathname.indexOf("/components/login.html") !== -1 ||
        window.location.pathname.indexOf("/components/register.html") !== -1 ||
        window.location.pathname.indexOf("/components/dashboard.html") !== -1
      ) {
        window.location.href = "/components/login.html";
      }
    });
}

function bindSearchPopupHandlers() {
  $(document)
    .off("click.rootitSearchOpen", ".search-toggle-btn")
    .on("click.rootitSearchOpen", ".search-toggle-btn", function (e) {
      var $searchBox = $("#globalSearchBox");
      if (!$searchBox.length) return;
      e.preventDefault();
      $searchBox.fadeIn(300);
      $("body").css("overflow", "hidden");
      setTimeout(function () {
        $searchBox.find(".txt_cus").first().focus();
      }, 400);
    });

  $(document)
    .off("click.rootitSearchClose", ".close-search-btn")
    .on("click.rootitSearchClose", ".close-search-btn", function (e) {
      var $searchBox = $("#globalSearchBox");
      if (!$searchBox.length) return;
      e.preventDefault();
      $searchBox.fadeOut(300);
      $(".search-results-wrapper").hide();
      $("body").css("overflow", "auto");
    });

  $(document)
    .off("keydown.rootitSearchEscape")
    .on("keydown.rootitSearchEscape", function (e) {
      var $searchBox = $("#globalSearchBox");
      if (e.key === "Escape" && $searchBox.is(":visible")) {
        $searchBox.fadeOut(300);
        $(".search-results-wrapper").hide();
        $("body").css("overflow", "auto");
      }
    });
}

function initIndexPage() {
  if (window.RootITPage.renderIndexProductSections) {
    window.RootITPage.renderIndexProductSections();
  }

  if ($(".toggle-password").length > 0) {
    $(document).on("click", ".toggle-password", function () {
      const targetSelector = $(this).attr("data-target");
      const input = $(targetSelector);

      if (input.attr("type") === "password") {
        input.attr("type", "text");
        $(this).removeClass("fa-eye").addClass("fa-eye-slash");
      } else {
        input.attr("type", "password");
        $(this).removeClass("fa-eye-slash").addClass("fa-eye");
      }
    });
  }

  if ($(".mySwiper").length > 0) {
    var slideCount = $(".mySwiper .swiper-slide").length;
    var randomStartIndex = Math.floor(Math.random() * slideCount);

    new Swiper(".mySwiper", {
      initialSlide: randomStartIndex,
      loop: false,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 1000,
      autoplay: false,
      preloadImages: true,
      updateOnImagesReady: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  if (
    !$("body").hasClass("product-detail-page") &&
    $(".productThumbs").length > 0 &&
    $(".productSwiper").length > 0
  ) {
    var swiperThumbs = new Swiper(".productThumbs", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: { 320: { slidesPerView: 3 }, 768: { slidesPerView: 4 } },
    });

    new Swiper(".productSwiper", {
      loop: false,
      autoHeight: true,
      spaceBetween: 10,
      autoplay: { delay: 3500, disableOnInteraction: false },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: { swiper: swiperThumbs },
    });
  }

  if ($(".brandSwiper").length > 0) {
    new Swiper(".brandSwiper", {
      slidesPerView: 8,
      spaceBetween: 20,
      loop: false,
      autoplay: { delay: 2000, disableOnInteraction: false },
      breakpoints: {
        320: { slidesPerView: 3, spaceBetween: 10 },
        768: { slidesPerView: 5, spaceBetween: 15 },
        1200: { slidesPerView: 7, spaceBetween: 20 },
        1400: { slidesPerView: 8, spaceBetween: 20 },
      },
    });
  }

  if ($(".productSlider").length > 0) {
    $(".productSlider").each(function () {
      var $slider = $(this);
      var $wrapper = $slider.closest(".product_wrapper");
      var nextEl = $wrapper.find(".swiper-button-next").get(0);
      var prevEl = $wrapper.find(".swiper-button-prev").get(0);

      new Swiper(this, {
        slidesPerView: 2,
        spaceBetween: 10,
        grabCursor: true,
        navigation: { nextEl: nextEl, prevEl: prevEl },
        loop: false,
        breakpoints: {
          480: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 15 },
          1366: { slidesPerView: 5, spaceBetween: 20 },
          1920: { slidesPerView: 6, spaceBetween: 20 },
        },
      });
    });
  }

  if ($(window).width() > 768) {
    $("li.dropdown").hover(
      function () {
        $(this).find(".dropdown-menu").stop(true, true).delay(200).fadeIn(500);
      },
      function () {
        $(this).find(".dropdown-menu").stop(true, true).delay(200).fadeOut(500);
      },
    );
  }

  bindSearchPopupHandlers();

  let ajaxRequest;

  $(document).on("keyup", ".txt_cus", function () {
    let $input = $(this);
    let query = $input.val();
    let $container = $input
      .closest(".search-flex-container")
      .find(".search-results-wrapper");

    if (ajaxRequest) {
      ajaxRequest.abort();
    }

    if (query.length > 1) {
      ajaxRequest = $.ajax({
        url: "/ajax-search.php",
        method: "POST",
        data: { query: query },
        success: function (data) {
          $container.html(data).show();
        },
        error: function (xhr) {
          if (xhr.statusText !== "abort") {
            console.error("Search Error Status: " + xhr.status);
          }
        },
      });
    } else {
      $container.hide();
    }
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-flex-container").length) {
      $(".search-results-wrapper").hide();
    }
  });

  if ($('[data-toggle="popover"]').length > 0) {
    $('[data-toggle="popover"]').popover({
      trigger: "hover focus",
      html: true,
      container: "body",
    });

    $("body").on("click", function (e) {
      $('[data-toggle="popover"]').each(function () {
        if (
          !$(this).is(e.target) &&
          $(this).has(e.target).length === 0 &&
          $(".popover").has(e.target).length === 0
        ) {
          $(this).popover("hide");
        }
      });
    });
  }
}

function bindSharedLayoutBehavior() {
  function syncStickyHeader() {
    if ($(window).scrollTop() >= 100) {
      $(".header_wrapper").addClass("sticky-active");
      $(".header_top").addClass("header-hidden");
    } else {
      $(".header_wrapper").removeClass("sticky-active");
      $(".header_top").removeClass("header-hidden");
    }
  }

  $(window)
    .off("scroll.rootitSticky")
    .on("scroll.rootitSticky", syncStickyHeader);
  syncStickyHeader();

  document
    .querySelectorAll(".sidebar_menu #menu > li")
    .forEach(function (item) {
      item.onmouseenter = function () {
        if (window.innerWidth > 1024) {
          const subMenu = this.querySelector("ul");
          if (subMenu) {
            const rect = this.getBoundingClientRect();
            subMenu.style.top = rect.top + "px";
            subMenu.style.left = rect.right + "px";
            subMenu.style.display = "block";
          }
        }
      };

      item.onmouseleave = function () {
        const subMenu = this.querySelector("ul");
        if (subMenu) {
          subMenu.style.display = "none";
        }
      };
    });

  if (window.RootITPage.hideSidebarSubMenus) {
    window.removeEventListener("scroll", window.RootITPage.hideSidebarSubMenus);
  }

  window.RootITPage.hideSidebarSubMenus = function () {
    document.querySelectorAll(".sidebar_menu #menu ul").forEach(function (ul) {
      ul.style.display = "none";
    });
  };

  window.addEventListener("scroll", window.RootITPage.hideSidebarSubMenus);
}

const profileForms = ["#profileForm", "#passForm"];

$.each(profileForms, function (index, formId) {
  $(document).on("submit", formId, function (e) {
    e.preventDefault();

    const $form = $(this);
    const $btn = $form.find('button[type="submit"]');
    const originalBtnText = $btn.text();
    const formData = new FormData(this);

    $btn.prop("disabled", true).text("Processing...");

    $.ajax({
      url: "profile_action.php",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        const res = response.trim().split("|");
        if (res[0] === "success") {
          alert(res[1]);
          location.reload();
        } else {
          alert(res[1]);
          $btn.prop("disabled", false).text(originalBtnText);
        }
      },
      error: function () {
        alert("Connection Error!");
        $btn.prop("disabled", false).text(originalBtnText);
      },
    });
  });
});

$(document).ready(initIndexPage);
document.addEventListener("partials:loaded", function () {
  bindSharedLayoutBehavior();
  bindSearchPopupHandlers();
  renderHeaderAuthState();
  bindAuthActions();
});

$(document).ready(function () {
  renderHeaderAuthState();
  bindAuthActions();
});
