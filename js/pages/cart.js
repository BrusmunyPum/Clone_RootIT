(function () {
  const DEFAULT_ITEMS = [
    {
      id: "dell-s2725hsm",
      name: "Dell 27 Plus S2725HSM Monitor With IPS (1920 x 1080 at 144Hz, 2xHDMI/Speakers) 3years",
      href: "./product-detail.html",
      image: "../userfiles/products/Dell-27-Plus-S2725HSM.jpg",
      price: 175,
      quantity: 1,
      sku: "S2725HSM",
    },
    {
      id: "dahua-ax30",
      name: "Dahua AX30 AX3000 Wireless Router (574Mbps@2.4 GHz, 2402Mbps@5 GHz)",
      href: "./product-detail.html",
      image: "../userfiles/products/Dahua-AX30.jpg",
      price: 59,
      quantity: 1,
      sku: "AX30",
    },
    {
      id: "dell-se2426h",
      name: "Dell SE2426H 24-inch Monitor With FHD Display",
      href: "./product-detail.html",
      image: "../userfiles/products/Dell-SE2426H.jpg",
      price: 109,
      quantity: 2,
      sku: "SE2426H",
    },
    {
      id: "sunmi-s2",
      name: "SUNMI S2 Smart POS Receipt Printer",
      href: "./product-detail.html",
      image: "../userfiles/products/SUNMI-S2.jpg",
      price: 89,
      quantity: 1,
      sku: "SUNMI-S2",
    },
  ];

  const state = {
    items: [],
    eventsBound: false,
  };
  const STORAGE_KEY =
    (window.RootITInquiry && window.RootITInquiry.storageKey) ||
    "rootit_demo_inquiry_items";

  function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
  }

  function cloneItems() {
    return DEFAULT_ITEMS.map((item) => ({ ...item }));
  }

  async function loadCartItems() {
    // Keep the data loader isolated so it can later be replaced with a real
    // API call from FastAPI without touching the rendering layer.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          return items;
        }
      }
    } catch (error) {
      // Ignore demo storage errors in static mode.
    }

    try {
      const fallbackItems =
        window.RootITInquiry && typeof window.RootITInquiry.getItems === "function"
          ? window.RootITInquiry.getItems()
          : null;
      if (Array.isArray(fallbackItems)) {
        return fallbackItems;
      }
    } catch (error) {
      // Ignore cross-page storage helpers when unavailable.
    }

    return cloneItems();
  }

  function getItemCount(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalPrice(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function clampQuantity(value) {
    const quantity = Number(value);
    if (!Number.isFinite(quantity)) {
      return 1;
    }

    return Math.max(1, Math.floor(quantity));
  }

  function handleImageError(event) {
    event.currentTarget.classList.add("cart-image-fallback");
  }

  function createElement(tagName, options) {
    const element = document.createElement(tagName);

    if (!options) {
      return element;
    }

    if (options.className) {
      element.className = options.className;
    }

    if (options.text) {
      element.textContent = options.text;
    }

    if (options.html) {
      element.innerHTML = options.html;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          element.setAttribute(key, value);
        }
      });
    }

    return element;
  }

  function createPreviewItem(item) {
    const itemElement = createElement("div", {
      className: "inquiry-preview-item",
    });
    const image = createElement("img", {
      className: "inquiry-preview-image",
      attributes: {
        src: item.image,
        alt: item.name,
        loading: "lazy",
      },
    });
    const copy = createElement("div", {
      className: "inquiry-preview-copy",
    });
    const name = createElement("div", {
      className: "inquiry-preview-name",
      text: item.name,
    });
    const meta = createElement("div", {
      className: "inquiry-preview-meta",
      text: `Qty: ${item.quantity} | ${formatPrice(item.price)}`,
    });

    image.addEventListener("error", handleImageError);
    copy.append(name, meta);
    itemElement.append(image, copy);

    return itemElement;
  }

  function renderHeaderPreview(items) {
    if (window.RootITInquiry && typeof window.RootITInquiry.renderHeaderState === "function") {
      window.RootITInquiry.renderHeaderState(items);
      return;
    }

    const badge = document.getElementById("inquiryBadge");
    const wrapper = document.querySelector(".inquiry-items-wrapper");

    if (badge) {
      const total = getItemCount(items);
      badge.textContent = String(total);
      badge.style.display = total > 0 ? "flex" : "none";
    }

    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = "";

    if (!items.length) {
      wrapper.append(
        createElement("p", {
          className: "inquiry-preview-empty",
          text: "Inquiry list is empty",
        }),
      );
      return;
    }

    items.slice(0, 4).forEach((item) => {
      wrapper.append(createPreviewItem(item));
    });
  }

  function persistInquiryItems(items) {
    if (window.RootITInquiry && typeof window.RootITInquiry.setItems === "function") {
      window.RootITInquiry.setItems(items);
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // Ignore demo storage errors in static mode.
    }
  }

  function createCartRow(item) {
    const row = createElement("tr", {
      attributes: {
        "data-item-id": item.id,
      },
    });

    const productCell = createElement("td");
    const productWrapper = createElement("div", {
      className: "cart-product",
    });
    const productLink = createElement("a", {
      attributes: {
        href: item.href,
      },
    });
    const productImage = createElement("img", {
      attributes: {
        src: item.image,
        alt: item.name,
        loading: "lazy",
      },
    });
    const productCopy = createElement("div");
    const productTitle = createElement("h3", {
      className: "cart-product-title",
    });
    const productTitleLink = createElement("a", {
      text: item.name,
      attributes: {
        href: item.href,
      },
    });
    const productMeta = createElement("div", {
      className: "cart-product-meta",
      text: item.sku ? `SKU: ${item.sku}` : "",
    });

    productImage.addEventListener("error", handleImageError);
    productLink.append(productImage);
    productTitle.append(productTitleLink);
    productCopy.append(productTitle, productMeta);
    productWrapper.append(productLink, productCopy);
    productCell.append(productWrapper);

    const priceCell = createElement("td");
    priceCell.append(
      createElement("span", {
        className: "cart-price",
        text: formatPrice(item.price),
      }),
    );

    const quantityCell = createElement("td");
    const quantityControl = createElement("div", {
      className: "cart-qty-control",
    });
    const decreaseButton = createElement("button", {
      className: "cart-qty-btn",
      html: '<i class="fa-solid fa-minus"></i>',
      attributes: {
        type: "button",
        "data-qty-action": "decrease",
        "data-item-id": item.id,
        "aria-label": `Decrease quantity for ${item.name}`,
      },
    });
    const quantityInput = createElement("input", {
      className: "cart-qty",
      attributes: {
        type: "text",
        value: String(item.quantity),
        readonly: "readonly",
        "aria-label": `Quantity for ${item.name}`,
      },
    });
    const increaseButton = createElement("button", {
      className: "cart-qty-btn",
      html: '<i class="fa-solid fa-plus"></i>',
      attributes: {
        type: "button",
        "data-qty-action": "increase",
        "data-item-id": item.id,
        "aria-label": `Increase quantity for ${item.name}`,
      },
    });
    quantityControl.append(decreaseButton, quantityInput, increaseButton);
    quantityCell.append(quantityControl);

    const totalCell = createElement("td");
    totalCell.append(
      createElement("span", {
        className: "cart-line-total",
        text: formatPrice(item.price * item.quantity),
      }),
    );

    const actionCell = createElement("td");
    const removeButton = createElement("button", {
      className: "cart-remove-btn",
      html: '<i class="fa-solid fa-trash-can"></i>',
      attributes: {
        type: "button",
        "data-remove-id": item.id,
        "aria-label": `Remove ${item.name}`,
      },
    });
    actionCell.append(removeButton);

    row.append(productCell, priceCell, quantityCell, totalCell, actionCell);

    return row;
  }

  function renderCartTable(items) {
    const tableBody = document.getElementById("cart-table-body");
    if (!tableBody) {
      return;
    }

    tableBody.innerHTML = "";
    items.forEach((item) => {
      tableBody.append(createCartRow(item));
    });
  }

  function renderCartSummary(items) {
    const subtotal = document.getElementById("summary-subtotal-price");
    const total = document.getElementById("summary-total-price");
    const amount = formatPrice(getTotalPrice(items));

    if (subtotal) {
      subtotal.textContent = amount;
    }

    if (total) {
      total.textContent = amount;
    }
  }

  function renderCartState(items) {
    const content = document.getElementById("cart-content");
    const emptyState = document.getElementById("cart-empty-state");

    if (!content || !emptyState) {
      return;
    }

    const hasItems = items.length > 0;
    content.style.display = hasItems ? "block" : "none";
    emptyState.classList.toggle("is-visible", !hasItems);
  }

  function renderCartPage() {
    renderCartState(state.items);

    if (state.items.length) {
      renderCartTable(state.items);
      renderCartSummary(state.items);
    }

    persistInquiryItems(state.items);
    renderHeaderPreview(state.items);
  }

  function removeItem(itemId) {
    state.items = state.items.filter((item) => item.id !== itemId);
    renderCartPage();
  }

  function updateItemQuantity(itemId, delta) {
    state.items = state.items
      .map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const nextQuantity = item.quantity + delta;
        if (nextQuantity <= 0) {
          return null;
        }

        return {
          ...item,
          quantity: clampQuantity(nextQuantity),
        };
      })
      .filter(Boolean);

    renderCartPage();
  }

  function bindEvents() {
    if (state.eventsBound) {
      return;
    }

    state.eventsBound = true;

    document.addEventListener("click", (event) => {
      const quantityButton = event.target.closest("[data-qty-action]");
      if (quantityButton) {
        const action = quantityButton.getAttribute("data-qty-action");
        const itemId = quantityButton.getAttribute("data-item-id");
        updateItemQuantity(itemId, action === "decrease" ? -1 : 1);
        return;
      }

      const button = event.target.closest("[data-remove-id]");
      if (!button) {
        return;
      }

      removeItem(button.getAttribute("data-remove-id"));
    });

    document.addEventListener("partials:loaded", () => {
      renderHeaderPreview(state.items);
    });
  }

  async function initializeCartPage() {
    bindEvents();
    state.items = await loadCartItems();
    renderCartPage();
    window.setTimeout(() => renderHeaderPreview(state.items), 150);
  }

  document.addEventListener("DOMContentLoaded", initializeCartPage);
  window.addEventListener("load", () => renderHeaderPreview(state.items));
})();
