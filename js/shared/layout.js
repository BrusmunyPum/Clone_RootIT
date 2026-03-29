document.documentElement.style.overflowX = "hidden";

document.documentElement.classList.add("js");

document.documentElement.classList.toggle(
  "touch",
  navigator.maxTouchPoints > 0 || "ontouchstart" in window,
);
document.documentElement.classList.toggle(
  "no-touch",
  !(navigator.maxTouchPoints > 0 || "ontouchstart" in window),
);

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

const PROFILE_FORM_SELECTORS = ["#profileForm", "#passForm"];
const SEARCH_RESULT_SELECTOR = ".search-results-wrapper";
const SEARCH_INPUT_SELECTOR = ".txt_cus";
const SEARCH_CONTAINER_SELECTOR = ".search-flex-container";
const SEARCH_POPUP_SELECTOR = "#globalSearchBox";
const POPOVER_SELECTOR = '[data-bs-toggle="popover"], [data-toggle="popover"]';
const INQUIRY_STORAGE_KEY = "rootit_demo_inquiry_items";
const DEFAULT_INQUIRY_ITEMS = [
  {
    id: "dell-s2725hsm",
    name: "Dell 27 Plus S2725HSM Monitor With IPS (1920 x 1080 at 144Hz, 2xHDMI/Speakers) 3years",
    image: "../userfiles/products/Dell-27-Plus-S2725HSM.jpg",
    price: 175,
    quantity: 1,
  },
  {
    id: "dahua-ax30",
    name: "Dahua AX30 AX3000 Wireless Router (574Mbps@2.4 GHz, 2402Mbps@5 GHz)",
    image: "../userfiles/products/Dahua-AX30.jpg",
    price: 59,
    quantity: 1,
  },
  {
    id: "dell-se2426h",
    name: "Dell SE2426H 24-inch Monitor With FHD Display",
    image: "../userfiles/products/Dell-SE2426H.jpg",
    price: 109,
    quantity: 2,
  },
  {
    id: "sunmi-s2",
    name: "SUNMI S2 Smart POS Receipt Printer",
    image: "../userfiles/products/SUNMI-S2.jpg",
    price: 89,
    quantity: 1,
  },
];

let searchAbortController = null;

