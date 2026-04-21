import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        await signUp(email, password, { full_name: name });
        toast.success('Account created! Please check your email.');
      }
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-charcoal min-h-screen pt-28 pb-20 px-5">
      <div className="max-w-sm mx-auto">
        <h1 className="font-display text-4xl text-ivory text-center mb-8">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-dark" placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-dark" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-dark" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-ivory/30 text-sm font-body mt-6">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-gold hover:underline">
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
