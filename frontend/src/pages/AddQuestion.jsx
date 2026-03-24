import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaCheck, FaCoins } from 'react-icons/fa';

const AddQuestion = () => {
    const [category, setCategory] = useState('Aptitude');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [coinReward, setCoinReward] = useState(10);
    const [message, setMessage] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/questions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    category,
                    questionText,
                    options,
                    correctAnswerIndex: parseInt(correctAnswerIndex),
                    coinReward: parseInt(coinReward)
                })
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Question added successfully!');
                setQuestionText('');
                setOptions(['', '', '', '']);
                setCorrectAnswerIndex(0);
                setCoinReward(10);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Failed to create question.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-12 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen mix-blend-screen opacity-50 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border-t-2 border-l-2 border-purple-500/30 border-r-2 border-b-2 border-blue-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    >
                        <FaPlus className="text-white text-2xl" />
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400">
                        Add New Question
                    </h2>
                    <p className="text-gray-400 mt-2">Create a new gamified challenge for students</p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 text-sm font-semibold border ${message.includes('success')
                                ? 'bg-green-500/10 text-green-400 border-green-500/50'
                                : 'bg-red-500/10 text-red-400 border-red-500/50'
                            }`}
                    >
                        {message}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-300 font-medium ml-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 appearance-none"
                            required
                        >
                            <option value="Aptitude">Aptitude</option>
                            <option value="Reasoning">Reasoning</option>
                            <option value="Verbal">Verbal</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-300 font-medium ml-1">Question Text</label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 min-h-[100px]"
                            placeholder="Enter your question here..."
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-gray-300 font-medium ml-1">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                        placeholder={`Option ${index + 1}`}
                                        required
                                    />
                                </div>
                                <label className={`flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer transition-all border ${correctAnswerIndex === index
                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        value={index}
                                        checked={correctAnswerIndex === index}
                                        onChange={() => setCorrectAnswerIndex(index)}
                                        className="hidden"
                                    />
                                    <FaCheck className="mr-2" /> Correct
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-300 font-medium ml-1 flex items-center gap-2">
                            <FaCoins className="text-yellow-400" /> Coin Reward
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                value={coinReward}
                                onChange={(e) => setCoinReward(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all placeholder-gray-500 text-lg font-bold"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-lg text-sm font-bold">
                                Coins
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-8 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
                    >
                        Create Question
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddQuestion;
