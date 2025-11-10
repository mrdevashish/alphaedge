import express from 'express'; import db from '../lib/db.js'; import {requireAuth} from '../lib/auth.js';
const router=express.Router();
router.use(requireAuth);
router.get('/subscription', (req,res)=>{
  const s=db.subs.get(req.user.email);
  res.json(s? s : {status:'none'});
});
export default router;
