"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const register = async (req, res) => {
    try {
        const { name, email, whatsapp, password, role } = req.body;
        // Validation
        if (!name?.trim() || !email?.trim() || !whatsapp?.trim() || !password?.trim())
            return res.status(400).json({ message: 'All fields are required.' });
        if (!/^\d{10}$/.test(whatsapp))
            return res.status(400).json({ message: 'Enter a valid 10-digit WhatsApp number.' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        const existing = await User_model_1.default.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(400).json({ message: 'Email already registered.' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        await User_model_1.default.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            whatsapp: whatsapp.trim(),
            password: hashed,
            role: role || 'buyer',
        });
        res.status(201).json({ message: 'Registered successfully.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.', err });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password?.trim())
            return res.status(400).json({ message: 'Email and password are required.' });
        const user = await User_model_1.default.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(404).json({ message: 'No account found with this email.' });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Incorrect password.' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            upiId: user.upiId || '',
            role: user.role,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.', err });
    }
};
exports.login = login;
