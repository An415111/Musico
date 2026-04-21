document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkMode");

  if (!darkToggle) return;

  // ✅ Load saved preference using correct key "darkMode"
  const isDark = localStorage.getItem("darkMode") === "true";
  darkToggle.checked = isDark;
  document.body.classList.toggle("dark", isDark); // ✅ correct class "dark"

  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark");           // ✅ correct class
      localStorage.setItem("darkMode", "true");      // ✅ correct key
    } else {
      document.body.classList.remove("dark");        // ✅ correct class
      localStorage.setItem("darkMode", "false");     // ✅ correct key
    }
  });
});