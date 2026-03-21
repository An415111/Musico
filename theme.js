document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark-mode", isDark);

  const toggle =
    document.getElementById("darkMode") ||
    document.getElementById("themeSwitch");

  if (toggle) {
    toggle.checked = isDark;

    toggle.addEventListener("change", () => {
      const enabled = toggle.checked;
      localStorage.setItem("darkMode", enabled);
      document.body.classList.toggle("dark", enabled);
      document.body.classList.toggle("dark-mode", enabled);
    });
  }
});

