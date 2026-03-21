document.addEventListener("DOMContentLoaded", () => {

  const forgotForm = document.getElementById("forgotForm");
  const resetForm = document.getElementById("resetForm");
  const forgotStatus = document.getElementById("forgotStatus");
  const resetStatus = document.getElementById("resetStatus");

  const resendBtn = document.getElementById("resendBtn");
  const resendWrapper = document.getElementById("resendWrapper");
  const resendTimer = document.getElementById("resendTimer");

  const toggleNewPass = document.getElementById("toggleNewPass");
  const newPasswordField = document.getElementById("newPassword");

  let userEmail = null;
  let countdownInterval = null;

  // ==============================
  // TIMER FUNCTION
  // ==============================
  function startResendTimer() {
    let timeLeft = 60;

    resendBtn.disabled = true;
    resendTimer.textContent = ` (${timeLeft}s)`;

    countdownInterval = setInterval(() => {
      timeLeft--;
      resendTimer.textContent = ` (${timeLeft}s)`;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        resendBtn.disabled = false;
        resendTimer.textContent = "";
      }
    }, 1000);
  }

  // ==============================
  // STEP 1 - SEND OTP
  // ==============================
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    userEmail = document.getElementById("forgotEmail").value.trim();

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        forgotStatus.textContent = data.msg;
        forgotStatus.style.color = "red";
        return;
      }

      forgotStatus.textContent = "OTP sent to your email";
      forgotStatus.style.color = "lime";

      forgotForm.style.display = "none";
      resetForm.style.display = "block";
      resendWrapper.style.display = "block";

      startResendTimer();

    } catch (err) {
      forgotStatus.textContent = "Server error";
      forgotStatus.style.color = "red";
    }
  });

  // ==============================
  // STEP 2 - RESET PASSWORD
  // ==============================
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = document.getElementById("resetOtp").value.trim();
    const newPassword = newPasswordField.value.trim();

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp,
          newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        resetStatus.textContent = data.msg;
        resetStatus.style.color = "red";
        return;
      }

      resetStatus.textContent = "Password reset successful!";
      resetStatus.style.color = "lime";

      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);

    } catch (err) {
      resetStatus.textContent = "Server error";
      resetStatus.style.color = "red";
    }
  });

  // ==============================
  // RESEND OTP
  // ==============================
  resendBtn.addEventListener("click", async () => {
    resendBtn.disabled = true;

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        resendBtn.disabled = false;
        return;
      }

      alert("New OTP sent!");
      startResendTimer();

    } catch (err) {
      alert("Server error");
      resendBtn.disabled = false;
    }
  });

  // ==============================
  // SHOW / HIDE PASSWORD
  // ==============================
  toggleNewPass.addEventListener("click", () => {
    const type = newPasswordField.type === "password" ? "text" : "password";
    newPasswordField.type = type;
    toggleNewPass.textContent = type === "password" ? "👁️" : "🙈";
  });

});