import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar, FaBolt } from 'react-icons/fa';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/questions/leaderboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setLeaderboard(data.leaderboard);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <FaTrophy className="text-yellow-400 text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
            case 1: return <FaMedal className="text-gray-300 text-2xl drop-shadow-[0_0_10px_rgba(209,213,219,0.8)]" />;
            case 2: return <FaMedal className="text-amber-600 text-2xl drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />;
            default: return <span className="font-bold text-gray-500 text-lg">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center py-12 px-4 sm:px-6 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center mb-12"
            >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 mb-6 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                    <FaTrophy className="text-white text-4xl" />
                </div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 uppercase tracking-tighter drop-shadow-sm">
                    Global Leaderboard
                </h1>
                <p className="text-gray-400 mt-4 text-lg max-w-lg mx-auto">
                    Top performers across all gamified challenges. Earn coins and XP to climb the ranks!
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-4xl bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <FaStar className="mx-auto text-4xl mb-4 opacity-30" />
                        <p className="text-xl">No players ranked yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Header Row */}
                        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-2 text-center">Rank</div>
                            <div className="col-span-6 text-left">Player</div>
                            <div className="col-span-2 text-center">Score / XP</div>
                            <div className="col-span-2 text-center">Coins</div>
                        </div>

                        {leaderboard.map((student, index) => (
                            <motion.div
                                key={student._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`grid grid-cols-12 gap-4 items-center p-4 sm:p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-default \${
                                    index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]' :
                                    index === 1 ? 'bg-gray-800/80 border-gray-400/50 shadow-[0_0_15px_rgba(209,213,219,0.1)]' :
                                    index === 2 ? 'bg-amber-900/30 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.1)]' :
                                    'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/80'
                                }`}
                            >
                                <div className="col-span-12 sm:col-span-2 flex justify-center items-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900/50 border border-gray-700 shadow-inner">
                                        {getRankIcon(index)}
                                    </div>
                                </div>
                                <div className="col-span-12 sm:col-span-6 flex items-center gap-4 mt-4 sm:mt-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                            index === 1 ? 'bg-gray-300 text-gray-800' :
                                                index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-purple-600/50 text-white'
                                        }`}>
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                                            {student.name}
                                        </h3>
                                        <div className="flex gap-1 mt-1">
                                            {student.badges && student.badges.slice(0, 3).map((badge, bIdx) => (
                                                <span key={bIdx} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {badge}
                                                </span>
                                            ))}
                                            {(!student.badges || student.badges.length === 0) && (
                                                <span className="text-xs text-gray-500 italic">Novice</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-6 sm:col-span-2 flex flex-col items-center justify-center mt-4 sm:mt-0 border-r border-gray-700 sm:border-r-0">
                                    <span className="text-xs text-gray-400 uppercase font-bold sm:hidden mb-1">XP</span>
                                    <div className="flex items-center gap-1.5 font-bold text-blue-400">
                                        <FaBolt className="text-blue-500" /> {student.xp || 0}
                                    </div>
                                </div>
                                <div className="col-span-6 sm:col-span-2 flex flex-col items-center justify-center mt-4 sm:mt-0">
                                    <span className="text-xs text-gray-400 uppercase font-bold sm:hidden mb-1">Coins</span>
                                    <div className="flex items-center gap-1.5 font-bold text-yellow-400 text-lg">
                                        <FaStar /> {student.coins || 0}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Leaderboard;
