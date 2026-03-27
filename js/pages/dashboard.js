(function () {
  var addressStorageKey = "rootit_demo_addresses";

  function getUser() {
    return window.RootITAuth && window.RootITAuth.getUser ? window.RootITAuth.getUser() : null;
  }

  function setUser(user) {
    if (window.RootITAuth && window.RootITAuth.setUser) {
      window.RootITAuth.setUser(user);
    }
  }

  function getAddresses() {
    try {
      var raw = window.localStorage.getItem(addressStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function setAddresses(addresses) {
    try {
      window.localStorage.setItem(addressStorageKey, JSON.stringify(addresses));
    } catch (error) {
      // Ignore static demo storage issues.
    }
  }

  function requireAuth() {
    var user = getUser();
    if (!user) {
      window.location.href = "/components/login.html";
      return null;
    }
    return user;
  }

  function activatePanel(panelId) {
    document.querySelectorAll("[data-dashboard-nav]").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-dashboard-nav") === panelId);
    });

    document.querySelectorAll("[data-dashboard-panel]").forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-dashboard-panel") === panelId);
    });
  }

  function fillProfile(user) {
    var firstName = document.getElementById("dashboard-first-name");
    var lastName = document.getElementById("dashboard-last-name");
    var email = document.getElementById("dashboard-email");
    var phone = document.getElementById("dashboard-phone");
    var avatar = document.getElementById("dashboardAvatar");
    var welcomeText = document.getElementById("dashboardWelcomeText");

    if (firstName) firstName.value = user.firstName || "";
    if (lastName) lastName.value = user.lastName || "";
    if (email) email.value = user.email || "";
    if (phone) phone.value = user.phone || "";
    if (avatar) {
      avatar.textContent = ((user.firstName || "U").charAt(0) || "U").toUpperCase();
    }
    if (welcomeText) {
      var fullName = [user.firstName || "", user.lastName || ""].join(" ").trim() || "your account";
      welcomeText.textContent =
        "Welcome back, " +
        fullName +
        ". Keep your profile updated so our team can respond faster to your inquiries.";
    }
  }

  function showProfileAlert(message) {
    var alert = document.getElementById("profileAlert");
    if (!alert) {
      return;
    }

    alert.style.display = "block";
    alert.textContent = message;
  }

  function renderAddresses() {
    var list = document.getElementById("addressList");
    var emptyState = document.getElementById("addressEmptyState");
    var addressCount = document.getElementById("dashboardAddressCount");
    if (!list || !emptyState) {
      return;
    }

    var addresses = getAddresses();
    list.innerHTML = "";
    if (addressCount) {
      addressCount.textContent = addresses.length + (addresses.length === 1 ? " address" : " addresses");
    }

    if (!addresses.length) {
      list.style.display = "none";
      emptyState.style.display = "flex";
      return;
    }

    emptyState.style.display = "none";
    list.style.display = "grid";

    addresses.forEach(function (address) {
      var card = document.createElement("article");
      card.className = "dashboard-address-card";
      card.innerHTML =
        "<h3>" +
        address.label +
        "</h3><p>" +
        address.phone +
        "<br>" +
        address.line.replace(/\n/g, "<br>") +
        "</p>";
      list.appendChild(card);
    });
  }

  function bindProfileForm() {
    var form = document.getElementById("dashboardProfileForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var user = getUser();
      if (!user) {
        return;
      }

      user.firstName = document.getElementById("dashboard-first-name").value.trim();
      user.lastName = document.getElementById("dashboard-last-name").value.trim();
      user.phone = document.getElementById("dashboard-phone").value.trim();
      setUser(user);
      fillProfile(user);
      showProfileAlert("Profile updated locally in this browser.");
    });
  }

  function bindNavigation() {
    document.querySelectorAll("[data-dashboard-nav]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var panelId = link.getAttribute("data-dashboard-nav");
        activatePanel(panelId);
        window.location.hash = panelId;
      });
    });
  }

  function bindAddressModal() {
    var modal = document.getElementById("addressModal");
    var openBtn = document.getElementById("openAddressModal");
    var closeBtn = document.getElementById("closeAddressModal");
    var form = document.getElementById("addressForm");

    if (!modal || !openBtn || !closeBtn || !form) {
      return;
    }

    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      form.reset();
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var addresses = getAddresses();
      addresses.push({
        label: document.getElementById("address-label").value.trim(),
        phone: document.getElementById("address-phone").value.trim(),
        line: document.getElementById("address-line").value.trim(),
      });
      setAddresses(addresses);
      renderAddresses();
      closeModal();
    });
  }

  function bindLogout() {
    var logout = document.getElementById("dashboardLogout");
    if (!logout) {
      return;
    }

    logout.addEventListener("click", function (event) {
      event.preventDefault();
      setUser(null);
      window.location.href = "/components/login.html";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var user = requireAuth();
    if (!user) {
      return;
    }

    fillProfile(user);
    renderAddresses();
    bindProfileForm();
    bindNavigation();
    bindAddressModal();
    bindLogout();

    var panelFromHash = window.location.hash.replace("#", "") || "profile";
    activatePanel(panelFromHash);
  });
})();