function getStoredAuthUser() {
  try {
    const raw = window.localStorage.getItem(window.RootITAuth.storageKey);
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

function getStoredInquiryItems() {
  try {
    const raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

function setStoredInquiryItems(items) {
  const safeItems = Array.isArray(items) ? items : [];

  try {
    window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(safeItems));
  } catch (error) {
    // Ignore demo storage errors in static mode.
  }

  window.dispatchEvent(
    new CustomEvent("rootit:inquiry-updated", {
      detail: { items: safeItems },
    }),
  );
}

window.RootITInquiry = window.RootITInquiry || {};
window.RootITInquiry.storageKey = INQUIRY_STORAGE_KEY;
window.RootITInquiry.getItems = getStoredInquiryItems;
window.RootITInquiry.setItems = setStoredInquiryItems;

function ensureInquiryItemsInitialized() {
  try {
    const existingRaw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (existingRaw !== null) {
      return getStoredInquiryItems();
    }
  } catch (error) {
    return DEFAULT_INQUIRY_ITEMS.map((item) => ({ ...item }));
  }

  const defaultItems = DEFAULT_INQUIRY_ITEMS.map((item) => ({ ...item }));
  setStoredInquiryItems(defaultItems);
  return defaultItems;
}

function getBootstrapApi(name) {
  if (!window.bootstrap || !window.bootstrap[name]) {
    return null;
  }

  return window.bootstrap[name];
}

function showElement(element, display = "block") {
  if (!element) {
    return;
  }

  element.hidden = false;
  element.style.display = display;
}

function openDropdownMenu(menu) {
  if (!menu) {
    return;
  }

  menu.hidden = false;
  menu.classList.add("show");
  menu.style.display = "block";
}

function closeDropdownMenu(menu) {
  if (!menu) {
    return;
  }

  menu.classList.remove("show");
  menu.style.display = "none";
  menu.hidden = true;
}

function closeHeaderDropdownMenus() {
  document.querySelectorAll(".dropdown-menu-list").forEach((menu) => {
    closeDropdownMenu(menu);
  });
}

function hideElement(element) {
  if (!element) {
    return;
  }

  element.style.display = "none";
  element.hidden = true;
}

function isVisible(element) {
  if (!element) {
    return false;
  }

  return window.getComputedStyle(element).display !== "none";
}

function hideSearchResults(scope = document) {
  scope.querySelectorAll(SEARCH_RESULT_SELECTOR).forEach((element) => {
    hideElement(element);
  });
}

function formatInquiryPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getInquiryTotal(items) {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
}

function resolveInquiryImagePath(path) {
  if (!path || /^(https?:|\/)/.test(path)) {
    return path || "";
  }

  if (window.location.pathname.includes("/components/")) {
    return path;
  }

  if (path.startsWith("../")) {
    return path.replace("../", "./");
  }

  return path;
}

function getInquiryItemCount(items) {
  return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function createInquiryPreviewItem(item) {
  const itemElement = document.createElement("div");
  itemElement.className = "inquiry-preview-item";

  const image = document.createElement("img");
  image.className = "inquiry-preview-image";
  image.src = resolveInquiryImagePath(item.image || "");
  image.alt = item.name || "Inquiry item";
  image.loading = "lazy";

  const copy = document.createElement("div");
  copy.className = "inquiry-preview-copy";

  const name = document.createElement("div");
  name.className = "inquiry-preview-name";
  name.textContent = item.name || "Unnamed item";

  const meta = document.createElement("div");
  meta.className = "inquiry-preview-meta";
  meta.innerHTML = `<span class="qty-label">Qty:</span> <span class="qty-value">${Number(
    item.quantity || 0,
  )}</span> <span class="price-value">${formatInquiryPrice(item.price)}</span>`;

  image.addEventListener("error", () => {
    image.classList.add("cart-image-fallback");
  });

  copy.append(name, meta);
  itemElement.append(image, copy);

  return itemElement;
}

function renderHeaderInquiryState(items = ensureInquiryItemsInitialized()) {
  const badge = document.getElementById("inquiryBadge");
  const mobileBadge = document.getElementById("mobileInquiryBadge");
  const wrapper = document.querySelector(".inquiry-items-wrapper");
  const totalElement = document.getElementById("inquirySummaryTotal");
  const total = getInquiryItemCount(items);

  if (badge) {
    badge.textContent = String(total);
    badge.style.display = total > 0 ? "flex" : "none";
  }

  if (mobileBadge) {
    mobileBadge.textContent = String(total);
    mobileBadge.style.display = total > 0 ? "flex" : "none";
  }

  if (!wrapper) {
    if (totalElement) {
      totalElement.textContent = formatInquiryPrice(getInquiryTotal(items));
    }
    return;
  }

  wrapper.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "inquiry-preview-empty";
    empty.textContent = "Inquiry list is empty";
    wrapper.append(empty);
    if (totalElement) {
      totalElement.textContent = "$0.00";
    }
    return;
  }

  items.slice(0, 4).forEach((item) => {
    wrapper.append(createInquiryPreviewItem(item));
  });

  if (totalElement) {
    totalElement.textContent = formatInquiryPrice(getInquiryTotal(items));
  }
}

window.RootITInquiry.renderHeaderState = renderHeaderInquiryState;

function openSearchPopup() {
  const searchBox = document.querySelector(SEARCH_POPUP_SELECTOR);
  if (!searchBox) {
    return;
  }

  showElement(searchBox);
  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    const firstInput = searchBox.querySelector(SEARCH_INPUT_SELECTOR);
    if (firstInput) {
      firstInput.focus();
    }
  }, 50);
}

function closeSearchPopup() {
  const searchBox = document.querySelector(SEARCH_POPUP_SELECTOR);
  if (!searchBox || !isVisible(searchBox)) {
    return;
  }

  hideElement(searchBox);
  hideSearchResults(searchBox);
  document.body.style.overflow = "";
}

function renderHeaderAuthState() {
  const loginLink = document.getElementById("loginTrigger");
  if (!loginLink) {
    return;
  }

  const userDropdown = loginLink.closest(".user-dropdown");
  const userMenu = document.getElementById("userDropdownMenu");
  const user = getStoredAuthUser();

  if (!userDropdown) {
    return;
  }

  if (!user) {
    loginLink.setAttribute("href", "/components/login.html");
    loginLink.setAttribute("aria-label", "Sign in to your account");
    loginLink.innerHTML = '<i class="fa-solid fa-user"></i> Sign In';
    loginLink.classList.remove("auth-user-link");
    userDropdown.classList.remove("is-authenticated");
    hideElement(userMenu);
    return;
  }

  loginLink.setAttribute("href", "/components/dashboard.html");
  loginLink.setAttribute("aria-label", "Open your dashboard");
  loginLink.classList.add("auth-user-link");
  userDropdown.classList.add("is-authenticated");
  loginLink.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${
    user.firstName || "Account"
  } <i class="fa-solid fa-chevron-down"></i>`;

  if (userMenu) {
    closeDropdownMenu(userMenu);
  }
}

function bindHeaderDropdownMenus() {
  if (document.body.dataset.rootitHeaderDropdownClicksBound !== "true") {
    document.body.dataset.rootitHeaderDropdownClicksBound = "true";

    document.addEventListener("click", (event) => {
      const userTrigger = event.target.closest("#loginTrigger");
      const clickedInsideMenu = event.target.closest(".dropdown-menu-list");

      if (userTrigger) {
        const userMenu = document.getElementById("userDropdownMenu");
        if (!userMenu || !userTrigger.closest(".user-dropdown")?.classList.contains("is-authenticated")) {
          return;
        }

        event.preventDefault();
        const shouldOpen = userMenu.hidden || !userMenu.classList.contains("show");
        closeHeaderDropdownMenus();
        if (shouldOpen) {
          openDropdownMenu(userMenu);
        }
        return;
      }

      if (!clickedInsideMenu) {
        closeHeaderDropdownMenus();
      }
    });
  }

  document.querySelectorAll(".user-dropdown, .inquiry-dropdown").forEach((wrapper) => {
    if (wrapper.dataset.rootitDropdownBound === "true") {
      return;
    }

    wrapper.dataset.rootitDropdownBound = "true";

    wrapper.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 1024) {
        return;
      }

      if (wrapper.classList.contains("user-dropdown") && !wrapper.classList.contains("is-authenticated")) {
        return;
      }

      const menu = wrapper.querySelector(".dropdown-menu-list");
      if (menu) {
        openDropdownMenu(menu);
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 1024) {
        return;
      }

      const menu = wrapper.querySelector(".dropdown-menu-list");
      if (menu) {
        closeDropdownMenu(menu);
      }
    });
  });
}

function bindDesktopDropdownHover() {
  const Dropdown = getBootstrapApi("Dropdown");
  if (!Dropdown) {
    return;
  }

  document.querySelectorAll("li.dropdown").forEach((item) => {
    if (item.dataset.rootitHoverBound === "true") {
      return;
    }

    const toggle = item.querySelector(".dropdown-toggle");
    if (!toggle) {
      return;
    }

    item.dataset.rootitHoverBound = "true";

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 768) {
        return;
      }

      Dropdown.getOrCreateInstance(toggle).show();
    });

    item.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 768) {
        return;
      }

      Dropdown.getOrCreateInstance(toggle).hide();
    });
  });
}

function bindSidebarMenuHover() {
  document.querySelectorAll(".sidebar_menu #menu > li").forEach((item) => {
    if (item.dataset.rootitSidebarBound === "true") {
      return;
    }

    item.dataset.rootitSidebarBound = "true";

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 1024) {
        return;
      }

      const subMenu = item.querySelector("ul");
      if (!subMenu) {
        return;
      }

      const rect = item.getBoundingClientRect();
      subMenu.style.top = `${rect.top}px`;
      subMenu.style.left = `${rect.right}px`;
      subMenu.style.display = "block";
    });

    item.addEventListener("mouseleave", () => {
      const subMenu = item.querySelector("ul");
      if (subMenu) {
        subMenu.style.display = "none";
      }
    });
  });
}

function closeMobileSideNav() {
  document.body.classList.remove("mobile-nav-open");

  document.querySelectorAll("[data-mobile-nav-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".mobile-side-nav").forEach((menu) => {
    menu.setAttribute("aria-hidden", "true");
  });

  document
    .querySelectorAll("[data-mobile-submenu-toggle].is-open")
    .forEach((toggle) => {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });

  document.querySelectorAll(".mobile-side-nav__submenu.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
  });
}

function openMobileSideNav() {
  document.body.classList.add("mobile-nav-open");

  document.querySelectorAll("[data-mobile-nav-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "true");
  });

  document.querySelectorAll(".mobile-side-nav").forEach((menu) => {
    menu.setAttribute("aria-hidden", "false");
  });
}

window.RootITMobileNav = window.RootITMobileNav || {};
window.RootITMobileNav.open = openMobileSideNav;
window.RootITMobileNav.close = closeMobileSideNav;

function bindMobileSideNav() {
  document.querySelectorAll("[data-mobile-nav-toggle]").forEach((button) => {
    if (button.dataset.rootitBound === "true") {
      return;
    }

    button.dataset.rootitBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (document.body.classList.contains("mobile-nav-open")) {
        closeMobileSideNav();
      } else {
        openMobileSideNav();
      }
    });
  });

  document.querySelectorAll("[data-mobile-nav-close]").forEach((button) => {
    if (button.dataset.rootitBound === "true") {
      return;
    }

    button.dataset.rootitBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMobileSideNav();
    });
  });

  document.querySelectorAll("[data-mobile-submenu-toggle]").forEach((button) => {
    if (button.dataset.rootitBound === "true") {
      return;
    }

    button.dataset.rootitBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const controlsId = button.getAttribute("aria-controls");
      const targetMenu = controlsId ? document.getElementById(controlsId) : null;
      const isOpen = button.classList.contains("is-open");

      button.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));

      if (targetMenu) {
        targetMenu.classList.toggle("is-open", !isOpen);
      }
    });
  });

  if (document.body.dataset.rootitMobileNavDocumentBound !== "true") {
    document.body.dataset.rootitMobileNavDocumentBound = "true";

    document.addEventListener(
      "click",
      (event) => {
        const closeTrigger = event.target.closest("[data-mobile-nav-close]");
        if (closeTrigger) {
          event.preventDefault();
          closeMobileSideNav();
        }
      },
      true,
    );

    document.addEventListener("click", (event) => {
      const sideNavLink = event.target.closest(".mobile-side-nav a");
      if (sideNavLink) {
        closeMobileSideNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileSideNav();
      }
    });
  }
}

function hideSidebarSubMenus() {
  document.querySelectorAll(".sidebar_menu #menu ul").forEach((element) => {
    element.style.display = "none";
  });
}

function syncStickyHeader() {
  const isSticky = window.scrollY >= 100;

  document.querySelectorAll(".header_wrapper").forEach((element) => {
    element.classList.toggle("sticky-active", isSticky);
  });

  document.querySelectorAll(".header_top").forEach((element) => {
    element.classList.toggle("header-hidden", isSticky);
  });
}

function initializePopovers() {
  const Popover = getBootstrapApi("Popover");
  if (!Popover) {
    return;
  }

  document.querySelectorAll(POPOVER_SELECTOR).forEach((element) => {
    if (!element.hasAttribute("data-bs-toggle")) {
      element.setAttribute("data-bs-toggle", "popover");
    }

    if (element.dataset.rootitPopoverBound === "true") {
      return;
    }

    Popover.getOrCreateInstance(element, {
      trigger: "hover focus",
      html: true,
      container: "body",
    });

    element.dataset.rootitPopoverBound = "true";
  });
}

function hideAllPopovers(eventTarget) {
  const Popover = getBootstrapApi("Popover");
  if (!Popover) {
    return;
  }

  document.querySelectorAll(POPOVER_SELECTOR).forEach((element) => {
    const instance = Popover.getInstance(element);
    if (!instance) {
      return;
    }

    const popoverId = element.getAttribute("aria-describedby");
    const popoverElement = popoverId ? document.getElementById(popoverId) : null;
    const clickedPopover = popoverElement && popoverElement.contains(eventTarget);

    if (element.contains(eventTarget) || clickedPopover) {
      return;
    }

    instance.hide();
  });
}

function initTogglePasswordButtons() {
  document.addEventListener("click", (event) => {
    const toggleButton = event.target.closest(".toggle-password");
    if (!toggleButton) {
      return;
    }

    const targetSelector = toggleButton.getAttribute("data-target");
    const input = targetSelector ? document.querySelector(targetSelector) : null;
    if (!input) {
      return;
    }

    const shouldShowPassword = input.getAttribute("type") === "password";
    input.setAttribute("type", shouldShowPassword ? "text" : "password");
    toggleButton.classList.toggle("fa-eye", !shouldShowPassword);
    toggleButton.classList.toggle("fa-eye-slash", shouldShowPassword);
  });
}

function initializeHeroSwiper() {
  const heroSwiper = document.querySelector(".mySwiper");
  if (!heroSwiper || heroSwiper.dataset.rootitSwiperReady === "true") {
    return;
  }

  const slideCount = heroSwiper.querySelectorAll(".swiper-slide").length;
  const randomStartIndex = slideCount > 0 ? Math.floor(Math.random() * slideCount) : 0;
  const enableLoop = slideCount > 1;

  new Swiper(heroSwiper, {
    initialSlide: randomStartIndex,
    loop: enableLoop,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
    autoplay: false,
    preloadImages: true,
    updateOnImagesReady: true,
    pagination: {
      el: heroSwiper.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: heroSwiper.querySelector(".swiper-button-next"),
      prevEl: heroSwiper.querySelector(".swiper-button-prev"),
    },
  });

  heroSwiper.dataset.rootitSwiperReady = "true";
}

function initializeProductDetailSwipers() {
  if (document.body.classList.contains("product-detail-page")) {
    return;
  }

  const thumbsElement = document.querySelector(".productThumbs");
  const productElement = document.querySelector(".productSwiper");

  if (!thumbsElement || !productElement || productElement.dataset.rootitSwiperReady === "true") {
    return;
  }

  const detailSlideCount = productElement.querySelectorAll(".swiper-slide").length;
  const enableLoop = detailSlideCount > 1;

  const swiperThumbs = new Swiper(thumbsElement, {
    spaceBetween: 10,
    slidesPerView: 4,
    loop: enableLoop,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      320: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
    },
  });

  new Swiper(productElement, {
    loop: enableLoop,
    autoHeight: true,
    spaceBetween: 10,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: document.querySelector(".swiper-button-next"),
      prevEl: document.querySelector(".swiper-button-prev"),
    },
    thumbs: {
      swiper: swiperThumbs,
    },
  });

  thumbsElement.dataset.rootitSwiperReady = "true";
  productElement.dataset.rootitSwiperReady = "true";
}

function initializeBrandSwiper() {
  const brandSwiper = document.querySelector(".brandSwiper");
  if (!brandSwiper || brandSwiper.dataset.rootitSwiperReady === "true") {
    return;
  }

  const slideCount = brandSwiper.querySelectorAll(".swiper-slide").length;
  const enableLoop = slideCount > 1;

  new Swiper(brandSwiper, {
    slidesPerView: 8,
    spaceBetween: 20,
    loop: enableLoop,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: { slidesPerView: 3, spaceBetween: 10 },
      768: { slidesPerView: 5, spaceBetween: 15 },
      1200: { slidesPerView: 7, spaceBetween: 20 },
      1400: { slidesPerView: 8, spaceBetween: 20 },
    },
  });

  brandSwiper.dataset.rootitSwiperReady = "true";
}

function initializeProductSliders() {
  document.querySelectorAll(".productSlider").forEach((slider) => {
    if (slider.dataset.rootitSwiperReady === "true") {
      return;
    }

    const wrapper = slider.closest(".product_wrapper");
    const nextEl = wrapper ? wrapper.querySelector(".swiper-button-next") : null;
    const prevEl = wrapper ? wrapper.querySelector(".swiper-button-prev") : null;
    const slideCount = slider.querySelectorAll(".swiper-slide").length;
    const enableLoop = slideCount > 1;

    new Swiper(slider, {
      slidesPerView: 2,
      spaceBetween: 10,
      grabCursor: true,
      loop: enableLoop,
      loopAdditionalSlides: enableLoop ? 2 : 0,
      navigation: {
        nextEl,
        prevEl,
      },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 4, spaceBetween: 15 },
        1366: { slidesPerView: 5, spaceBetween: 20 },
        1920: { slidesPerView: 6, spaceBetween: 20 },
      },
    });

    slider.dataset.rootitSwiperReady = "true";
  });
}

function performSearch(input) {
  const container = input.closest(SEARCH_CONTAINER_SELECTOR);
  const resultBox = container ? container.querySelector(SEARCH_RESULT_SELECTOR) : null;
  const query = input.value.trim();

  if (!resultBox) {
    return;
  }

  if (searchAbortController) {
    searchAbortController.abort();
  }

  if (query.length <= 1) {
    hideElement(resultBox);
    return;
  }

  searchAbortController = new AbortController();

  fetch("/ajax-search.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: new URLSearchParams({ query }).toString(),
    signal: searchAbortController.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search request failed with status ${response.status}`);
      }

      return response.text();
    })
    .then((html) => {
      resultBox.innerHTML = html;
      showElement(resultBox);
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });
}

function handleProfileFormSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : "";
  const formData = new FormData(form);

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";
  }

  fetch("profile_action.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((responseText) => {
      const parts = responseText.trim().split("|");
      const status = parts[0];
      const message = parts[1] || "Unexpected response.";

      if (status === "success") {
        window.alert(message);
        window.location.reload();
        return;
      }

      window.alert(message);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    })
    .catch(() => {
      window.alert("Connection Error!");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
}

function bindGlobalEvents() {
  if (document.body.dataset.rootitEventsBound === "true") {
    return;
  }

  document.body.dataset.rootitEventsBound = "true";

  document.addEventListener("click", (event) => {
    const logoutTrigger = event.target.closest("#logoutTrigger");
    if (logoutTrigger) {
      event.preventDefault();
      setStoredAuthUser(null);
      renderHeaderAuthState();

      if (
        window.location.pathname.includes("/components/login.html") ||
        window.location.pathname.includes("/components/register.html") ||
        window.location.pathname.includes("/components/dashboard.html")
      ) {
        window.location.href = "/components/login.html";
      }

      return;
    }

    const searchOpenTrigger = event.target.closest(".search-toggle-btn");
    if (searchOpenTrigger) {
      event.preventDefault();
      openSearchPopup();
      return;
    }

    const searchCloseTrigger = event.target.closest(".close-search-btn");
    if (searchCloseTrigger) {
      event.preventDefault();
      closeSearchPopup();
      return;
    }

    if (!event.target.closest(SEARCH_CONTAINER_SELECTOR)) {
      hideSearchResults();
    }

    hideAllPopovers(event.target);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearchPopup();
    }
  });

  document.addEventListener("input", (event) => {
    const input = event.target.closest(SEARCH_INPUT_SELECTOR);
    if (!input) {
      return;
    }

    performSearch(input);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const matchesProfileForm = PROFILE_FORM_SELECTORS.some((selector) => form.matches(selector));
    if (!matchesProfileForm) {
      return;
    }

    event.preventDefault();
    handleProfileFormSubmit(form);
  });
}

