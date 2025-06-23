import React from 'react';
import {toast} from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white ${
      location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-800'
    }`;

  return (
    <nav className='bg-white shadow-md p-4 flex items-center justify-between'>
      {/* Logo */}
      <div className='text-2xl font-bold text-blue-700'>
        <Link to='/dashboard'>🏠 HostelSys</Link>
      </div>
        <button
        onClick={() => {
        localStorage.removeItem('token');
        toast.info('Logged out');
        window.location.href = '/login';
        }}
         className="px-3 py-1 rounded bg-red-500 text-white ml-4"
        >
        Logout
        </button>

      {/* Links */}
      <div className='space-x-4'>
        <Link to='/dashboard' className={navLinkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link to='/students' className={navLinkClass('/students')}>
          Students
        </Link>
        <Link to='/attendance' className={navLinkClass('/attendance')}>
          Attendance
        </Link>
      </div>
      <div>
        <Link to="/register" className={navLinkClass('/register')}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
