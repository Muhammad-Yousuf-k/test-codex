import { useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { setUser } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    const payload = isSignup ? form : { email: form.email, password: form.password };
    const { data } = await api.post(endpoint, payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  return (
    <main className="auth">
      <h1>{isSignup ? 'Create account' : 'Welcome back'}</h1>
      <form onSubmit={submit}>
        {isSignup && <input placeholder="username" onChange={(e) => setForm({ ...form, username: e.target.value })} />}
        <input placeholder="email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Continue</button>
      </form>
      <button onClick={() => setIsSignup((v) => !v)}>{isSignup ? 'Have an account?' : 'Need an account?'}</button>
    </main>
  );
}
