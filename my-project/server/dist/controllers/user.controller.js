"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("../models/User.model"));
const updateProfile = async (req, res) => {
    try {
        const user = await User_model_1.default.findById(req.user?.id);
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        const { email, whatsapp, upiId, currentPassword, newPassword } = req.body;
        // Validate required fields
        if (!email?.trim() || !whatsapp?.trim())
            return res.status(400).json({ message: 'Email and WhatsApp are required.' });
        if (!/^\d{10}$/.test(whatsapp))
            return res.status(400).json({ message: 'Enter a valid 10-digit WhatsApp number.' });
        // Check email not taken by another user
        const emailTaken = await User_model_1.default.findOne({
            email: email.toLowerCase(),
            _id: { $ne: user._id }
        });
        if (emailTaken)
            return res.status(400).json({ message: 'Email already in use by another account.' });
        // Update allowed fields (name is NOT editable)
        user.email = email.toLowerCase().trim();
        user.whatsapp = whatsapp.trim();
        user.upiId = upiId?.trim() || '';
        // Password change (optional)
        if (newPassword) {
            if (!currentPassword)
                return res.status(400).json({ message: 'Enter your current password to change it.' });
            if (newPassword.length < 6)
                return res.status(400).json({ message: 'New password must be at least 6 characters.' });
            const match = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!match)
                return res.status(401).json({ message: 'Current password is incorrect.' });
            user.password = await bcryptjs_1.default.hash(newPassword, 10);
        }
        await user.save();
        res.json({
            email: user.email,
            whatsapp: user.whatsapp,
            upiId: user.upiId,
            message: 'Profile updated successfully.'
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateProfile = updateProfile;
