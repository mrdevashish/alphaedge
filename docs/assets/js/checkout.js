async function startCheckout(plan="monthly"){
  try{
    const email=localStorage.getItem('ae_email')||prompt("Enter email for receipt"); if(!email) return;
    const r=await fetch(`${API_BASE}/api/pay/checkout`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})});
    const j=await r.json(); if(!r.ok) return alert(j.message||'Order failed');
    const key=j.key_id, order_id=j.order.id;
    const s=document.createElement('script'); s.src='https://checkout.razorpay.com/v1/checkout.js'; s.onload=()=>{
      const rz=new window.Razorpay({
        key, order_id, name:'Infinity Invest', description:`${plan} plan`,
        prefill:{email}, notes:{email},
        handler: function(){ alert('Payment captured! You will receive email once active.'); }
      }); rz.open();
    }; document.body.appendChild(s);
  }catch(e){ alert(e.message); }
}
