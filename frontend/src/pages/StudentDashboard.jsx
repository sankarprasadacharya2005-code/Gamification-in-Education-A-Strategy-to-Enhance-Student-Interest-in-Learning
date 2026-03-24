import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CoinTrendGraph from '../components/CoinTrendGraph';
import Shop from '../components/Shop';
import { FaBookOpen, FaCoins, FaStar, FaSignOutAlt, FaTrophy, FaGamepad, FaShoppingBag } from 'react-icons/fa';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('quizzes');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!user || user.role !== 'student' || !token) {
            navigate('/student/login');
        } else {
            setStudent(user);
            fetchQuizzes(token);
            if (activeTab === 'history') fetchProfile(token);
        }
    }, [navigate, activeTab]);

    const fetchProfile = async (token) => {
        try {
            const res = await fetch('/api/auth/student/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStudent(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Failed to fetch profile');
        }
    };

    const fetchQuizzes = async (token) => {
        try {
            const res = await fetch('/api/quizzes/available', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setQuizzes(data.quizzes);
        } catch (error) {
            console.error('Failed to fetch quizzes');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setResult(null);
    };

    const handleSubmitQuiz = async () => {
        if (answers.includes(null)) return alert('Please answer all questions!');
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/quizzes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quizId: activeQuiz._id, answers })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
                // Update local student data
                const updatedUser = {
                    ...student,
                    coins: data.newBalance.coins,
                    xp: data.newBalance.xp,
                    coinHistory: data.coinHistory || student.coinHistory // Use history from API
                };
                setStudent(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            alert('Failed to submit quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.1, 0.2, 0.1],
                            scale: [1, 1.2, 1],
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Nav */}
            <nav className="bg-white px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">STUDENT PORTAL</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setActiveTab('quizzes'); setActiveQuiz(null); }}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm ${activeTab === 'quizzes' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            Quizzes
                        </button>
                        <button
                            onClick={() => { setActiveTab('wordgame'); setActiveQuiz(null); }}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm ${activeTab === 'wordgame' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            Word Game
                        </button>
                        <button
                            onClick={() => navigate('/student/test')}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2`}
                        >
                            <FaGamepad /> Gamified Tests
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2`}
                        >
                            <FaTrophy /> Leaderboard
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); setActiveQuiz(null); }}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            My Marks
                        </button>
                        <button
                            onClick={() => { setActiveTab('shop'); setActiveQuiz(null); }}
                            className={`font-bold px-4 py-2 rounded-xl transition-all text-sm flex items-center gap-2 ${activeTab === 'shop' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            <FaShoppingBag /> Reward Shop
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">Hi, {student?.name}!</span>
                    <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                {activeTab === 'wordgame' && (
                    <WordGame student={student} setStudent={setStudent} />
                )}

                {activeTab === 'shop' && (
                    <Shop student={student} setStudent={setStudent} />
                )}

                {activeTab === 'quizzes' && !activeQuiz && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <h2 className="col-span-full text-2xl font-bold text-gray-800 mb-2">Available Quizzes</h2>
                        {quizzes.map(quiz => (
                            <motion.div
                                key={quiz._id}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 flex flex-col gap-4"
                            >
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl w-fit">
                                    <FaBookOpen />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
                                    <p className="text-gray-500 text-sm">{quiz.chapterId?.subject} • {quiz.questions.length} Qs</p>
                                </div>
                                <button
                                    onClick={() => startQuiz(quiz)}
                                    className="mt-auto bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaGamepad /> Play & Win
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'history' && !activeQuiz && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Quiz History</h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-2xl font-bold">
                                    <FaCoins /> {student?.coins || 0}
                                </div>
                                <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-bold">
                                    <FaStar /> {student?.xp || 0} XP
                                </div>
                            </div>
                        </div>

                        {/* Coin Trend Graph */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50 mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Coin Progress Trend</h3>
                            <div className="h-[300px] w-full">
                                <CoinTrendGraph data={student?.coinHistory || []} />
                            </div>
                        </div>

                        <CoinTrendGraph history={student?.coinHistory} />

                        <div className="bg-white rounded-3xl shadow-sm border border-indigo-50 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-black">
                                    <tr>
                                        <th className="px-6 py-4">Quiz Name</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {student?.quizHistory?.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-700">Quiz Artifact #{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                                    {entry.score}/{entry.totalPoints}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{new Date(entry.completedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {(!student?.quizHistory || student.quizHistory.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-gray-400">No quizzes taken yet. Play some games!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeQuiz && (
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => setActiveQuiz(null)}
                            className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline"
                        >
                            Back to Quizzes
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-50"
                        >
                            {!result ? (
                                <>
                                    <h2 className="text-3xl font-black text-gray-800 mb-8">{activeQuiz.title}</h2>
                                    <div className="space-y-10">
                                        {activeQuiz.questions.map((q, qIdx) => (
                                            <div key={qIdx} className="space-y-4">
                                                <p className="text-lg font-bold text-gray-700">{qIdx + 1}. {q.questionText}</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <button
                                                            key={oIdx}
                                                            onClick={() => {
                                                                const newAns = [...answers];
                                                                newAns[qIdx] = oIdx;
                                                                setAnswers(newAns);
                                                            }}
                                                            className={`p-4 rounded-2xl text-left border-2 transition-all font-medium ${answers[qIdx] === oIdx ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-indigo-200'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={loading}
                                        className="w-full mt-10 bg-indigo-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Finish & Claim Rewards!'}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-5xl mx-auto">
                                        <FaTrophy />
                                    </div>
                                    <h2 className="text-4xl font-black text-gray-800">Quiz Complete!</h2>
                                    <p className="text-6xl font-black text-indigo-600">{result.score}/{result.totalPoints}</p>

                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <div className="bg-yellow-50 p-4 rounded-3xl">
                                            <p className="text-yellow-600 font-bold mb-1">Coins Won</p>
                                            <p className="text-2xl font-black text-yellow-700">+{result.coinsAwarded}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-3xl">
                                            <p className="text-purple-600 font-bold mb-1">XP Earned</p>
                                            <p className="text-2xl font-black text-purple-700">+{result.xpAwarded}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveQuiz(null)}
                                        className="w-full mt-8 border-2 border-indigo-600 text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-all"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};


