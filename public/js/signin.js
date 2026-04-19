document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signin-form");

  if (!signinForm) return;

  signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      // ❗ IMPORTANT: NO res.json() HERE

      if (res.redirected) {
        // ✅ backend already set cookie
        window.location.href = res.url;
      } else {
        const data = await res.json();
        alert(data.msg || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again later.");
    }
  });

  // 🔐 Toggle password
  const toggleBtn = document.getElementById("toggleSignInPassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const pass = document.getElementById("signinPassword");
      pass.type = pass.type === "password" ? "text" : "password";
    });
  }
});