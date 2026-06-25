import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, DollarSign, Heart,
  Sparkles, ArrowRight, Plane, Baby, X, Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

/* ── interest tags ───────────────────────────────────────────────────────────── */
const INTEREST_OPTIONS = [
  'Culture', 'Food', 'Adventure', 'Nature', 'History',
  'Shopping', 'Beaches', 'Nightlife', 'Art', 'Sports',
  'Trekking', 'Wildlife', 'Religious', 'Architecture', 'Photography',
];

const BUDGET_OPTIONS = ['Budget', 'Moderate', 'Luxury', 'Ultra-Luxury'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' },
  }),
};

/* ── field wrapper ───────────────────────────────────────────────────────────── */
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="form-label flex items-center gap-1.5">
      {Icon && <Icon size={14} className="text-primary-500" />}
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ── validate ────────────────────────────────────────────────────────────────── */
const validate = (f) => {
  const e = {};
  if (!f.source.trim()) e.source = 'Source city is required';
  if (!f.destination.trim()) e.destination = 'Destination is required';
  if (!f.startDate) e.startDate = 'Start date is required';
  if (!f.endDate) e.endDate = 'End date is required';
  if (f.startDate && f.endDate && f.endDate <= f.startDate)
    e.endDate = 'End date must be after start date';
  if (!f.adults || f.adults < 1) e.adults = 'At least 1 adult required';
  if (!f.budget) e.budget = 'Select a budget level';
  if (!f.interests.length) e.interests = 'Choose at least one interest';
  return e;
};

/* ── component ───────────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    budget: '',
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const toggleInterest = (tag) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(tag)
        ? f.interests.filter((i) => i !== tag)
        : [...f.interests, tag],
    }));
    if (errors.interests) setErrors((e) => ({ ...e, interests: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const toastId = toast.loading('🤖 AI is crafting your trip plan…', { duration: 60000 });

    try {
      const payload = {
        source: form.source.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        adults: Number(form.adults),
        children: Number(form.children),
        budget: form.budget,
        interests: form.interests,
      };

      const { data } = await axiosInstance.post('/api/trips/generate', payload);
      toast.dismiss(toastId);

      if (data.success) {
        toast.success('Trip generated successfully! ✈️');
        navigate(`/trips/${data.trip._id}`);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const msg = err.response?.data?.message || 'Failed to generate trip. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* ── Hero strip ──────────────────────────────────────────────────────── */}
      <div className="bg-hero-gradient py-14 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={13} className="text-accent-300" /> Powered by Google Gemini AI
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Hi {user?.name?.split(' ')[0]} 👋 — Let's Plan Your Trip
          </h1>
          <p className="mt-3 text-white/70 text-base max-w-xl mx-auto">
            Fill in the details below and our AI will create a complete personalised itinerary for you.
          </p>
        </motion.div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────────────── */}
      <div className="section-container -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── Row 1: Source & Destination ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <Field label="Flying From" icon={Plane} error={errors.source}>
                  <input
                    className={`form-input ${errors.source ? 'border-red-400 bg-red-50' : ''}`}
                    placeholder="e.g. Mumbai, Delhi"
                    value={form.source}
                    onChange={(e) => set('source', e.target.value)}
                  />
                </Field>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <Field label="Destination" icon={MapPin} error={errors.destination}>
                  <input
                    className={`form-input ${errors.destination ? 'border-red-400 bg-red-50' : ''}`}
                    placeholder="e.g. Goa, Paris, Bali"
                    value={form.destination}
                    onChange={(e) => set('destination', e.target.value)}
                  />
                </Field>
              </motion.div>
            </div>

            {/* ── Row 2: Dates ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Field label="Start Date" icon={Calendar} error={errors.startDate}>
                  <input
                    type="date"
                    min={today}
                    className={`form-input ${errors.startDate ? 'border-red-400 bg-red-50' : ''}`}
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                  />
                </Field>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <Field label="End Date" icon={Calendar} error={errors.endDate}>
                  <input
                    type="date"
                    min={form.startDate || today}
                    className={`form-input ${errors.endDate ? 'border-red-400 bg-red-50' : ''}`}
                    value={form.endDate}
                    onChange={(e) => set('endDate', e.target.value)}
                  />
                </Field>
              </motion.div>
            </div>

            {/* ── Row 3: Travelers ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                <Field label="Adults" icon={Users} error={errors.adults}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => set('adults', Math.max(1, form.adults - 1))}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors">
                      −
                    </button>
                    <span className="w-12 text-center text-lg font-bold text-gray-900">{form.adults}</span>
                    <button type="button" onClick={() => set('adults', form.adults + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                </Field>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                <Field label="Children (under 12)" icon={Baby}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => set('children', Math.max(0, form.children - 1))}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors">
                      −
                    </button>
                    <span className="w-12 text-center text-lg font-bold text-gray-900">{form.children}</span>
                    <button type="button" onClick={() => set('children', form.children + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                </Field>
              </motion.div>
            </div>

            {/* ── Row 4: Budget ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Field label="Budget Level" icon={DollarSign} error={errors.budget}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set('budget', b)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        form.budget === b
                          ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </Field>
            </motion.div>

            {/* ── Row 5: Interests ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
              <Field label="Interests & Activities" icon={Heart} error={errors.interests}>
                <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((tag) => {
                    const active = form.interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                          active
                            ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                        }`}
                      >
                        {active ? <X size={11} /> : <Plus size={11} />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8} className="pt-2">
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600"
                    />
                    <Sparkles size={20} className="absolute inset-0 m-auto text-primary-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">Generating your AI trip plan…</p>
                    <p className="text-sm text-gray-500 mt-1">This may take 20–40 seconds</p>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-primary-500"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  icon={<Sparkles size={20} />}
                  iconRight={<ArrowRight size={20} />}
                  className="py-4 text-base"
                >
                  Generate My Trip Plan
                </Button>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
