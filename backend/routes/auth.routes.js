import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

// make instance router
const router = express.Router();

// make signup endpoint
router.get('/signup', signup);

// make login endpoint
router.get('/login', login);

// make logout endpoint
router.post('/logout', logout);

export default router;
