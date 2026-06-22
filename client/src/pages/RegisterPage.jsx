import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Plane, CheckCircle } from 'lucide-react';
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

/* ── Password strength ──────────────────────────────────────────────────────── */
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors  = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'];

/* ── validation ─────────────────────────────────────────────────────────────── */
const validate = ({ name, email, password, confirmPassword }) => {
  const errs = {};
  if (!name.trim()) errs.name = 'Name is required';
  else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

  if (!email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';

  if (!password) errs.password = 'Password is required';
  else if (password.length < 6) errs.password = 'At least 6 characters required';

  if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
  else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

  return errs;
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

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
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (data.success) {
        toast.success('Account created! Please log in 🎉');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Right decorative panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 order-2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
          alt="Explore the world"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary-900/80 via-primary-800/65 to-primary-900/85" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Join Thousands of<br />Happy Travelers
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-xs mx-auto mb-10">
              Create your free account and start planning AI-powered trips in minutes.
            </p>
            <div className="flex flex-col gap-3 items-start max-w-xs mx-auto">
              {[
                'Free forever — no credit card',
                'Save unlimited trip plans',
                'Access weather, hotels & flights',
                'Download trip itineraries',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-accent-400 shrink-0" />
                  <span className="text-white/90 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Left form panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-white to-primary-50/30 order-1">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
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
              <h1 className="text-2xl font-black text-gray-900">Create your account ✈️</h1>
              <p className="text-gray-500 text-sm mt-1.5">
                Start planning your dream trips for free
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Full name"
                  placeholder="John Doe"
                  icon={<User size={16} />}
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  autoComplete="name"
                />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
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

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Min. 6 characters"
                  icon={<Lock size={16} />}
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="new-password"
                />
                {/* Password strength bar */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            s <= strength ? strengthColors[strength] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Strength:{' '}
                      <span className="font-semibold text-gray-600">
                        {strengthLabels[strength]}
                      </span>
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  placeholder="Repeat your password"
                  icon={<Lock size={16} />}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<UserPlus size={18} />}
                >
                  {loading ? 'Creating account…' : 'Create Free Account'}
                </Button>
              </motion.div>
            </form>

            {/* Terms note */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
              className="mt-4 text-xs text-gray-400 text-center"
            >
              By registering, you agree to our{' '}
              <span className="text-primary-600 cursor-pointer hover:underline">Terms of Service</span>{' '}
              and{' '}
              <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={7}
              className="mt-6 pt-6 border-t border-gray-100 text-center"
            >
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-bold hover:underline">
                  Sign in →
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
