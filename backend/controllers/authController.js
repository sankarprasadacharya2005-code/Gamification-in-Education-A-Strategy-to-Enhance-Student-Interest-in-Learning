const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Temporary in-memory OTP store (In production, use Redis)
const otpStore = new Map();

// Helper to generate a random Student/Teacher ID
const generateUniqueId = (prefix) => {
    return `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
};

exports.registerStudent = async (req, res) => {
    try {
        const { name, classGrade, teacherId } = req.body;
        let studentId;
        let isUnique = false;

        // Ensure unique ID
        while (!isUnique) {
            studentId = generateUniqueId('STU');
            const existing = await User.findOne({ studentId });
            if (!existing) isUnique = true;
        }

        const newUser = await User.create({
            role: 'student',
            name,
            classGrade,
            studentId,
            teacher: teacherId,
            coinHistory: [{ balance: 0, source: 'initial', timestamp: new Date() }]
        });

        const token = jwt.sign({ id: newUser._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            studentId,
            token,
            user: { name, coins: newUser.coins, xp: newUser.xp, role: 'student', coinHistory: newUser.coinHistory }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const user = await User.findOne({ studentId, role: 'student' });

        if (!user) return res.status(404).json({ success: false, message: 'Student ID not found' });

        if (!user.isApproved) {
            return res.status(403).json({ success: false, message: 'Your registration is pending teacher approval.' });
        }

        const token = jwt.sign({ id: user._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { name: user.name, coins: user.coins, xp: user.xp, studentId, role: 'student', coinHistory: user.coinHistory }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.registerStudentRequest = async (req, res) => {
    try {
        const { email, otp, name, password, classGrade } = req.body;

        if (!otpStore.has(email)) return res.status(400).json({ success: false, message: 'OTP not found or expired' });

        const storedOtpData = otpStore.get(email);
        if (Date.now() > storedOtpData.expiresAt || storedOtpData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        otpStore.delete(email);

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            role: 'student',
            email,
            name,
            password: hashedPassword,
            classGrade,
            isApproved: false
        });

        res.status(201).json({
            success: true,
            message: 'Registration request sent! Please wait for teacher approval.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPendingStudents = async (req, res) => {
    try {
        const pending = await User.find({ role: 'student', isApproved: false }).select('-password');
        res.json({ success: true, pending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveStudent = async (req, res) => {
    try {
        const { studentObjectId } = req.body;
        const student = await User.findById(studentObjectId);

        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        if (student.isApproved) return res.status(400).json({ success: false, message: 'Student already approved' });

        let studentId;
        let isUnique = false;
        while (!isUnique) {
            studentId = generateUniqueId('STU');
            const existing = await User.findOne({ studentId });
            if (!existing) isUnique = true;
        }

        student.studentId = studentId;
        student.isApproved = true;
        student.teacher = req.user.id;

        if (!student.coinHistory || student.coinHistory.length === 0) {
            student.coinHistory = [{ balance: 0, source: 'initial', timestamp: new Date() }];
        }

        await student.save();

        res.json({ success: true, message: `Student approved! ID: ${studentId}`, studentId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Teacher Portal OTP',
            text: `Your OTP for Gamified Educational Platform is: ${otp}. It is valid for 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL SENT] To: ${email}`);
        } catch (mailError) {
            console.error('[EMAIL ERROR]', mailError.message);
            if (process.env.EMAIL_USER === 'your_email@gmail.com' || !process.env.EMAIL_PASS) {
                console.log(`[DEVELOPMENT FALLBACK] To: ${email}, OTP: ${otp}`);
                return res.json({
                    success: true,
                    message: 'OTP generated (Mocked due to missing credentials). Check server logs.',
                    mocked: true
                });
            }
            throw mailError;
        }

        res.json({ success: true, message: 'OTP sent successfully to your Gmail!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyOtpAndRegister = async (req, res) => {
    try {
        const { email, otp, name, password } = req.body;

        if (!otpStore.has(email)) return res.status(400).json({ success: false, message: 'OTP not found or expired' });

        const storedOtpData = otpStore.get(email);
        if (Date.now() > storedOtpData.expiresAt || storedOtpData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        otpStore.delete(email);

        let user = await User.findOne({ email, role: 'teacher' });

        if (user) {
            return res.status(400).json({ success: false, message: 'Teacher already registered. Please login.' });
        }

        let teacherId = generateUniqueId('TCH');
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            role: 'teacher',
            email,
            name,
            teacherId,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully',
            teacherId,
            token,
            user: { name: user.name, email: user.email, teacherId: user.teacherId, role: 'teacher' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginTeacher = async (req, res) => {
    try {
        const { teacherId, password } = req.body;

        const user = await User.findOne({ teacherId, role: 'teacher' });
        if (!user) return res.status(404).json({ success: false, message: 'Teacher ID not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { name: user.name, email: user.email, teacherId: user.teacherId, role: 'teacher' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
