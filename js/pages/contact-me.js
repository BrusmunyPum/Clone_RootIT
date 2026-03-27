(function () {
  function bindMapToggle() {
    var toggle = document.getElementById("mapToggle");
    var container = document.getElementById("mapContainer");
    var text = document.getElementById("mapToggleText");
    var icon = document.getElementById("mapToggleIcon");

    if (!toggle || !container || !text || !icon) {
      return;
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      var isHidden = container.style.display === "none";
      container.style.display = isHidden ? "block" : "none";
      text.textContent = isHidden ? "Hide Map" : "Show Map";
      icon.className = isHidden ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down";
    });
  }

  function bindContactForm() {
    var form = document.getElementById("contactForm");
    var alert = document.getElementById("contactAlert");
    var captcha = document.getElementById("captchaCheck");

    if (!form || !alert || !captcha) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!captcha.checked) {
        alert.style.display = "block";
        alert.textContent = "Please confirm the demo captcha checkbox before sending your message.";
        return;
      }

      alert.style.display = "block";
      alert.textContent =
        "Your demo contact message has been submitted successfully. Connect this form to your backend later.";
      form.reset();
      captcha.checked = false;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindMapToggle();
    bindContactForm();
  });
})();
