import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');

    if (!email || !password) {
      setErr('Please enter email and password');
      return;
    }

    try {
      const res = await axios.post('/auth/login', { email, password });
      const token = res.data?.token;
      if (!token) throw new Error('No token received');
      onLoggedIn(token);
      navigate('/'); // root = dashboard
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.msg;

        if (status === 400) setErr(msg || 'Please enter email and password');
        else if (status === 401) setErr('Invalid password.');
        else if (status === 404) setErr('User does not exist. Please register.');
        else if (status === 409) setErr('User already exists');
        else if (status >= 500) setErr('Server error. Please try again later.');
        else setErr(msg || 'Something went wrong. Please try again.');
      } else if (error.request) {
        setErr('Network error. Please check your connection.');
      } else {
        setErr(error.message || 'Login failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700"
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>

        <p className="mt-3 text-sm">
          Don’t have an account? <Link to="/register" className="text-blue-400">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
