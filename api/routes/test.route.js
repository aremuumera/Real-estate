import express from 'express';
import { userLoggedIn,  AdminLoggedIn } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router  = express.Router();

router.post("/user", verifyToken, userLoggedIn)
 
router.post("/admin", AdminLoggedIn)
  

export default router;