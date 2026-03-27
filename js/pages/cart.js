(function () {
  // Demo-only inquiry list: this resets on every refresh until real backend data exists.
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

  function formatPrice(value) {
    return "$" + Number(value).toFixed(2);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cloneItems() {
    return DEFAULT_ITEMS.map(function (item) {
      return Object.assign({}, item);
    });
  }

  // Keep cart state in memory only so refresh returns to the original 4 demo products.
  let items = cloneItems();

  function updateHeaderPreview() {
    const badge = document.getElementById("inquiryBadge");
    const wrapper = document.querySelector(".inquiry-items-wrapper");

    if (badge) {
      const total = items.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0);

      badge.textContent = total;
      badge.style.display = total > 0 ? "flex" : "none";
    }

    if (wrapper) {
      if (!items.length) {
        wrapper.innerHTML =
          '<p style="text-align: center; color: #999; padding: 30px 10px; margin: 0; font-size: 13px;">Inquiry list is empty</p>';
        return;
      }

      wrapper.innerHTML = items
        .slice(0, 4)
        .map(function (item) {
          return (
            '<div style="display:flex; gap:10px; padding:12px 15px; border-bottom:1px solid #f1f5f9;">' +
            '<img src="' +
            escapeHtml(item.image) +
            '" alt="' +
            escapeHtml(item.name) +
            '" style="width:52px; height:52px; object-fit:contain; border:1px solid #edf2f7; border-radius:3px; padding:4px; background:#fff;" onerror="this.onerror=null;this.style.visibility=\'hidden\';">' +
            "<div style=\"min-width:0;\">" +
            '<div style="font-size:13px; line-height:1.45; color:#3C4643;">' +
            escapeHtml(item.name) +
            "</div>" +
            '<div style="margin-top:4px; color:#64748b; font-size:12px;">Qty: ' +
            item.quantity +
            " | " +
            formatPrice(item.price) +
            "</div>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  function renderCart() {
    const body = document.getElementById("cart-table-body");
    const content = document.getElementById("cart-content");
    const empty = document.getElementById("cart-empty-state");
    const summarySubtotal = document.getElementById("summary-subtotal-price");
    const summaryTotal = document.getElementById("summary-total-price");

    if (!body || !content || !empty) {
      return;
    }

    if (!items.length) {
      content.style.display = "none";
      empty.classList.add("is-visible");
      updateHeaderPreview();
      return;
    }

    content.style.display = "block";
    empty.classList.remove("is-visible");

    body.innerHTML = items
      .map(function (item) {
        return (
          '<tr data-item-id="' +
          escapeHtml(item.id) +
          '">' +
          "<td>" +
          '<div class="cart-product">' +
          '<a href="' +
          escapeHtml(item.href) +
          '">' +
          '<img src="' +
          escapeHtml(item.image) +
          '" alt="' +
          escapeHtml(item.name) +
          '" loading="lazy" onerror="this.onerror=null;this.style.visibility=\'hidden\';">' +
          "</a>" +
          "<div>" +
          '<h3 class="cart-product-title"><a href="' +
          escapeHtml(item.href) +
          '">' +
          escapeHtml(item.name) +
          "</a></h3>" +
          '<div class="cart-product-meta">SKU: ' +
          escapeHtml(item.sku) +
          "</div>" +
          "</div>" +
          "</div>" +
          "</td>" +
          '<td><span class="cart-price">' +
          formatPrice(item.price) +
          "</span></td>" +
          '<td><input class="cart-qty" type="text" value="' +
          escapeHtml(item.quantity) +
          '" readonly aria-label="Quantity for ' +
          escapeHtml(item.name) +
          '"></td>' +
          '<td><span class="cart-line-total">' +
          formatPrice(item.price * item.quantity) +
          "</span></td>" +
          '<td><button type="button" class="cart-remove-btn" data-remove-id="' +
          escapeHtml(item.id) +
          '" aria-label="Remove ' +
          escapeHtml(item.name) +
          '"><i class="fa-solid fa-trash-can"></i></button></td>' +
          "</tr>"
        );
      })
      .join("");

    const totalPrice = items.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);

    if (summarySubtotal) {
      summarySubtotal.textContent = formatPrice(totalPrice);
    }
    if (summaryTotal) {
      summaryTotal.textContent = formatPrice(totalPrice);
    }

    updateHeaderPreview();
  }

  function removeItem(itemId) {
    items = items.filter(function (item) {
      return item.id !== itemId;
    });
    renderCart();
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest("[data-remove-id]");
      if (!button) {
        return;
      }

      removeItem(button.getAttribute("data-remove-id"));
    });

    document.addEventListener("partials:loaded", function () {
      updateHeaderPreview();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    renderCart();
    window.setTimeout(updateHeaderPreview, 150);
  });

  window.addEventListener("load", updateHeaderPreview);
})();
