// settings.js
document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkMode");

  darkToggle.checked = localStorage.getItem("darkMode") === "true";

  darkToggle.addEventListener("change", () => {
    localStorage.setItem("darkMode", darkToggle.checked);
    document.body.classList.toggle("dark", darkToggle.checked);
  });
});
