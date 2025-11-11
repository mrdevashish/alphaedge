const form = document.getElementById('subscribe-form');
const email = document.getElementById('subEmail');
const msg = document.getElementById('subMsg');

if (form && email && msg) {
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const val = (email.value||'').trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "#ff6b6b";
      return;
    }
    msg.textContent = "Submitting…"; msg.style.color = "";
    try {
      // Placeholder: connect your backend or ESP here
      await new Promise(r=>setTimeout(r, 600));
      msg.textContent = "Thanks! Please check your inbox for confirmation.";
      msg.style.color = "#7bd88f";
      form.reset();
    } catch {
      msg.textContent = "Something went wrong. Please try again.";
      msg.style.color = "#ff6b6b";
    }
  });
}
