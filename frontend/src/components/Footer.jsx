import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-indigo-50 pt-16 pb-8 px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white">
                            <FaGraduationCap size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-indigo-600 tracking-tighter uppercase">EduQuest</h2>
                    </div>
                    <p className="text-gray-500 max-w-sm leading-relaxed">
                        The ultimate gamified learning platform where education meets rewards. Level up your knowledge, earn coins, and redeem awesome gear!
                    </p>
                    <div className="flex gap-4">
                        {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ y: -3, scale: 1.1 }}
                                className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                                <Icon />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm mb-6">Explore</h3>
                    <ul className="space-y-4 text-gray-500 font-medium">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Courses</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Rewards Shop</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Leaderboard</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Quizzes</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm mb-6">Support</h3>
                    <ul className="space-y-4 text-gray-500 font-medium">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-400">
                <p>© 2026 EduQuest. All rights reserved.</p>
                <p className="flex items-center gap-2">
                    Made with <FaHeart className="text-red-400 animate-pulse" /> for learners worldwide
                </p>
            </div>
        </footer>
    );
};

export default Footer;
