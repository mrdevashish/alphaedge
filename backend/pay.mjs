import crypto from "node:crypto";

export function hasRazorpayEnv(){
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createOrder(amountINR, receipt="alphaedge-order"){
  if(!hasRazorpayEnv()){
    return { status:501, json:{ error:"Razorpay not configured" } };
  }
  // Minimal order payload; in real use, call Razorpay SDK
  // We keep it dependency-free by returning the payload you can POST with your own server task.
  const amountPaise = Math.max(1, Math.round(Number(amountINR)*100));
  const order = {
    id: "order_demo_"+Date.now(),    // placeholder (Razorpay gives real id)
    amount: amountPaise,
    currency: "INR",
    receipt,
    status: "created"
  };
  return { status:200, json:{ order } };
}

export function verifyWebhookSignature(bodyRaw, signature, secret){
  const expected = crypto.createHmac("sha256", secret)
    .update(bodyRaw, "utf8")
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature||"", "utf8"));
}
