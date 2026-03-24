import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaGoogle, FaEnvelope, FaLock, FaUser, FaCheckCircle } from 'react-icons/fa';

const TeacherLogin = () => {
    const navigate = useNavigate();
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [step, setStep] = useState('initial'); // 'initial', 'sending', 'otp-sent', 'verified'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return setMessage({ type: 'error', text: 'Please enter your Gmail' });

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/teacher/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                setStep('otp-sent');
                setMessage({ type: 'success', text: 'OTP sent! Check your email (or console if mocking).' });
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to connect to server' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/teacher/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, name, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setMessage({ type: 'success', text: `Success! Your ID is: ${data.teacherId}` });
                setTimeout(() => navigate('/teacher/dashboard'), 3000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Verification failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/teacher/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherId, password: loginPassword })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/teacher/dashboard');
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            if (error.message.includes('buffering timed out')) {
                setMessage({ type: 'error', text: 'Database is still connecting. Please wait 5 seconds and try again.' });
            } else {
                setMessage({ type: 'error', text: 'Login failed. Please check your connection.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden p-4">
            <Link to="/" className="absolute top-8 left-8 text-primary flex items-center gap-2 hover:text-primary/80 transition-colors">
                <FaArrowLeft /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10"
            >
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Teacher Portal</h2>

                {message.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message.text}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!isOtpMode ? (
                        <motion.div
                            key="login-choice"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6"
                        >
                            <motion.button
                                onClick={() => setIsOtpMode(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl w-full hover:bg-gray-50 transition-colors"
                            >
                                <FaGoogle className="text-red-500" />
                                First Login? Verify via Gmail
                            </motion.button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or Login with ID</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        className="shadow appearance-none border rounded-xl w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        type="text"
                                        placeholder="Teacher ID (e.g. TCH12345)"
                                        value={teacherId}
                                        onChange={(e) => setTeacherId(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        className="shadow appearance-none border rounded-xl w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        type="password"
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-4 rounded-xl w-full disabled:opacity-50"
                                    type="submit"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </motion.button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-flow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => { setIsOtpMode(false); setStep('initial'); }}
                                className="text-sm text-gray-500 hover:text-primary mb-4 flex items-center gap-1"
                            >
                                <FaArrowLeft size={10} /> Back to standard login
                            </button>

                            {step === 'initial' || step === 'sending' ? (
                                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                                    <p className="text-sm text-gray-600 mb-2">New teachers must verify their Gmail to generate a unique ID.</p>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            className="shadow appearance-none border rounded-xl w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            type="email"
                                            placeholder="Your Gmail address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <motion.button
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl w-full disabled:opacity-50"
                                        type="submit"
                                    >
                                        {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyAndRegister} className="flex flex-col gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg flex items-center gap-2 text-primary text-sm mb-2">
                                        <FaCheckCircle /> We sent an OTP to {email}
                                    </div>
                                    <input
                                        required
                                        maxLength={6}
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-center text-2xl tracking-widest font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <input
                                        required
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <input
                                        required
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                        type="password"
                                        placeholder="Create Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <motion.button
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl w-full disabled:opacity-50"
                                        type="submit"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Register'}
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default TeacherLogin;
