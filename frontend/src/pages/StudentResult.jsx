import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrophy, FaCoins, FaCheckCircle, FaChartLine, FaGift } from 'react-icons/fa';

const StudentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if no result data
    useEffect(() => {
        if (!location.state || !location.state.result) {
            navigate('/student/dashboard');
        }
    }, [location, navigate]);

    if (!location.state || !location.state.result) return null;

    const { result, newBalance } = location.state;
    const isPerfect = result.scorePercentage === 100;
    const isGood = result.scorePercentage >= 70;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute top-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl mix-blend-screen opacity-40 animate-pulse ${isPerfect ? 'bg-yellow-500' : isGood ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl mix-blend-screen opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative z-10 w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl text-center"
            >
                {/* Trophy Header */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-32 h-32 mx-auto mb-6 relative"
                >
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900">
                        <FaTrophy className="text-white text-5xl drop-shadow-md" />
                    </div>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                    {isPerfect ? "Perfect Score!" : isGood ? "Great Job!" : "Good Effort!"}
                </h1>
                <p className="text-gray-400 text-lg mb-10">You've completed the challenge.</p>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Score Percentage */}
                    <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Final Score</p>
                        <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${isPerfect ? 'from-yellow-400 to-yellow-200' :
                                isGood ? 'from-green-400 to-emerald-300' :
                                    'from-blue-400 to-indigo-300'
                            }`}>
                            {result.scorePercentage.toFixed(0)}%
                        </div>
                    </div>

                    {/* Correct Answers */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6 text-center">
                        <FaCheckCircle className="text-green-400 text-3xl mx-auto mb-3" />
                        <p className="text-3xl font-black text-white mb-1">{result.correctAnswers} <span className="text-lg text-gray-500 font-bold">/ {result.totalQuestions}</span></p>
                        <p className="text-gray-400 text-xs font-bold uppercase">Correct</p>
                    </div>

                    {/* Coins Earned */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-6 text-center shadow-[inset_0_0_20px_rgba(250,204,21,0.05)]">
                        <FaCoins className="text-yellow-400 text-3xl mx-auto mb-3 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        <p className="text-3xl font-black text-yellow-500 mb-1">+{result.coinsEarned}</p>
                        <p className="text-yellow-600 text-xs font-bold uppercase">Coins Earned</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors border border-gray-700"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold py-4 px-6 rounded-2xl transition-colors border border-blue-500/30 flex items-center justify-center gap-2"
                    >
                        <FaChartLine /> View Ranks
                    </button>
                    <button
                        onClick={() => navigate('/student/dashboard')} // Logic to handle shop routing if needed
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                        <FaGift /> Redeem
                    </button>
                </div>
            </motion.div >
        </div >
    );
};

export default StudentResult;
