"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User_model_1.default.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getAllUsers = getAllUsers;
// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
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
        const user = await User_model_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'Role updated successfully.', user });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateUserRole = updateUserRole;
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        // Apna khud ka account delete nahi kar sakta
        if (req.params.id === req.user?.id)
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        const user = await User_model_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        // Superadmin ko delete nahi kar sakte (sirf superadmin ke alawa)
        if (user.role === 'superadmin' && req.user?.role !== 'superadmin')
            return res.status(403).json({ message: 'Cannot delete a superadmin account.' });
        await User_model_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.deleteUser = deleteUser;
