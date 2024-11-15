import express from 'express';
import { checkAuth, login, logout, signup } from '../controller/userController.js';
import { verifyUser } from '../middleware/verifyuser.js';

const router = express.Router();

// authorization
router.post('/register',signup)
router.post('/login',login)

router.post('/logout',verifyUser,logout)
router.get('/check',verifyUser,checkAuth)

// logging grievance


export default router