function tryOpen(planKey){
  // Expect localStorage keys like: PAY_WEEKLY_URL, PAY_MONTHLY_URL, PAY_YEARLY_URL
  const map = { weekly: 'PAY_WEEKLY_URL', monthly: 'PAY_MONTHLY_URL', yearly: 'PAY_YEARLY_URL' };
  const key = map[planKey];
  const url = localStorage.getItem(key);
  if (url && /^https?:\/\//i.test(url)) {
    location.href = url; // open Razorpay Payment Link
  } else {
    alert("Payment link not set. Go to Admin and save your Razorpay Payment Link URL.");
  }
}
['weekly','monthly','yearly'].forEach(k=>{
  const btn = document.querySelector(`[data-plan="${k}"]`);
  btn && btn.addEventListener('click', (e)=>{ e.preventDefault(); tryOpen(k); });
});
