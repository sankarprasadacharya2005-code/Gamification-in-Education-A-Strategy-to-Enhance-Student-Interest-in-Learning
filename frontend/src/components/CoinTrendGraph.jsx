import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';

const CoinTrendGraph = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-indigo-50 text-center text-gray-400 font-medium">
                No coin history available yet. Play games to see your growth!
            </div>
        );
    }

    // Format data for Recharts
    const data = history.map((entry) => ({
        name: new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        fullDate: new Date(entry.timestamp).toLocaleString(),
        coins: entry.balance,
        source: entry.source.charAt(0).toUpperCase() + entry.source.slice(1),
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-xl rounded-2xl border border-indigo-50">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">
                        {payload[0].payload.fullDate}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-gray-800">{payload[0].value}</span>
                        <span className="text-sm font-bold text-yellow-600">Coins</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-1">
                        Source: <span className="text-indigo-600">{payload[0].payload.source}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-black text-gray-800">Coin Growth Trend</h3>
                    <p className="text-sm text-gray-500 font-medium">Visualizing your progress over time</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-tighter">
                    Total Entries: {history.length}
                </div>
            </div>

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                        <Area
                            type="monotone"
                            dataKey="coins"
                            stroke="#4f46e5"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorCoins)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CoinTrendGraph;
