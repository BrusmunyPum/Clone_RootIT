(function () {
  const state = {
    eventsBound: false,
  };

  function getElements() {
    return {
      form: document.getElementById("contactForm"),
      alert: document.getElementById("contactAlert"),
      captcha: document.getElementById("captchaCheck"),
      toggle: document.getElementById("mapToggle"),
      container: document.getElementById("mapContainer"),
      text: document.getElementById("mapToggleText"),
      icon: document.getElementById("mapToggleIcon"),
      subject: document.getElementById("contactSubject"),
    };
  }

  function readQueryValue(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key) || "";
  }

  function showAlert(message, type) {
    const { alert } = getElements();
    if (!alert) {
      return;
    }

    alert.textContent = message;
    alert.classList.add("is-visible");
    alert.classList.toggle("is-error", type === "error");
  }

  function hideAlert() {
    const { alert } = getElements();
    if (!alert) {
      return;
    }

    alert.textContent = "";
    alert.classList.remove("is-visible", "is-error");
  }

  function setMapState(isVisible) {
    const { toggle, container, text, icon } = getElements();
    if (!toggle || !container || !text || !icon) {
      return;
    }

    container.hidden = !isVisible;
    toggle.setAttribute("aria-expanded", String(isVisible));
    text.textContent = isVisible ? "Hide Map" : "Show Map";
    icon.className = isVisible
      ? "fa-solid fa-chevron-up"
      : "fa-solid fa-chevron-down";
  }

  function buildContactPayload(form) {
    const formData = new FormData(form);

    return {
      title: String(formData.get("contactTitle") || "").trim(),
      fullName: String(formData.get("contactName") || "").trim(),
      email: String(formData.get("contactEmail") || "").trim(),
      phone: String(formData.get("contactPhone") || "").trim(),
      country: String(formData.get("contactCountry") || "").trim(),
      subject: String(formData.get("contactSubject") || "").trim(),
      message: String(formData.get("contactMessage") || "").trim(),
    };
  }

  async function submitContactMessage(payload) {
    // This isolated async boundary is intentionally easy to replace with a
    // FastAPI endpoint later.
    return {
      ok: true,
      message:
        "Your demo contact message has been submitted successfully. Connect this form to your backend later.",
      payload,
    };
  }

  async function handleContactFormSubmit(event) {
    const { form, captcha } = getElements();
    if (!form || !captcha) {
      return;
    }

    event.preventDefault();
    hideAlert();

    if (!captcha.checked) {
      showAlert(
        "Please confirm the demo captcha checkbox before sending your message.",
        "error",
      );
      return;
    }

    const payload = buildContactPayload(form);
    const result = await submitContactMessage(payload);

    if (!result.ok) {
      showAlert(result.message, "error");
      return;
    }

    showAlert(result.message, "success");
    form.reset();
    captcha.checked = false;
  }

  function bindEvents() {
    if (state.eventsBound) {
      return;
    }

    state.eventsBound = true;

    document.addEventListener("click", (event) => {
      const { toggle, container } = getElements();
      const clickedToggle = event.target.closest("#mapToggle");

      if (!clickedToggle || !toggle || !container) {
        return;
      }

      setMapState(container.hidden);
    });

    document.addEventListener("submit", (event) => {
      if (event.target.id !== "contactForm") {
        return;
      }

      handleContactFormSubmit(event);
    });
  }

  function initializeContactPage() {
    bindEvents();
    const { subject } = getElements();
    const subjectFromQuery = readQueryValue("subject");
    if (subject && subjectFromQuery && !subject.value) {
      subject.value = subjectFromQuery;
    }
    setMapState(true);
    hideAlert();
  }

  document.addEventListener("DOMContentLoaded", initializeContactPage);
})();
