import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, updateUser } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);

router.post('/update', protectRoute, updateUser);
// router.post('/follow/:id', protectRoute, followUnfollowUser);
// router.get('/suggested', protectRoute, getUserProfile);

export default router;
