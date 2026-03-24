require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Chapter = require('./models/Chapter');

const TEACHER_ID = '69a352bba765e5caf07ea9f3';

const aptitudeQuestions = [
    { questionText: "If the cost of 5 pens is ₹100, what is the cost of 1 pen?", options: ["₹15", "₹20", "₹25", "₹30"], correctAnswerIndex: 1, points: 10 },
    { questionText: "A train travels 120 km in 2 hours. What is its speed?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], correctAnswerIndex: 2, points: 10 },
    { questionText: "What is 25% of 200?", options: ["25", "40", "50", "75"], correctAnswerIndex: 2, points: 10 },
    { questionText: "The average of 10, 20, and 30 is:", options: ["10", "20", "30", "40"], correctAnswerIndex: 1, points: 10 },
    { questionText: "If a number is multiplied by 4 and the result is 80, the number is:", options: ["10", "20", "30", "40"], correctAnswerIndex: 1, points: 10 },
    { questionText: "Find the next number in the series: 2, 4, 8, 16, ?", options: ["18", "24", "32", "64"], correctAnswerIndex: 2, points: 10 },
    { questionText: "If 3 workers can complete a task in 6 days, how many days will 6 workers take?", options: ["2", "3", "4", "5"], correctAnswerIndex: 1, points: 10 },
    { questionText: "What is the square of 12?", options: ["124", "142", "144", "154"], correctAnswerIndex: 2, points: 10 },
    { questionText: "Find the missing number: 5, 10, 20, 40, ?", options: ["60", "70", "80", "90"], correctAnswerIndex: 2, points: 10 },
    { questionText: "If a shirt costs ₹500 and discount is 10%, what is the final price?", options: ["₹450", "₹470", "₹480", "₹490"], correctAnswerIndex: 0, points: 10 }
];

const reasoningQuestions = [
    { questionText: "Find the odd one out:", options: ["Dog", "Cat", "Tiger", "Car"], correctAnswerIndex: 3, points: 10 },
    { questionText: "If BOOK is written as CPPL, how is PEN written?", options: ["QFO", "QEO", "PFO", "QFN"], correctAnswerIndex: 0, points: 10 },
    { questionText: "Find the next letter in the series: A, C, E, G, ?", options: ["H", "I", "J", "K"], correctAnswerIndex: 1, points: 10 },
    { questionText: "If CAT = 24, DOG = 26, then BAT = ?", options: ["21", "22", "23", "24"], correctAnswerIndex: 2, points: 10 },
    { questionText: "Find the missing number: 3, 6, 9, 12, ?", options: ["14", "15", "16", "18"], correctAnswerIndex: 1, points: 10 },
    { questionText: "Find the odd word:", options: ["Apple", "Banana", "Mango", "Potato"], correctAnswerIndex: 3, points: 10 },
    { questionText: "If A = 1, B = 2, C = 3, what is the value of CAB?", options: ["6", "5", "4", "7"], correctAnswerIndex: 0, points: 10 },
    { questionText: "Find the next number: 1, 4, 9, 16, ?", options: ["20", "25", "30", "36"], correctAnswerIndex: 1, points: 10 },
    { questionText: "Find the odd number:", options: ["8", "27", "64", "100"], correctAnswerIndex: 3, points: 10 },
    { questionText: "If SUN = 18, MOON = 24, then STAR = ?", options: ["20", "19", "21", "22"], correctAnswerIndex: 2, points: 10 }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB for seeding...");

    // Create chapters if they don't exist
    let aptitudeChapter = await Chapter.findOne({ title: 'Aptitude Practice' });
    if (!aptitudeChapter) {
        aptitudeChapter = await Chapter.create({
            title: 'Aptitude Practice',
            content: 'General Aptitude Questions',
            subject: 'Aptitude',
            classGrade: 'General',
            author: TEACHER_ID
        });
    }

    let reasoningChapter = await Chapter.findOne({ title: 'Reasoning Practice' });
    if (!reasoningChapter) {
        reasoningChapter = await Chapter.create({
            title: 'Reasoning Practice',
            content: 'Logical Reasoning Questions',
            subject: 'Reasoning',
            classGrade: 'General',
            author: TEACHER_ID
        });
    }

    // Create Quizzes
    await Quiz.create({
        chapterId: aptitudeChapter._id,
        title: 'Basic Aptitude Set',
        questions: aptitudeQuestions,
        author: TEACHER_ID
    });

    await Quiz.create({
        chapterId: reasoningChapter._id,
        title: 'Basic Reasoning Set',
        questions: reasoningQuestions,
        author: TEACHER_ID
    });

    console.log("Aptitude and Reasoning quizzes seeded successfully!");
    process.exit();
}).catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
