import jwt from 'jsonwebtoken';
export const requireAuth=(req,res,next)=>{
  try{
    const t=(req.headers.authorization||'').replace('Bearer ',''); if(!t) return res.status(401).json({message:'no token'});
    const p=jwt.verify(t,process.env.JWT_SECRET||'dev'); req.user={email:p.email}; next();
  }catch(e){ return res.status(401).json({message:'bad token'}); }
}
export const requireAdmin=(req,res,next)=>{
  const admin=(process.env.ADMIN_EMAIL||'').toLowerCase(); const e=(req.user?.email||'').toLowerCase();
  if(!e) return res.status(401).json({message:'no user'}); if(e!==admin) return res.status(403).json({message:'forbidden'}); next();
}
