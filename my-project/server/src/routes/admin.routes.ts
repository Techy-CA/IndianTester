import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/admin.controller';

const router = Router();

router.get('/users', protect, authorizeRoles('admin', 'superadmin'), getAllUsers);
router.put('/users/:id/role', protect, authorizeRoles('superadmin'), updateUserRole);
router.delete('/users/:id', protect, authorizeRoles('superadmin'), deleteUser);

export default router;
