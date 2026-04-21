document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("supportForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("statusMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("supportName").value.trim();
    const email = document.getElementById("supportEmail").value.trim();
    const message = document.getElementById("supportMessage").value.trim();

    if (!name || !email || !message) {
      statusMsg.textContent = "Please fill in all fields.";
      statusMsg.style.color = "red";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusMsg.textContent = "";

    try {
      const res = await fetch("/api/auth/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (res.ok) {
        statusMsg.textContent = "✅ " + data.msg;
        statusMsg.style.color = "#1db954";
        form.reset(); // ✅ clear form
      } else {
        statusMsg.textContent = "❌ " + data.msg;
        statusMsg.style.color = "red";
      }

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "❌ Server error. Try again later.";
      statusMsg.style.color = "red";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
});