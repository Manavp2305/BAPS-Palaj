import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    HiHome, 
    HiUsers, 
    HiCalendar, 
    HiSpeakerphone, 
    HiLogout,
    HiX
} from 'react-icons/hi';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { logout, user } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: HiHome, path: '/' },
        { name: 'Members', icon: HiUsers, path: '/members' },
        { name: 'Attendance', icon: HiCalendar, path: '/attendance' },
        { name: 'History', icon: HiCalendar, path: '/history' },
        { name: 'Announcements', icon: HiSpeakerphone, path: '/announcements' },
    ];

    const closeSidebar = () => {
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-indigo-800 text-white transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:static md:inset-auto md:flex md:flex-col
        `}>
            <div className="p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">Yuvak Mandal</h1>
                    <p className="text-xs opacity-75 mt-1">Attendance System</p>
                    <div className="mt-4 text-sm bg-indigo-900 p-2 rounded hidden md:block">
                        User: {user?.name} <br/>
                        Role: <span className="uppercase">{user?.role}</span>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button onClick={closeSidebar} className="md:hidden text-indigo-300 hover:text-white">
                    <HiX className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => window.innerWidth < 768 && closeSidebar()}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-indigo-600 shadow-lg'
                                    : 'hover:bg-indigo-700'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-indigo-700">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                    <HiLogout className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
