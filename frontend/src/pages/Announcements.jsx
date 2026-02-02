import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiPaperAirplane } from 'react-icons/hi';
import { useForm } from 'react-hook-form';

const Announcements = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();
    const [sending, setSending] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAnnouncements(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const onSubmit = async (data) => {
        if (!window.confirm('Send to all active members?')) return;
        setSending(true);
        try {
            await api.post('/announcements', data, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Announcement broadcasted successfully!');
            reset();
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to send announcement');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Announcements</h1>

            {/* Create Section */}
            {user.role === 'admin' && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
                    <h2 className="text-lg font-semibold mb-4 text-indigo-700">Create New Announcement</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject / Title</label>
                            <input
                                {...register('title', { required: true })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="e.g. Next Sunday Sabha Time Change"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                {...register('message', { required: true })}
                                rows="4"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Type your message here..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={sending}
                                className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <HiPaperAirplane className={`mr-2 ${sending ? 'animate-pulse' : ''}`} />
                                {sending ? 'Sending...' : 'Send Broadcast'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* History List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Announcement History</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {announcements.map((item) => (
                        <li key={item._id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-indigo-600">{item.title}</p>
                                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{item.message}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Sent: {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Sent: {item.sentCount}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                    {announcements.length === 0 && !loading && (
                        <li className="p-4 text-center text-gray-500">No announcements sent yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Announcements;