function bindSharedLayoutBehavior() {
  bindSidebarMenuHover();
  bindDesktopDropdownHover();
  bindHeaderDropdownMenus();
  bindMobileSideNav();
  syncStickyHeader();
}

function initIndexPage() {
  if (typeof window.RootITPage.renderIndexProductSections === "function") {
    window.RootITPage.renderIndexProductSections();
  }

  initializeHeroSwiper();
  initializeProductDetailSwipers();
  initializeBrandSwiper();
  initializeProductSliders();
  initializePopovers();
}

function initializePage() {
  bindGlobalEvents();
  bindSharedLayoutBehavior();
  renderHeaderAuthState();
  renderHeaderInquiryState(ensureInquiryItemsInitialized());
  initIndexPage();

  if (
    window.RootITPartials &&
    typeof window.RootITPartials.rewriteLocalSiteUrls === "function"
  ) {
    window.RootITPartials.rewriteLocalSiteUrls(document.body);
  }
}

initTogglePasswordButtons();
window.addEventListener("scroll", syncStickyHeader, { passive: true });
window.addEventListener("scroll", hideSidebarSubMenus, { passive: true });

document.addEventListener("DOMContentLoaded", initializePage);
document.addEventListener("partials:loaded", initializePage);
window.addEventListener("rootit:inquiry-updated", (event) => {
  renderHeaderInquiryState(event.detail?.items || getStoredInquiryItems());
});
