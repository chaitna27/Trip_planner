import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles, MapPin, Cloud, Hotel, Plane, ArrowRight,
  CheckCircle2, Star, ChevronDown, Zap, Globe, ShieldCheck,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

/* ─── animation variants ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── helper: scroll-triggered section wrapper ───────────────────────────── */
const RevealSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── HERO ─────────────────────────────────────────────────────────────────── */
const Hero = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80"
          alt="Travel destination"
          className="w-full h-full object-cover"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/65 to-blue-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-cyan-900/40" />
      </div>

      {/* Floating decorative circles */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 left-16 w-64 h-64 rounded-full bg-primary-400/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 section-container text-center px-4 pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6"
        >
          <Sparkles size={13} className="text-accent-400" />
          Powered by Google Gemini AI
          <Sparkles size={13} className="text-accent-400" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight text-balance"
        >
          Plan Your{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Perfect Trip
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-300 rounded-full origin-left"
            />
          </span>
          <br />
          <span className="text-white">with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6 text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Generate personalized itineraries with AI, discover hotels, flights,
          weather and travel insights — all in one beautiful dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="gradient"
            size="lg"
            icon={<Sparkles size={18} />}
            iconRight={<ArrowRight size={18} />}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="min-w-[200px] shadow-glow"
          >
            Get Started Free
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<MapPin size={18} />}
            onClick={() =>
              navigate(isAuthenticated ? '/my-trips' : '/login')
            }
            className="min-w-[180px] bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            My Trips
          </Button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '10K+', label: 'Trips Planned' },
            { value: '150+', label: 'Destinations' },
            { value: '4.9★', label: 'User Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-white/60 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 flex justify-center text-white/40"
        >
          <ChevronDown size={28} />
        </motion.div>
      </div>
    </section>
  );
};

/* ─── FEATURES ─────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    title: 'AI Itinerary Generator',
    description:
      'Gemini AI crafts a detailed day-by-day itinerary tailored to your budget, interests and travel dates — in seconds.',
    points: ['Personalized day plans', 'Budget-aware activities', 'Local food suggestions'],
  },
  {
    icon: Cloud,
    color: 'from-sky-400 to-blue-600',
    bg: 'bg-sky-50',
    title: 'Live Weather Insights',
    description:
      'Get real-time weather conditions for your destination so you can pack right and plan smarter.',
    points: ['Temperature & humidity', 'Wind speed & feels like', 'Condition overview'],
  },
  {
    icon: Hotel,
    color: 'from-emerald-400 to-teal-600',
    bg: 'bg-emerald-50',
    title: 'Hotels & Flights',
    description:
      'Discover nearby hotels via Geoapify and compare AI-suggested flight options from major Indian airlines.',
    points: ['Top hotels near you', 'Google Maps integration', 'Flight cost estimates'],
  },
];

const Features = () => (
  <section id="features" className="py-24 bg-background">
    <div className="section-container">
      <RevealSection>
        <motion.p variants={fadeUp} className="text-center text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
          What We Offer
        </motion.p>
        <motion.h2 variants={fadeUp} className="section-heading">
          Everything You Need to{' '}
          <span className="gradient-text">Travel Smarter</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="section-subheading">
          Our AI-powered platform brings together every piece of your trip planning into one seamless experience.
        </motion.p>
      </RevealSection>

      <RevealSection className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon: Icon, color, bg, title, description, points }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.15)' }}
            transition={{ duration: 0.3 }}
            className="card p-8 group cursor-default"
          >
            {/* Icon */}
            <div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl text-white`}>
                <Icon size={22} strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>
            <ul className="space-y-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-primary-500 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </RevealSection>
    </div>
  </section>
);

/* ─── HOW IT WORKS ─────────────────────────────────────────────────────────── */
const steps = [
  {
    step: '01',
    icon: MapPin,
    title: 'Tell Us Your Plans',
    description:
      'Enter your source, destination, travel dates, number of travelers, budget and interests.',
  },
  {
    step: '02',
    icon: Zap,
    title: 'AI Generates Your Trip',
    description:
      'Our AI instantly creates a complete itinerary with weather, hotels, flights and daily activities.',
  },
  {
    step: '03',
    icon: Globe,
    title: 'Travel & Explore',
    description:
      'View your personalized trip plan, save it to your profile, and explore the world with confidence.',
  },
];

const HowItWorks = () => (
  <section className="py-24 bg-gray-50">
    <div className="section-container">
      <RevealSection>
        <motion.p variants={fadeUp} className="text-center text-sm font-bold text-secondary-600 uppercase tracking-widest mb-3">
          How It Works
        </motion.p>
        <motion.h2 variants={fadeUp} className="section-heading">
          Three Steps to Your{' '}
          <span className="gradient-text">Dream Trip</span>
        </motion.h2>
      </RevealSection>

      <RevealSection className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 relative">
        {/* Connector line (desktop) */}
        <div className="absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 hidden md:block" />

        {steps.map(({ step, icon: Icon, title, description }) => (
          <motion.div
            key={step}
            variants={fadeUp}
            className="flex flex-col items-center text-center relative"
          >
            {/* Step bubble */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow">
                <Icon size={28} className="text-white" strokeWidth={2} />
              </div>
              <span className="absolute -top-2 -right-2 bg-accent-400 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {step.replace('0', '')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </RevealSection>
    </div>
  </section>
);

/* ─── TESTIMONIALS ─────────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Travel Enthusiast',
    avatar: 'PS',
    rating: 5,
    text: 'TripAI planned my Rajasthan trip perfectly. The AI itinerary was spot-on and the hotel suggestions saved me hours of research!',
  },
  {
    name: 'Rahul Mehta',
    role: 'Solo Traveler',
    avatar: 'RM',
    rating: 5,
    text: 'Booking flights used to stress me out. With TripAI, I get realistic flight estimates and a complete day plan instantly.',
  },
  {
    name: 'Anika Gupta',
    role: 'Family Traveler',
    avatar: 'AG',
    rating: 5,
    text: 'Planned our Goa family vacation in under 5 minutes. The budget tracking and packing tips were incredibly helpful!',
  },
];

const Testimonials = () => (
  <section className="py-24 bg-background">
    <div className="section-container">
      <RevealSection>
        <motion.p variants={fadeUp} className="text-center text-sm font-bold text-accent-600 uppercase tracking-widest mb-3">
          Travelers Love Us
        </motion.p>
        <motion.h2 variants={fadeUp} className="section-heading">
          Real Stories, Real Adventures
        </motion.h2>
      </RevealSection>

      <RevealSection className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(({ name, role, avatar, rating, text }) => (
          <motion.div
            key={name}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="card p-7 space-y-4"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} size={14} fill="#F59E0B" className="text-accent-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed italic">"{text}"</p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </RevealSection>
    </div>
  </section>
);

/* ─── CTA BANNER ───────────────────────────────────────────────────────────── */
const CTA = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  return (
    <section className="py-20">
      <div className="section-container">
        <RevealSection>
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-cta-gradient p-12 md:p-16 text-center shadow-2xl"
          >
            {/* Decorative blobs */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
              >
                <ShieldCheck size={13} /> Free to use · No credit card required
              </motion.div>

              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-white mb-6 text-balance">
                Ready to Plan Your Next Adventure?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of smart travelers who use TripAI to plan stress-free, memorable journeys.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  <Sparkles size={18} className="text-accent-500" />
                  Start Planning For Free
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
};

/* ─── PAGE ASSEMBLY ─────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-x-hidden">
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default LandingPage;
