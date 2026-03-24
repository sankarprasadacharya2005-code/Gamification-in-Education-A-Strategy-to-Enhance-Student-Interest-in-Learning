import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaGoogle, FaEnvelope, FaLock, FaUser, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [step, setStep] = useState('initial'); // 'initial', 'otp-sent'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [classGrade, setClassGrade] = useState('');
    const [studentId, setStudentId] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch('/api/auth/teacher/send-otp', { // Reuse teacher's OTP sender
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setStep('otp-sent');
                setMessage({ type: 'success', text: 'OTP sent to your Gmail!' });
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/student/register-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, name, password, classGrade })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Request sent! Wait for teacher approval.' });
                setTimeout(() => {
                    setIsRegisterMode(false);
                    setStep('initial');
                }, 4000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch('/api/auth/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/student/dashboard');
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 relative overflow-hidden p-4 font-sans">
            <Link to="/" className="absolute top-8 left-8 text-indigo-600 flex items-center gap-2 hover:text-indigo-800 transition-colors font-bold">
                <FaArrowLeft /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md z-10 border border-indigo-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 text-3xl">
                        <FaUserGraduate />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-center text-gray-800 mb-6 tracking-tight">Student Hub</h2>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                    >
                        {message.type === 'success' && <FaCheckCircle />}
                        {message.text}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {!isRegisterMode ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest pl-1">Student ID</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-700 font-bold transition-all outline-none"
                                            placeholder="e.g. STU12345"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Joining Server...' : 'Enter Lab'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-gray-500 font-bold text-sm mb-4">New here? Sign up with Gmail</p>
                                <button
                                    onClick={() => { setIsRegisterMode(true); setStep('initial'); setMessage({ type: '', text: '' }); }}
                                    className="flex items-center justify-center gap-3 w-full border-2 border-gray-100 text-gray-700 font-black py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <FaGoogle className="text-red-500" />
                                    Register via Gmail
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <button
                                onClick={() => setIsRegisterMode(false)}
                                className="text-sm text-indigo-600 font-black mb-4 flex items-center gap-1 hover:underline"
                            >
                                <FaArrowLeft size={10} /> Back to Login
                            </button>

                            {step === 'initial' ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest pl-1">Institute Email (Gmail)</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-700 font-bold transition-all outline-none"
                                                placeholder="yourname@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Sending Code...' : 'Send Verification OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegisterRequest} className="space-y-4">
                                    <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3 text-indigo-700 text-sm font-bold mb-4">
                                        <FaCheckCircle className="text-lg" /> Code sent to {email}
                                    </div>
                                    <input
                                        required
                                        maxLength={6}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 text-center text-3xl tracking-widest font-black text-gray-700 outline-none"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-700 font-bold outline-none"
                                                placeholder="Your Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                type="password"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-700 font-bold outline-none"
                                                placeholder="Create Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <input
                                            required
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 px-4 text-gray-700 font-bold outline-none"
                                            placeholder="Class (e.g. 10th Standard)"
                                            value={classGrade}
                                            onChange={(e) => setClassGrade(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Send Approval Request'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default StudentLogin;
