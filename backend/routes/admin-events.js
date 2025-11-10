import express from 'express'; import {requireAuth,requireAdmin} from '../lib/auth.js'; import db from '../lib/db.js';
const router=express.Router(); router.use(requireAuth,requireAdmin);
router.get('/', (_req,res)=>res.json(db.events.list()));
export default router;
