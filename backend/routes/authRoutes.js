const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginStudent,
    registerStudentRequest,
    sendOtp,
    verifyOtpAndRegister,
    loginTeacher,
    getStudentProfile
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Student Auth
router.post('/student/register', protect, authorize('teacher'), registerStudent);
router.post('/student/login', loginStudent);
router.post('/student/register-request', registerStudentRequest); // New: self-registration
router.get('/student/profile', protect, getStudentProfile);

// Teacher Auth
router.post('/teacher/send-otp', sendOtp);
router.post('/teacher/verify-otp', verifyOtpAndRegister);
router.post('/teacher/login', loginTeacher);

// Management (Teacher only)
const { getPendingStudents, approveStudent } = require('../controllers/authController');
router.get('/teacher/pending-students', protect, authorize('teacher'), getPendingStudents);
router.post('/teacher/approve-student', protect, authorize('teacher'), approveStudent);

module.exports = router;
