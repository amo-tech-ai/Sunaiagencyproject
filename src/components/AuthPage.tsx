// C91-AUTH-PAGE — Login / Signup Page
// BCG consulting-inspired: warm off-white bg, Georgia headlines, green accents
// Two-column on desktop (brand + form), single-column on mobile

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router';
import { Sun, ArrowRight, Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const { signIn, signUp, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user && !loading) {
      navigate('/wizard');
    }
  }, [user, loading, navigate]);

  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (mode === 'signup' && !name.trim()) return 'Name is required';
    return null;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    let result: { success: boolean; error?: string };
    if (mode === 'login') {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password, name);
    }

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/wizard'), 800);
    } else {
      setLocalError(result.error || 'Something went wrong');
    }
  }, [mode, email, password, name, signIn, signUp, clearError, navigate]);

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setLocalError(null);
    clearError();
    setSuccess(false);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Left brand panel — desktop only */}
      <div
        className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-12"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16">
            <Sun className="w-6 h-6" style={{ color: '#00875A' }} />
            <span style={{ fontFamily: 'Georgia, serif', color: '#FFFFFF', fontSize: '1.1rem' }}>
              Sun AI Agency
            </span>
          </Link>

          <h1
            className="text-3xl leading-tight mb-6"
            style={{ fontFamily: 'Georgia, serif', color: '#FFFFFF', fontWeight: 400 }}
          >
            Your AI transformation
            <br />starts here.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#9CA39B' }}>
            Sign in to save your progress, access personalized AI recommendations,
            and collaborate with your team on implementation roadmaps.
          </p>

          <div className="mt-12 space-y-4">
            {[
              'Wizard progress saved to cloud',
              'AI-powered readiness assessments',
              'Team collaboration on roadmaps',
              'Dashboard with project tracking',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(0, 135, 90, 0.2)' }}
                >
                  <Check className="w-3 h-3" style={{ color: '#00875A' }} />
                </div>
                <span className="text-sm" style={{ color: '#C4C4BC' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#6B6B63' }}>
          &copy; 2026 Sun AI Agency. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-2">
              <Sun className="w-5 h-5" style={{ color: '#00875A' }} />
              <span style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontSize: '1.05rem' }}>
                Sun AI Agency
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: '#00875A', letterSpacing: '0.1em' }}
              >
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </p>
              <h2
                className="text-2xl mb-1"
                style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}
              >
                {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-sm mb-8" style={{ color: '#6B6B63' }}>
                {mode === 'login'
                  ? 'Enter your credentials to continue where you left off.'
                  : 'Set up your account to save your AI transformation progress.'
                }
              </p>

              {/* Error */}
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 flex items-start gap-2 px-3 py-2.5 border rounded text-sm"
                  style={{
                    borderColor: '#DC2626',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    borderRadius: '4px',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{displayError}</span>
                </motion.div>
              )}

              {/* Success */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 flex items-center gap-2 px-3 py-2.5 border rounded text-sm"
                  style={{
                    borderColor: '#00875A',
                    backgroundColor: '#E6F4ED',
                    color: '#00875A',
                    borderRadius: '4px',
                  }}
                >
                  <Check className="w-4 h-4" />
                  <span>{mode === 'login' ? 'Signed in!' : 'Account created!'} Redirecting…</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#6B6B63' }}>
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-3 py-2.5 text-sm border rounded outline-none transition-colors"
                      style={{
                        borderColor: '#E8E8E4',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00875A'}
                      onBlur={e => e.target.style.borderColor = '#E8E8E4'}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#6B6B63' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2.5 text-sm border rounded outline-none transition-colors"
                    style={{
                      borderColor: '#E8E8E4',
                      borderRadius: '4px',
                      backgroundColor: '#FFFFFF',
                      color: '#1A1A1A',
                    }}
                    onFocus={e => e.target.style.borderColor = '#00875A'}
                    onBlur={e => e.target.style.borderColor = '#E8E8E4'}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#6B6B63' }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 pr-10 text-sm border rounded outline-none transition-colors"
                      style={{
                        borderColor: '#E8E8E4',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00875A'}
                      onBlur={e => e.target.style.borderColor = '#E8E8E4'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" style={{ color: '#9CA39B' }} />
                        : <Eye className="w-4 h-4" style={{ color: '#9CA39B' }} />
                      }
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs mt-1" style={{ color: '#9CA39B' }}>
                      Minimum 6 characters
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded transition-all"
                  style={{
                    backgroundColor: success ? '#E6F4ED' : loading ? '#9CA39B' : '#1A1A1A',
                    color: success ? '#00875A' : '#FFFFFF',
                    borderRadius: '4px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading || success ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!loading && !success) e.currentTarget.style.backgroundColor = '#00875A';
                  }}
                  onMouseLeave={e => {
                    if (!loading && !success) e.currentTarget.style.backgroundColor = '#1A1A1A';
                  }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : success ? (
                    <><Check className="w-4 h-4" /> Success</>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode switch */}
              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: '#6B6B63' }}>
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    onClick={switchMode}
                    className="underline transition-colors"
                    style={{ color: '#00875A' }}
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex-1 border-t" style={{ borderColor: '#E8E8E4' }} />
                <span className="text-xs" style={{ color: '#9CA39B' }}>or</span>
                <div className="flex-1 border-t" style={{ borderColor: '#E8E8E4' }} />
              </div>

              {/* Continue as guest */}
              <Link
                to="/wizard"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm border rounded transition-colors hover:bg-gray-50"
                style={{
                  borderColor: '#E8E8E4',
                  color: '#6B6B63',
                  borderRadius: '4px',
                }}
              >
                Continue as Guest
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-xs text-center mt-2" style={{ color: '#9CA39B' }}>
                Guest progress is saved locally and can be linked to an account later.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}