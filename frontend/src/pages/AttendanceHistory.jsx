import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const AttendanceHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            let query = '';
            if (startDate && endDate) {
                query = `?startDate=${startDate}&endDate=${endDate}`;
            }
            
            const { data } = await api.get(`/attendance/history${query}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchHistory();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Attendance History</h1>
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                            type="date" 
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input 
                            type="date" 
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Filter
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { setStartDate(''); setEndDate(''); fetchHistory(); }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Reset
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No records found</td></tr>
                        ) : (
                            history.map((record) => {
                                const presentCount = record.records.filter(r => r.status === 'Present').length;
                                const absentCount = record.records.filter(r => r.status === 'Absent').length;
                                const total = presentCount + absentCount;
                                const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;
                                
                                return (
                                    <tr key={record._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {format(new Date(record.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                            {presentCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                                            {absentCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {percentage}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;
