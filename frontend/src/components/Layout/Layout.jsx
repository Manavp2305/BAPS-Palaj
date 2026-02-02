import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiMenu } from 'react-icons/hi';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            {/* Mobile Header */}
            <div className="md:hidden bg-indigo-800 text-white p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Yuvak Mandal</h1>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded hover:bg-indigo-700"
                >
                   <HiMenu className="h-6 w-6" />
                </button>
            </div>

            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <Outlet />
            </div>
            
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
