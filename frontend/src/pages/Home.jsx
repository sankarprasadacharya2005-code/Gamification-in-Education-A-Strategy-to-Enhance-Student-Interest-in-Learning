import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 p-8"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-block text-primary mb-6"
                >
                    <FaGraduationCap size={80} />
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-900 mb-6 tracking-tighter">
                    EduQuest: Learn, Play & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Earn Rewards</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    "Education is the most powerful weapon which you can use to change the world."
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to="/student/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:shadow-primary/50 transition-all w-full sm:w-auto"
                        >
                            Student Portal
                        </motion.button>
                    </Link>

                    <Link to="/teacher/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold text-lg shadow-lg hover:bg-primary/5 transition-all w-full sm:w-auto"
                        >
                            Teacher Login
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
