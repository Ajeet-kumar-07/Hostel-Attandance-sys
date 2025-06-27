import React from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `px-4 py-2 transition duration-300 rounded-md ${
      location.pathname === path
        ? 'bg-blue-600 text-white font-semibold'
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-700">
        <Link to="/dashboard">🏠 HostelSys</Link>
      </div>

      {/* Center Links */}
      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
        <Link to="/students" className={navLinkClass('/students')}>Students</Link>
        <Link to="/attendance" className={navLinkClass('/attendance')}>Attendance</Link>
        {/* <Link to="/late-entries" className={navLinkClass('/admin-late-entries')}>Late Entries</Link> */}

      </div>
      {/* Right Side: Register & Logout */}
      <div className="flex items-center gap-3">
        <Link to="/register" className={navLinkClass('/register')}>Register</Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            toast.info('Logged out');
            window.location.href = '/login';
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;