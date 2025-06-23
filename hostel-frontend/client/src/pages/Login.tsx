import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const api = "http://localhost:5000/api";
  const handleLogin = async () => {
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='bg-white p-8 shadow-md rounded-md w-full max-w-sm'>
        <h2 className='text-xl font-bold mb-4'>Login</h2>
        <input
          className='w-full p-2 mb-3 border rounded'
          placeholder='Username'
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className='w-full p-2 mb-3 border rounded'
          type='password'
          placeholder='Password'
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={handleLogin} className='bg-blue-600 text-white w-full py-2 rounded'>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
