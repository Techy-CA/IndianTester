import { Request, Response } from 'express';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const validRoles = ['buyer', 'admin', 'superadmin'];

    if (!role || !validRoles.includes(role))
      return res.status(400).json({ message: `Role must be one of: ${validRoles.join(', ')}.` });

    // Superadmin role sirf superadmin assign kar sakta hai
    if (role === 'superadmin' && req.user?.role !== 'superadmin')
      return res.status(403).json({ message: 'Only superadmin can assign superadmin role.' });

    // Apna khud ka role change nahi kar sakta
    if (req.params.id === req.user?.id)
      return res.status(400).json({ message: 'You cannot change your own role.' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'Role updated successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    // Apna khud ka account delete nahi kar sakta
    if (req.params.id === req.user?.id)
      return res.status(400).json({ message: 'You cannot delete your own account.' });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    // Superadmin ko delete nahi kar sakte (sirf superadmin ke alawa)
    if (user.role === 'superadmin' && req.user?.role !== 'superadmin')
      return res.status(403).json({ message: 'Cannot delete a superadmin account.' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
