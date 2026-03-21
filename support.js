(function(){
  emailjs.init("3DvimupJeAOPC-tH4"); // Replace with your EmailJS Public Key
})();

document.getElementById("supportForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  emailjs.send("service_ad2tml2", "template_uv3xnca", params)
  .then(() => {
    document.getElementById("statusMsg").innerText = "✅ Message sent successfully!";
    document.getElementById("supportForm").reset();
  })
  .catch((error) => {
    document.getElementById("statusMsg").innerText = "❌ Failed to send. Try again.";
    console.error("EmailJS Error:", error);
  });
});
