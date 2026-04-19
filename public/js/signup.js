let tempUserData = null;

const signupForm = document.getElementById("signup-form");
const statusMsg = document.getElementById("statusMsg");
const otpSection = document.getElementById("otpSection");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// ==========================
// STEP 1: SEND OTP
// ==========================
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    statusMsg.textContent = "❌ Passwords do not match!";
    statusMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      statusMsg.textContent = "❌ " + data.msg;
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "📩 OTP sent to your email!";
    statusMsg.style.color = "yellow";

    tempUserData = { firstName, lastName, email, password };

    otpSection.style.display = "block";

  } catch (error) {
    console.error(error);
    statusMsg.textContent = "❌ Server error!";
    statusMsg.style.color = "red";
  }
});


// ==========================
// STEP 2: VERIFY OTP
// ==========================
verifyOtpBtn.addEventListener("click", async () => {
  const otp = document.getElementById("otp").value.trim();

  if (!otp) {
    statusMsg.textContent = "❌ Please enter OTP";
    statusMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: tempUserData.firstName,
        lastName: tempUserData.lastName,
        email: tempUserData.email,
        password: tempUserData.password,
        otp
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      statusMsg.textContent = "❌ " + data.msg;
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "✔ Account created successfully!";
    statusMsg.style.color = "lime";


    setTimeout(() => {
      window.location.href = "/"; // ✅ FIXED
    }, 1500);

  } catch (error) {
    console.error(error);
    statusMsg.textContent = "❌ Verification failed!";
    statusMsg.style.color = "red";
  }
});

// ==========================
// SHOW / HIDE PASSWORD
// ==========================
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

toggleConfirmPassword.addEventListener("click", () => {
  confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
});