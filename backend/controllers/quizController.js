const Quiz = require('../models/Quiz');
const Chapter = require('../models/Chapter');
const User = require('../models/User');

exports.createQuiz = async (req, res) => {
    try {
        const { title, chapterTitle, subject, classGrade, questions } = req.body;
        const teacherId = req.user.id;

        let chapter = await Chapter.findOne({ title: chapterTitle, subject, classGrade });
        if (!chapter) {
            chapter = await Chapter.create({
                title: chapterTitle,
                content: `Quizzes for ${chapterTitle}`,
                subject,
                classGrade,
                author: teacherId
            });
        }

        const newQuiz = await Quiz.create({
            chapterId: chapter._id,
            title,
            questions,
            author: teacherId
        });

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz: newQuiz
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTeacherQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ author: req.user.id }).populate('chapterId');
        res.json({ success: true, quizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAvailableQuizzes = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const quizzes = await Quiz.find().populate('chapterId');

        const filteredQuizzes = quizzes.filter(quiz => {
            if (!quiz.chapterId) return false;

            const quizGrade = (quiz.chapterId.classGrade || '').trim().toLowerCase();
            const studentGrade = (student.classGrade || '').trim().toLowerCase();

            // Match if same grade (case-insensitive) or if quiz is marked as Global
            const isGradeMatch = quizGrade === studentGrade || quizGrade === 'global';

            // Match if the author is the student's assigned teacher
            const isTeacherMatch = quiz.author && student.teacher && quiz.author.toString() === student.teacher.toString();

            const isMatch = isGradeMatch || isTeacherMatch;

            if (isMatch) {
                console.log(`[QUIZ] Match found: "${quiz.title}" for student "${student.name}" (Grade Match: ${isGradeMatch}, Teacher Match: ${isTeacherMatch})`);
            }
            return isMatch;
        });

        res.json({ success: true, quizzes: filteredQuizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        let score = 0;
        let totalPoints = 0;

        quiz.questions.forEach((q, idx) => {
            if (q.correctAnswerIndex === answers[idx]) {
                score += q.points;
            }
            totalPoints += q.points;
        });

        const user = await User.findById(req.user.id);
        user.coins += score;
        user.xp += Math.floor(score / 2);

        user.quizHistory.push({
            quizId,
            score,
            totalPoints,
            completedAt: new Date()
        });

        user.coinHistory.push({
            balance: user.coins,
            source: 'quiz',
            timestamp: new Date()
        });

        await user.save();

        res.json({
            success: true,
            score,
            totalPoints,
            coinsAwarded: score,
            xpAwarded: Math.floor(score / 2),
            newBalance: { coins: user.coins, xp: user.xp },
            coinHistory: user.coinHistory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
