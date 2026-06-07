'use client';

import { useStore } from '@/lib/store';
import { useAdminStore } from '@/lib/admin-store';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

type Step = 'email' | 'otp' | 'name';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, isLoggedIn } = useStore();
  const { generateOtp, verifyOtp, addRegisteredUser } = useAdminStore();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const normalizedEmail = email.trim().toLowerCase();
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.replace('/');
  }, [isLoggedIn]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const generatedOtp = generateOtp(normalizedEmail);
      await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail, otp: generatedOtp }) });
      setStep('otp');
      setResendTimer(60);
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const digits = [...otpDigits];
    digits[idx] = val.slice(-1);
    setOtpDigits(digits);
    setError('');
    // Auto-focus next
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
    // Auto-submit when all filled
    const full = digits.join('');
    if (full.length === 6) handleVerifyOtp(full);
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (code?: string) => {
    const finalOtp = code ?? otpDigits.join('');
    if (finalOtp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true);
    setError('');
    try {
      const valid = verifyOtp(normalizedEmail, finalOtp);
      if (!valid) {
        setError('Invalid or expired OTP. Please try again.');
        setOtpDigits(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        setLoading(false);
        return;
      }
      const storedUsers = JSON.parse(localStorage.getItem('amvi-users') || '{}');
      if (!storedUsers[normalizedEmail]) {
        setIsNewUser(true);
        setStep('name');
      } else {
        const user = storedUsers[normalizedEmail];
        setUser({ id: user.id, email: normalizedEmail, name: user.name, password: '', createdAt: new Date() });
        router.replace('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Enter your name'); return; }
    setLoading(true);
    const id = `u-${Date.now()}`;
    const storedUsers = JSON.parse(localStorage.getItem('amvi-users') || '{}');
    storedUsers[normalizedEmail] = { id, name };
    localStorage.setItem('amvi-users', JSON.stringify(storedUsers));
    await fetch('/api/send-welcome', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail, name }) });
    addRegisteredUser({ id, name, email: normalizedEmail, registeredAt: new Date().toISOString() });
    setUser({ id, email: normalizedEmail, name, password: '', createdAt: new Date() });
    setLoading(false);
    router.replace('/');
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    const generatedOtp = generateOtp(normalizedEmail);
    await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail, otp: generatedOtp }) });
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(60);
    setError('');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#f5f2ed' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-2xl font-extrabold" style={{ color: '#1e4a2a' }}>AMVI Organics</p>
          <p className="text-xs tracking-widest mt-1" style={{ color: '#c8922a' }}>NATURE'S TRUST, DELIVERED</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in / Register</h1>
                <p className="text-sm text-gray-500">We'll send a one-time password to your email</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-green-700 focus-within:border-transparent transition">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                      className="flex-1 text-sm outline-none bg-transparent"
                      placeholder="you@example.com" autoFocus />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-60"
                  style={{ background: '#1e4a2a' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                  {loading ? 'Sending OTP...' : <><span>Send OTP</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1">Enter OTP</h1>
                <p className="text-sm text-gray-500">
                  A 6-digit code was sent to <strong className="text-gray-700">{email}</strong>
                </p>
                <button onClick={() => { setStep('email'); setOtpDigits(['','','','','','']); setError(''); }}
                  className="text-xs mt-1 font-semibold" style={{ color: '#c8922a' }}>
                  ← Change email
                </button>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

              {/* 6-box OTP input */}
              <div className="flex gap-2 justify-center mb-6">
                {otpDigits.map((d, i) => (
                  <input key={i} id={`otp-${i}`}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOtpInput(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className="w-11 h-12 text-center text-xl font-bold border rounded-xl outline-none transition"
                    style={{
                      borderColor: d ? '#1e4a2a' : '#e5e5e5',
                      background: d ? '#f0faf2' : '#fff',
                      color: '#1e4a2a',
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button onClick={() => handleVerifyOtp()} disabled={loading || otpDigits.join('').length !== 6}
                className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-50 mb-4"
                style={{ background: '#1e4a2a' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                {loading ? 'Verifying...' : <><CheckCircle size={16} /><span>Verify OTP</span></>}
              </button>

              <div className="text-center">
                <button onClick={handleResend} disabled={resendTimer > 0 || loading}
                  className="flex items-center gap-1.5 mx-auto text-xs font-semibold transition disabled:opacity-50"
                  style={{ color: resendTimer > 0 ? '#aaa' : '#1e4a2a' }}>
                  <RefreshCw size={13} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>


            </>
          )}

          {/* ── Step 3: Name (new user) ── */}
          {step === 'name' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome! 🌿</h1>
                <p className="text-sm text-gray-500">You're new here. What should we call you?</p>
              </div>
              <form onSubmit={handleSetName} className="space-y-4">
                {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name</label>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="e.g. Priya Sharma" autoFocus />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60"
                  style={{ background: '#1e4a2a' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                  {loading ? 'Setting up...' : 'Get Started →'}
                </button>
              </form>
            </>
          )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          By continuing, you agree to our{' '}
          <a href="/terms-of-service" className="underline">Terms</a> &amp;{' '}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>
        </p>
      </div>
    </main>
  );
}
