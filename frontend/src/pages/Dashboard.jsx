import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/dashboard', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

    const COLORS = ['#0088FE', '#FF8042']; // P, A

    const pieData = stats?.latestInfo ? [
        { name: 'Present', value: stats.latestInfo.Present },
        { name: 'Absent', value: stats.latestInfo.Absent },
    ] : [];

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                <p className="text-gray-500">Here's what's happening today.</p>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Members</h3>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">{stats?.totalMembers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Latest Attendance</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                        {stats?.latestInfo ? `${stats.latestInfo.percentage.toFixed(1)}%` : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stats?.latestInfo?.date}</p>
                </div>
                {/* Placeholder for other stats */}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4">attendance Trend (Last 4 Weeks)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Present" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="Absent" stroke="#ff7300" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Latest Session Breakdown</h3>
                     <div className="h-64 flex justify-center items-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p>No data available</p>}
                    </div>
                </div>
            </div>

            {/* Top Members */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                 <h3 className="text-lg font-bold mb-4">Top Regular Members</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sessions Attended</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.topMembers?.map((m, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{m.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
