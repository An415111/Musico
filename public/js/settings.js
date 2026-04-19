document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkMode");

  const isDark = localStorage.getItem("theme") === "dark";
  darkToggle.checked = isDark;
  document.body.classList.toggle("dark-mode", isDark);

  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
});