import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

/* ── validation ─────────────────────────────────────────────────────────────── */
const validate = ({ email, password }) => {
  const errs = {};
  if (!email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
  if (!password) errs.password = 'Password is required';
  else if (password.length < 6) errs.password = 'At least 6 characters required';
  return errs;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      if (data.success) {
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🎉`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (decorative) ────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/70 to-secondary-700/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Plane size={28} className="text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Your Next Adventure<br />Starts Here
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-xs mx-auto">
              Log in to access your AI-generated trip plans, saved itineraries, and personalized travel insights.
            </p>
            <div className="mt-10 flex flex-col gap-3">
              {['AI-powered itineraries', 'Real-time weather info', 'Hotel & flight options'].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-accent-400 shrink-0" />
                  <span className="text-white/90 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-white to-primary-50/30">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
              <Plane size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-gray-900">
              Trip<span className="text-primary-600">AI</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <h1 className="text-2xl font-black text-gray-900">Welcome back 👋</h1>
              <p className="text-gray-500 text-sm mt-1.5">
                Sign in to continue planning your trips
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </motion.div>

              {/* Remember me + Forgot */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-primary-600 transition-colors duration-200" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary-600 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<LogIn size={18} />}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="mt-8 pt-6 border-t border-gray-100 text-center"
            >
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 font-bold hover:underline"
                >
                  Create one free →
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
