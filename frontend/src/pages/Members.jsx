import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';

const Members = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMember, setEditingMember] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get('/api/members', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMembers(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load members');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const onSubmit = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            if (editingMember) {
                await axios.put(`/api/members/${editingMember._id}`, data, config);
                toast.success('Member updated successfully');
            } else {
                await axios.post('/api/members', data, config);
                toast.success('Member added successfully');
            }
            closeModal();
            fetchMembers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const deleteMember = async (id) => {
        // if (!window.confirm('Are you sure?')) return; // REMOVED
        try {
            await axios.delete(`/api/members/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Member removed');
            fetchMembers();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const openModal = (member = null) => {
        setEditingMember(member);
        if (member) {
            setValue('name', member.name);
            setValue('email', member.email || '');
            setValue('mobile', member.mobile || '');
            setValue('active', member.active);
        } else {
            reset({ name: '', email: '', mobile: '', active: true });
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditingMember(null);
        reset();
    };

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Member Management</h1>
                {user.role === 'admin' && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <HiPlus className="mr-2" /> Add Member
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 border"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                        <li key={member._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{member.name}</p>
                                <div className="text-sm text-gray-500">
                                    {member.email && <span className="mr-4">{member.email}</span>}
                                    {member.mobile && <span>{member.mobile}</span>}
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {member.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {user.role === 'admin' && (
                                <div className="flex space-x-2">
                                    <button onClick={() => openModal(member)} className="text-gray-400 hover:text-indigo-600">
                                        <HiPencil className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => deleteMember(member._id)} className="text-gray-400 hover:text-red-600">
                                        <HiTrash className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                    {filteredMembers.length === 0 && !loading && (
                        <li className="px-6 py-4 text-center text-gray-500">No members found</li>
                    )}
                </ul>
            </div>

            {/* Modal */}
            <Dialog open={isOpen} onClose={closeModal} className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="relative bg-white rounded-lg max-w-sm w-full mx-auto p-6 shadow-xl z-20">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            {editingMember ? 'Edit Member' : 'Add New Member'}
                        </Dialog.Title>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input {...register('name', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input {...register('email')} type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                <input {...register('mobile')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="flex items-center">
                                <input {...register('active')} type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">Active Member</label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Members;
