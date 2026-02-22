import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { updateProfile } from '../controllers/user.controller';

const router = Router();
router.put('/profile', protect, updateProfile);
export default router;
