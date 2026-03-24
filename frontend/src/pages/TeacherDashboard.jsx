import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaPlus, FaSignOutAlt, FaUsers, FaBook, FaCheckCircle, FaTrash, FaCopy, FaIdCard, FaGift, FaCoins } from 'react-icons/fa';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [pendingStudents, setPendingStudents] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Forms
    const [newStudent, setNewStudent] = useState({ name: '', classGrade: '' });
    const [newQuiz, setNewQuiz] = useState({ title: '', chapterTitle: '', subject: '', classGrade: '', questions: [{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, points: 10 }] });
    const [createdStudentInfo, setCreatedStudentInfo] = useState(null);
    const [createdStudentsList, setCreatedStudentsList] = useState([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!user || user.role !== 'teacher' || !token) {
            navigate('/teacher/login');
        } else {
            setTeacher(user);
        }
    }, [navigate]);

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchPendingStudents();
        } else if (activeTab === 'orders') {
            fetchRedemptions();
        }
    }, [activeTab]);

    const fetchRedemptions = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/shop/redemptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRedemptions(data.redemptions);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch orders' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/shop/redemptions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Order status updated!' });
                fetchRedemptions();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update order' });
        }
    };

    const fetchPendingStudents = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/auth/teacher/pending-students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPendingStudents(data.pending);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch requests' });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveStudent = async (studentObjectId) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/auth/teacher/approve-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentObjectId })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `Student approved! ID: ${data.studentId}` });
                fetchPendingStudents(); // Refresh list
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve student' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/teacher/login');
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/auth/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...newStudent, teacherId: teacher._id })
            });
            const data = await res.json();
            if (data.success) {
                const info = { name: newStudent.name, classGrade: newStudent.classGrade, studentId: data.studentId };
                setCreatedStudentInfo(info);
                setCreatedStudentsList(prev => [info, ...prev]);
                setNewStudent({ name: '', classGrade: '' });
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create student' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/quizzes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newQuiz)
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Quiz created successfully!' });
                setNewQuiz({ title: '', chapterTitle: '', subject: '', classGrade: '', questions: [{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, points: 10 }] });
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create quiz' });
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [...newQuiz.questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, points: 10 }]
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [0.05, 0.1, 0.05],
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute w-96 h-96 bg-indigo-100 rounded-full blur-3xl"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-indigo-900 text-white p-6 flex flex-col gap-8 shadow-xl z-10">
                <div className="text-2xl font-black flex items-center gap-2 tracking-tighter uppercase">
                    <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-lg">EQ</span>
                    EduQuest
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'students' ? 'bg-white text-indigo-900' : 'hover:bg-white/10'}`}
                    >
                        <FaUsers /> Students
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'quizzes' ? 'bg-white text-indigo-900' : 'hover:bg-white/10'}`}
                    >
                        <FaBook /> Quizzes
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-white text-indigo-900' : 'hover:bg-white/10'}`}
                    >
                        <FaCheckCircle /> Requests
                        {pendingStudents.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {pendingStudents.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-indigo-900' : 'hover:bg-white/10'}`}
                    >
                        <FaGift /> Reward Orders
                    </button>
                    <button
                        onClick={() => navigate('/teacher/add-question')}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10`}
                    >
                        <FaPlus /> Gamified Questions
                    </button>
                </nav>

                <div className="mt-auto border-t border-white/20 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                            {teacher?.name?.charAt(0)}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold truncate w-32">{teacher?.name}</p>
                            <p className="opacity-70 text-xs">{teacher?.teacherId}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-red-200 hover:text-red-400 transition-colors"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow p-10 overflow-auto">
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
                    >
                        {message.type === 'success' ? <FaCheckCircle /> : <FaTrash />}
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto opacity-50 hover:opacity-100">×</button>
                    </motion.div>
                )}

                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight capitalize">
                            {activeTab} Management
                        </h1>
                        <p className="text-gray-500 mt-2">Manage your {activeTab} and platform activities.</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'students' && (
                        <motion.div
                            key="students"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FaUserPlus className="text-primary" /> Create New Student
                            </h3>
                            <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Class/Grade</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Grade 10"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        value={newStudent.classGrade}
                                        onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        disabled={loading}
                                        className="bg-primary text-white font-bold py-4 px-8 rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Register Student & Generate ID'}
                                    </button>
                                </div>
                            </form>

                            {/* Created Student ID Display */}
                            <AnimatePresence>
                                {createdStudentInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-6 bg-green-50 border-2 border-green-300 rounded-2xl"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <FaCheckCircle className="text-green-600 text-xl" />
                                            <p className="font-bold text-green-800 text-lg">Student Created Successfully!</p>
                                        </div>
                                        <p className="text-sm text-green-700 mb-1"><span className="font-bold">Name:</span> {createdStudentInfo.name}</p>
                                        <p className="text-sm text-green-700 mb-3"><span className="font-bold">Class:</span> {createdStudentInfo.classGrade}</p>
                                        <div className="flex items-center gap-3 bg-white border border-green-200 p-4 rounded-xl">
                                            <FaIdCard className="text-primary text-2xl" />
                                            <div className="flex-grow">
                                                <p className="text-xs text-gray-500 font-bold uppercase">Student Login ID</p>
                                                <p className="text-2xl font-black tracking-widest text-primary">{createdStudentInfo.studentId}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCopyId(createdStudentInfo.studentId)}
                                                className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-xl hover:bg-primary/90 transition-all"
                                            >
                                                <FaCopy /> {copied ? 'Copied!' : 'Copy ID'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-green-600 mt-2">⚠️ Share this ID with the student. They will use it to log in.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Previously Created Students List */}
                            {createdStudentsList.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><FaUsers className="text-primary" /> Created This Session</h4>
                                    <div className="space-y-3">
                                        {createdStudentsList.map((s, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                                <div>
                                                    <p className="font-bold text-gray-800">{s.name}</p>
                                                    <p className="text-xs text-gray-500">{s.classGrade}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-bold text-primary text-lg tracking-wider">{s.studentId}</span>
                                                    <button
                                                        onClick={() => handleCopyId(s.studentId)}
                                                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                        title="Copy ID"
                                                    >
                                                        <FaCopy />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'quizzes' && (
                        <motion.div
                            key="quizzes"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FaPlus className="text-secondary" /> Create New Quiz
                            </h3>
                            <form onSubmit={handleCreateQuiz}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Quiz Title</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Science Part 1"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                            value={newQuiz.title}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Chapter Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Solar System"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                            value={newQuiz.chapterTitle}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, chapterTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Subject</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Physics"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                            value={newQuiz.subject}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Class Grade</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Grade 10"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                            value={newQuiz.classGrade}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, classGrade: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t font-sans">
                                    <h4 className="font-bold text-lg">Questions</h4>
                                    {newQuiz.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                            <input
                                                required
                                                placeholder={`Question ${qIdx + 1}`}
                                                className="w-full p-3 bg-white border rounded-xl"
                                                value={q.questionText}
                                                onChange={(e) => {
                                                    const qs = [...newQuiz.questions];
                                                    qs[qIdx].questionText = e.target.value;
                                                    setNewQuiz({ ...newQuiz, questions: qs });
                                                }}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="flex gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIdx}`}
                                                            checked={q.correctAnswerIndex === oIdx}
                                                            onChange={() => {
                                                                const qs = [...newQuiz.questions];
                                                                qs[qIdx].correctAnswerIndex = oIdx;
                                                                setNewQuiz({ ...newQuiz, questions: qs });
                                                            }}
                                                        />
                                                        <input
                                                            required
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            className="flex-grow p-2 text-sm border rounded-lg"
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const qs = [...newQuiz.questions];
                                                                qs[qIdx].options[oIdx] = e.target.value;
                                                                setNewQuiz({ ...newQuiz, questions: qs });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs font-bold text-gray-500">Points Win:</label>
                                                    <input
                                                        type="number"
                                                        className="w-16 p-1 text-sm border rounded"
                                                        value={q.points}
                                                        onChange={(e) => {
                                                            const qs = [...newQuiz.questions];
                                                            qs[qIdx].points = parseInt(e.target.value);
                                                            setNewQuiz({ ...newQuiz, questions: qs });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
                                    >
                                        <FaPlus size={12} /> Add Question
                                    </button>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        disabled={loading}
                                        className="bg-secondary text-white font-bold py-4 px-10 rounded-2xl hover:shadow-lg transition-all"
                                    >
                                        {loading ? 'Saving...' : 'Publish Quiz'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" /> Pending Approval ({pendingStudents.length})
                                </h3>

                                {pendingStudents.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 font-bold">
                                        No pending student requests.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {pendingStudents.map(student => (
                                            <div key={student._id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg">{student.name}</h4>
                                                    <p className="text-sm text-gray-500 font-medium">{student.email} • {student.classGrade}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleApproveStudent(student._id)}
                                                    disabled={loading}
                                                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-all shadow-md flex items-center gap-2"
                                                >
                                                    <FaCheckCircle /> Approve & Generate ID
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-indigo-900">
                                <FaGift className="text-secondary" /> Reward Order Management Panel
                            </h3>

                            {redemptions.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold text-lg">No reward orders found.</p>
                                    <p className="text-gray-400 text-sm mt-2">When students redeem items, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-50/50 text-indigo-900 text-sm font-bold tracking-wide uppercase border-b-2 border-indigo-100">
                                                <th className="py-4 px-4 rounded-tl-2xl">Student Details</th>
                                                <th className="py-4 px-4">Product Info</th>
                                                <th className="py-4 px-4">Order Date</th>
                                                <th className="py-4 px-4">Status</th>
                                                <th className="py-4 px-4 rounded-tr-2xl text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {redemptions.map(order => (
                                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800 text-base">{order.studentName || order.student?.name}</span>
                                                            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded w-fit mt-1">ID: {order.studentIdString || order.student?.studentId}</span>
                                                            <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5 mt-2">
                                                                {order.department && <span>Dept: <span className="font-semibold text-gray-700">{order.department}</span></span>}
                                                                {order.phoneNumber && <span>Phone: <span className="font-semibold text-gray-700">{order.phoneNumber}</span></span>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800">{order.item?.name}</span>
                                                            <span className="text-xs font-bold text-yellow-600 flex items-center gap-1 mt-1">
                                                                <FaCoins /> {order.cost} Coins
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-700">{new Date(order.redeemedAt).toLocaleDateString()}</span>
                                                            <span className="text-xs text-gray-400">{new Date(order.redeemedAt).toLocaleTimeString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center w-fit gap-1.5
                                                            ${order.status === 'collected' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                                order.status === 'delivered' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'
                                                            }`}>
                                                            {order.status === 'collected' && <FaCheckCircle />}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        {order.status !== 'collected' && order.status !== 'cancelled' ? (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order._id, 'collected')}
                                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md shadow-green-500/20 active:scale-95 flex items-center gap-2 ml-auto"
                                                            >
                                                                <FaCheckCircle /> Mark Collected
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs font-bold text-gray-400 italic">No actions</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default TeacherDashboard;
