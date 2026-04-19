document.addEventListener("DOMContentLoaded", () => {
  const verifyForm = document.getElementById("verifyForm");

  verifyForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop auto refresh

    const enteredOTP = document.getElementById("otp").value.trim();
    const statusMsg = document.getElementById("statusMsg");

    const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));

    if (!pendingUser) {
      statusMsg.textContent = "⚠️ No signup data found. Please sign up again.";
      statusMsg.style.color = "red";
      return;
    }

    if (enteredOTP === pendingUser.otp.toString()) {
      statusMsg.textContent = "✅ Email verified successfully!";
      statusMsg.style.color = "lime";

      // Save verified user for future login
      const verifiedUser = {
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        email: pendingUser.email,
        password: pendingUser.password,
      };

      localStorage.setItem("registeredUser", JSON.stringify(verifiedUser));
      localStorage.removeItem("pendingUser");

      setTimeout(() => {
        window.location.href = "signin.html"; // Go to login page
      }, 1500);
    } else {
      statusMsg.textContent = "❌ Invalid OTP. Please try again.";
      statusMsg.style.color = "red";
    }
  });
});




