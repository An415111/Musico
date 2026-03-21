document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signin-form");

  signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value.trim();

    console.log("[signin] submit clicked →", { email });

    try {
      console.log("[signin] sending request to backend...");
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[signin] fetch completed. status:", res.status);
      const data = await res.json();
      console.log("[signin] response JSON:", data);

      if (!res.ok) {
        alert(data.msg || "Invalid email or password!");
        return;
      }

      // Save token + user
      console.log("[signin] storing token+user to localStorage");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      // Now redirect to music page
      window.location.href = "Music.html";

    } catch (err) {
      alert("Server error. Try again later.");
      console.error("[signin] error:", err);
    }
  });
});

// Toggle password
document.getElementById("toggleSignInPassword").addEventListener("click", () => {
  const pass = document.getElementById("signinPassword");
  pass.type = pass.type === "password" ? "text" : "password";
});
