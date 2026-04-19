// Apply saved dark mode on every page load
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}