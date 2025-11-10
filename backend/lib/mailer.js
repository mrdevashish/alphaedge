import sg from '@sendgrid/mail'; sg.setApiKey(process.env.SENDGRID_API_KEY||'');
const FROM=process.env.FROM_EMAIL||'no-reply@example.com';
export const sendMail=async(to,sub,html)=>{ if(!process.env.SENDGRID_API_KEY) return; await sg.send({to,from:FROM,subject:sub,html}); }
