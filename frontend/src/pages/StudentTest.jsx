import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaArrowRight, FaTimes } from 'react-icons/fa';

const StudentTest = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('All');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const categories = ['All', 'Aptitude', 'Reasoning', 'Verbal'];

    const startTest = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/questions/test?category=${category}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(null));
                setStarted(true);
                setCurrentQuestionIndex(0);
            }
        } catch (error) {
            console.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);

        // Move to next question automatically after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 300);
    };

    const finishTest = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/questions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questions, answers })
            });

            const data = await res.json();
            if (data.success) {
                // Navigate to results page with data
                navigate('/student/result', { state: { result: data.result, newBalance: data.newBalance } });
            }
        } catch (error) {
            console.error('Failed to submit test');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
            </div>

            <div className="relative z-10 w-full max-w-3xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-bold"
                    >
                        <FaTimes /> Exit
                    </button>
                    <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700">
                        <FaGamepad className="text-purple-400" />
                        <span className="font-bold text-white tracking-widest uppercase text-sm">Gamified Challenge</span>
                    </div>
                </div>

                {!started ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(168,85,247,0.15)]"
                    >
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                            <FaGamepad className="text-white text-5xl transform -rotate-12 hover:rotate-0 transition-transform duration-300" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4">Ready for a Challenge?</h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                            Test your skills, earn coins, and climb the global leaderboard. Select a category to begin.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`p-4 rounded-2xl font-bold border-2 transition-all ${category === cat
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={startTest}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-black py-5 px-12 rounded-full text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105"
                        >
                            {loading ? 'Preparing...' : 'Start Game!'}
                        </button>
                    </motion.div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-20 text-white">
                        <p className="text-2xl font-bold mb-4">No questions found for this category!</p>
                        <button onClick={() => setStarted(false)} className="text-purple-400 hover:underline">Try another category</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="bg-gray-800 rounded-full h-3 w-full overflow-hidden border border-gray-700">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                        Question {currentQuestionIndex + 1} of {questions.length}
                                    </span>
                                    <span className="text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg">
                                        +{questions[currentQuestionIndex].coinReward || 10} Coins
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-tight">
                                    {questions[currentQuestionIndex].questionText}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {questions[currentQuestionIndex].options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            onClick={() => submitAnswer(oIdx)}
                                            className={`p-5 rounded-2xl text-left border-2 font-bold text-lg transition-all ${answers[currentQuestionIndex] === oIdx
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${answers[currentQuestionIndex] === oIdx ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {String.fromCharCode(65 + oIdx)}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation controls */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-3 rounded-xl font-bold bg-gray-800 text-white disabled:opacity-30 hover:bg-gray-700 transition-colors"
                            >
                                Previous
                            </button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={finishTest}
                                    disabled={loading || answers.includes(null)}
                                    className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Submitting...' : 'Finish Test'} <FaArrowRight />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2"
                                >
                                    Next <FaArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTest;
