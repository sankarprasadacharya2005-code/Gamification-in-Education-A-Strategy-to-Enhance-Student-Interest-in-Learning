const Word = require('../models/Word');
const User = require('../models/User');

const scramble = (word) => {
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    if (scrambled.join('') === word && word.length > 1) return scramble(word);
    return scrambled.join('');
};

exports.getRandomWord = async (req, res) => {
    try {
        const count = await Word.countDocuments();
        if (count === 0) {
            const defaults = [
                { word: 'REACT', hint: 'A popular frontend library', difficulty: 'Easy' },
                { word: 'MONGO', hint: 'A NoSQL database', difficulty: 'Easy' },
                { word: 'PLANET', hint: 'Earth is one of these', difficulty: 'Medium' },
                { word: 'GALAXY', hint: 'Milky Way is an example', difficulty: 'Medium' },
                { word: 'BRAIN', hint: 'The command center of your body', difficulty: 'Hard' }
            ];
            await Word.insertMany(defaults);
        }

        const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);
        const wordData = randomWord[0];

        res.json({
            success: true,
            scrambled: scramble(wordData.word),
            hint: wordData.hint,
            wordId: wordData._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyGuess = async (req, res) => {
    try {
        const { wordId, guess } = req.body;
        const wordDoc = await Word.findById(wordId);

        if (!wordDoc) return res.status(404).json({ success: false, message: 'Word not found' });

        if (wordDoc.word === guess.toUpperCase()) {
            const user = await User.findById(req.user.id);
            const reward = 10;
            user.coins += reward;
            user.xp += 5;

            user.coinHistory.push({
                balance: user.coins,
                source: 'wordgame',
                timestamp: new Date()
            });

            await user.save();

            res.json({
                success: true,
                message: 'Correct! You won 10 coins!',
                newBalance: { coins: user.coins, xp: user.xp },
                coinHistory: user.coinHistory
            });
        } else {
            res.json({
                success: false,
                message: 'Wrong guess! Try again.'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
