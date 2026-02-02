import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Attendance = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [members, setMembers] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({}); // { memberId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(false);

    // 1. Fetch Active Members
    const fetchMembers = async () => {
        try {
            const { data } = await axios.get('/api/members', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const activeMembers = data.filter(m => m.active);
            setMembers(activeMembers);
            return activeMembers;
        } catch (error) {
            toast.error('Failed to load members');
            return [];
        }
    };

    // 2. Fetch Attendance for Date
    const fetchAttendance = async () => {
        setLoading(true);
        try {
            // First ensure we have members
            const currentMembers = members.length > 0 ? members : await fetchMembers();
            
            // Init map with 'Absent' default
            const initialMap = {};
            currentMembers.forEach(m => initialMap[m._id] = 'Absent');

            const { data } = await axios.get(`/api/attendance/${date}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (data && data.records) {
                // Merge existing records
                data.records.forEach(r => {
                    initialMap[r.memberId] = r.status;
                });
                // toast.info(`Loaded attendance for ${date}`); // REMOVED
            } else {
                // toast.info('No existing record. New entry.'); // REMOVED
            }
            
            setAttendanceMap(initialMap);
        } catch (error) {
            console.error(error);
            toast.error('Error loading attendance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date]); // Reload when date changes

    const toggleStatus = (id) => {
        if (user.role !== 'admin') return;
        setAttendanceMap(prev => ({
            ...prev,
            [id]: prev[id] === 'Present' ? 'Absent' : 'Present'
        }));
    };

    const markAll = (status) => {
        if (user.role !== 'admin') return;
        const newMap = { ...attendanceMap };
        Object.keys(newMap).forEach(key => newMap[key] = status);
        setAttendanceMap(newMap);
    };

    const saveAttendance = async () => {
        if (user.role !== 'admin') {
            toast.error('Only Admins can save attendance');
            return;
        }

        try {
            const records = Object.keys(attendanceMap).map(memberId => ({
                memberId,
                status: attendanceMap[memberId]
            }));

            await axios.post('/api/attendance', {
                date,
                records
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            toast.success('Attendance Saved Successfully');
        } catch (error) {
            toast.error('Failed to save attendance');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold">Attendance Management</h1>
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Select Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Actions & Stats */}
            {user.role === 'admin' && (
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Compact Bulk Controls */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500 mr-2">Set All:</span>
                        <button 
                            onClick={() => markAll('Present')} 
                            className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded border border-green-200 hover:bg-green-200 transition-colors"
                        >
                            Present
                        </button>
                        <button 
                            onClick={() => markAll('Absent')} 
                            className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded border border-red-200 hover:bg-red-200 transition-colors"
                        >
                            Absent
                        </button>
                    </div>

                    {/* Counts Display */}
                     <div className="flex space-x-3 text-sm font-bold">
                        <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100">
                             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                             Present: {Object.values(attendanceMap).filter(s => s === 'Present').length}
                        </div>
                        <div className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-100">
                             <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                             Absent: {Object.values(attendanceMap).filter(s => s === 'Absent').length}
                        </div>
                         <div className="flex items-center px-3 py-1 bg-gray-50 text-gray-700 rounded-lg border border-gray-200">
                             Total: {members.length}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button onClick={saveAttendance} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow font-bold text-sm tracking-wide transition-transform transform active:scale-95">
                        SAVE
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading Members...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-gray-50">
                        {members.map(member => {
                            const isPresent = attendanceMap[member._id] === 'Present';
                            return (
                                <div
                                    key={member._id}
                                    onClick={() => toggleStatus(member._id)}
                                    className={`
                                        cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all transform hover:shadow-md
                                        ${isPresent 
                                            ? 'bg-green-100 border-green-300' 
                                            : 'bg-red-100 border-red-300'}
                                    `}
                                >
                                    <div>
                                        <p className={`font-bold ${isPresent ? 'text-green-900' : 'text-red-900'}`}>{member.name}</p>
                                        <p className={`text-xs ${isPresent ? 'text-green-700' : 'text-red-700'}`}>{member.mobile || 'No Mobile'}</p>
                                    </div>
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                                        ${isPresent ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                                    `}>
                                        {isPresent ? 'P' : 'A'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
