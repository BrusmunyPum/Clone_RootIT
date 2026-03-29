(function () {
  function getDemoUser() {
    return (window.RootITAuth && window.RootITAuth.demoUser) || null;
  }

  function showFormAlert(form, message, isSuccess) {
    var alert = form.querySelector(".auth-alert");
    if (!alert) {
      return;
    }

    alert.style.display = "block";
    alert.textContent = message;
    alert.style.background = isSuccess ? "#eefaf1" : "#fff4f4";
    alert.style.borderColor = isSuccess ? "#cfe8d5" : "#f0caca";
    alert.style.color = isSuccess ? "#166534" : "#b42318";
  }

  function bindPasswordToggles(scope) {
    var buttons = (scope || document).querySelectorAll("[data-password-toggle]");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var input = document.getElementById(button.getAttribute("data-password-toggle"));
        if (!input) {
          return;
        }

        var isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");

        var icon = button.querySelector("i");
        if (icon) {
          icon.className = isPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
        }
      });
    });
  }

  function bindAuthForms() {
    var forms = document.querySelectorAll("[data-auth-form]");

    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var mode = form.getAttribute("data-auth-form");
        var demoUser = getDemoUser();

        if (mode === "login" && demoUser) {
          var email = (form.querySelector("#login-email") || {}).value || "";
          var password = (form.querySelector("#login-password") || {}).value || "";

          if (
            email.trim().toLowerCase() === demoUser.email.toLowerCase() &&
            password === demoUser.password
          ) {
            window.RootITAuth.setUser({
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
              email: demoUser.email,
            });
            showFormAlert(
              form,
              "Login successful. You are now signed in with the demo account.",
              true,
            );

            setTimeout(function () {
              window.location.href = "./dashboard.html";
            }, 900);
            return;
          }

          showFormAlert(
            form,
            "Demo login failed. Use the static account shown below the form header.",
            false,
          );
          return;
        }

        if (mode === "register") {
          var firstName = (form.querySelector("#register-first-name") || {}).value || "New";
          var lastName = (form.querySelector("#register-last-name") || {}).value || "User";
          var emailAddress = (form.querySelector("#register-email") || {}).value || "";

          window.RootITAuth.setUser({
            firstName: firstName.trim() || "New",
            lastName: lastName.trim() || "User",
            email: emailAddress.trim(),
          });

          showFormAlert(
            form,
            "Registration demo submitted successfully. You are now signed in locally in this browser.",
            true,
          );

          setTimeout(function () {
            window.location.href = "./dashboard.html";
          }, 900);
          return;
        }

        showFormAlert(form, form.getAttribute("data-auth-message") || "Demo form submitted.", true);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindPasswordToggles(document);
    bindAuthForms();
  });
})();