const WordGame = ({ student, setStudent }) => {
    const [gameContent, setGameContent] = useState(null);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const fetchNewWord = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/wordgame/random', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setGameContent(data);
                setGuess('');
                setMessage({ type: '', text: '' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to find words' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!guess) return;
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/wordgame/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ wordId: gameContent.wordId, guess })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Update student coins
                const updatedStudent = {
                    ...student,
                    coins: data.newBalance.coins,
                    xp: data.newBalance.xp,
                    coinHistory: data.coinHistory || student.coinHistory
                };
                setStudent(updatedStudent);
                localStorage.setItem('user', JSON.stringify(updatedStudent));
                setTimeout(fetchNewWord, 2000); // New word after 2s
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Verification failed' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewWord();
    }, []);

    if (!gameContent) return <div className="text-center py-20 font-bold text-gray-400">Loading Game...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl border-4 border-indigo-200 text-center space-y-8"
        >
            <div className="space-y-2">
                <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Scrambled Word</span>
                <h2 className="text-5xl font-black text-indigo-600 tracking-[0.2em] uppercase">{gameContent.scrambled}</h2>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 italic text-orange-700">
                <span className="font-bold underline">Hint:</span> {gameContent.hint}
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value.toUpperCase())}
                    placeholder="Type your guess here..."
                    className="w-full p-4 text-center text-xl font-bold border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none uppercase"
                    autoFocus
                />
                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                    <FaGamepad /> {loading ? 'Checking...' : 'Check Answer'}
                </button>
            </form>

            {message.text && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-400">
                <p>Correct answer wins 10 Coins!</p>
                <button
                    type="button"
                    onClick={fetchNewWord}
                    className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]"
                >
                    Skip Word
                </button>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
