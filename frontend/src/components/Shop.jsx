import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaCheckCircle, FaExclamationTriangle, FaShoppingBag, FaHistory, FaGift } from 'react-icons/fa';

const Shop = ({ student, setStudent }) => {
    const [items, setItems] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'history'

    // Order Form State
    const [orderForm, setOrderForm] = useState({
        studentName: student?.name || '',
        studentIdString: student?.studentId || '',
        department: student?.classGrade || '',
        phoneNumber: ''
    });

    // Mock images based on the requested Black theme since we might not have actual paths
    // Defaulting to a black geometric placeholder if not found
    const getProductImage = (type) => {
        const fallbacks = {
            hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
            backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
            pen: 'https://images.unsplash.com/photo-1583485088034-697b5a69f000?auto=format&fit=crop&q=80&w=400',
            bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
            diary: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400'
        };
        return fallbacks[type] || 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80&w=400';
    };

    useEffect(() => {
        fetchItems();
        if (activeTab === 'history') {
            // Note: student might not have redemptions directly in this mock, we fetch them
            // or we use student.coinHistory for now if a specific route isn't available for students.
        }
    }, [activeTab]);

    const fetchItems = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/shop', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.items);
            }
        } catch (error) {
            console.error('Failed to fetch shop items');
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    const handleRedeem = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/shop/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: selectedProduct._id,
                    studentName: orderForm.studentName,
                    studentIdString: orderForm.studentIdString,
                    department: orderForm.department,
                    phoneNumber: orderForm.phoneNumber
                })
            });

            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'Your reward order has been placed successfully. Collect it from the teacher.' });
                const updatedUser = {
                    ...student,
                    coins: data.newBalance.coins,
                    coinHistory: data.coinHistory || student.coinHistory
                };
                setStudent(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                setTimeout(() => {
                    setSelectedProduct(null);
                    setStatus({ type: '', message: '' });
                }, 2000);
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Transaction failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-20 font-sans">
            {/* Gamified Blue Header */}
            <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5bbb] shadow-md pb-16 pt-8 px-4 sm:px-8 relative overflow-hidden">
                {/* Gamified abstract shapes inside header */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-3xl mix-blend-screen opacity-50 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
                    <div className="flex items-center gap-4 mb-6 md:mb-0">
                        <div className="bg-white p-3 rounded-full text-[#2874f0] shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            <FaShoppingBag className="text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Student Reward Shop</h1>
                            <p className="text-blue-200 text-sm font-medium mt-1 tracking-wide">Exchange your hard-earned coins for premium gear</p>
                        </div>
                    </div>

                    {/* Coin Wallet Display */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-yellow-500"
                    >
                        <motion.div
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="text-yellow-500 text-3xl drop-shadow-[0_2px_5px_rgba(234,179,8,0.5)]"
                        >
                            <FaCoins />
                        </motion.div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wallet Balance</p>
                            <p className="text-2xl font-black text-[#2874f0]">{student?.coins || 0}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto -mt-8 relative z-20 px-4 sm:px-8">
                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'shop' ? 'bg-[#2874f0] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaGift /> Rewards
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-[#2874f0] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaHistory /> Order History
                    </button>
                </div>

                {activeTab === 'shop' ? (
                    /* Products Grid */
                    fetching ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2874f0] border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((item) => (
                                <motion.div
                                    key={item._id}
                                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col transition-all duration-300 group"
                                >
                                    {/* Product Image area */}
                                    <div className="relative h-48 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.4 }}
                                            src={getProductImage(item.imageType)}
                                            alt={item.name}
                                            className="h-full w-full object-cover rounded-xl shadow-sm relative z-10"
                                        />
                                        {item.stock < 10 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full z-20">
                                                Hurry! Only {item.stock} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-[#2874f0] transition-colors">{item.name}</h3>
                                        <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[32px]">{item.description}</p>

                                        <div className="mt-auto">
                                            <div className="flex items-center gap-1.5 mb-4">
                                                <FaCoins className="text-yellow-500 text-xl" />
                                                <span className="font-black text-2xl text-gray-800">{item.costInCoins}</span>
                                            </div>

                                            <button
                                                onClick={() => setSelectedProduct(item)}
                                                className="w-full bg-[#fb641b] hover:bg-[#f35200] text-white font-bold py-3 rounded-xl transition-colors shadow-[0_4px_10px_rgba(251,100,27,0.3)] flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                Redeem Now <FaGift />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Order History Tab */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaHistory className="text-[#2874f0]" /> Your Recent Activity
                        </h2>
                        {student.coinHistory && student.coinHistory.length > 0 ? (
                            <div className="space-y-4">
                                {student.coinHistory.slice().reverse().filter(h => h.source.includes('Redeemed')).map((historyItem, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-3 rounded-full text-green-500 shadow-sm">
                                                <FaCheckCircle />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{historyItem.source}</p>
                                                <p className="text-xs font-medium text-gray-500">{new Date(historyItem.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-500 uppercase text-sm">Coins Deducted</p>
                                            <p className="text-gray-400 text-xs mt-1">Bal: {historyItem.balance}</p>
                                        </div>
                                    </div>
                                ))}
                                {student.coinHistory.filter(h => h.source.includes('Redeemed')).length === 0 && (
                                    <div className="text-center py-10 text-gray-400">
                                        <FaGift className="text-4xl mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No redemptions yet. Start shopping!</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <FaHistory className="text-4xl mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No history available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Redeem Confirmation Popup Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loading && setSelectedProduct(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            {/* Decorative header shape */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#2874f0]/10 to-transparent"></div>

                            {!status.type ? (
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-md border border-gray-100 flex-shrink-0">
                                            <img src={getProductImage(selectedProduct.imageType)} alt={selectedProduct.name} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800 leading-tight">Order Details</h3>
                                            <p className="text-sm font-medium text-[#2874f0]">{selectedProduct.name}</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 rounded-xl p-3 mb-6 flex justify-between items-center border border-yellow-100">
                                        <span className="text-yellow-800 font-bold uppercase text-xs tracking-wider">Required Coins</span>
                                        <div className="flex items-center gap-1">
                                            <FaCoins className="text-yellow-500 text-lg" />
                                            <span className="text-xl font-black text-gray-800">{selectedProduct.costInCoins}</span>
                                        </div>
                                    </div>

                                    <form className="space-y-4 mb-8" onSubmit={(e) => { e.preventDefault(); handleRedeem(); }}>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Student Name</label>
                                            <input type="text" required value={orderForm.studentName} onChange={(e) => setOrderForm({ ...orderForm, studentName: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 font-medium focus:ring-2 focus:ring-[#2874f0] focus:border-transparent outline-none transition-all" placeholder="Enter full name" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Student ID</label>
                                                <input type="text" required value={orderForm.studentIdString} onChange={(e) => setOrderForm({ ...orderForm, studentIdString: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 font-medium focus:ring-2 focus:ring-[#2874f0] focus:border-transparent outline-none transition-all" placeholder="ID Number" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Department</label>
                                                <input type="text" required value={orderForm.department} onChange={(e) => setOrderForm({ ...orderForm, department: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 font-medium focus:ring-2 focus:ring-[#2874f0] focus:border-transparent outline-none transition-all" placeholder="Class/Dept" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                                            <input type="tel" required value={orderForm.phoneNumber} onChange={(e) => setOrderForm({ ...orderForm, phoneNumber: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 font-medium focus:ring-2 focus:ring-[#2874f0] focus:border-transparent outline-none transition-all" placeholder="Contact number" />
                                        </div>

                                        {/* Invisible submit button to allow enter key submission */}
                                        <button type="submit" className="hidden">Submit</button>
                                    </form>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProduct(null)}
                                            disabled={loading}
                                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRedeem}
                                            disabled={loading}
                                            className="flex-1 px-4 py-3 bg-[#fb641b] hover:bg-[#f35200] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Submit Order'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative z-10 text-center py-6"
                                >
                                    <div className={`w-20 h-20 mx-auto flex flex-col items-center justify-center rounded-full mb-6 ${status.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                        {status.type === 'success' ? <FaCheckCircle className="text-4xl" /> : <FaExclamationTriangle className="text-4xl" />}
                                    </div>
                                    <h3 className={`text-xl font-black mb-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                        {status.type === 'success' ? 'Order Successful!' : 'Checkout Failed'}
                                    </h3>
                                    <p className="text-gray-600 font-medium mb-8 px-4 leading-relaxed">{status.message}</p>

                                    <button
                                        onClick={() => { setSelectedProduct(null); setStatus({ type: '', message: '' }); }}
                                        className="w-full py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-xl transition-colors"
                                    >
                                        Close Window
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
