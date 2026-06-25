import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, DollarSign, Trash2,
  Plus, Plane, ArrowRight, AlertCircle, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Loader';
import useAuth from '../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};

/* ── Trip card ───────────────────────────────────────────────────────────────── */
const TripCard = ({ trip, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip permanently?')) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/trips/${trip._id}`);
      toast.success('Trip deleted.');
      onDelete(trip._id);
    } catch {
      toast.error('Failed to delete trip.');
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '–';

  const daysCount = trip.startDate && trip.endDate
    ? Math.max(1, Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000))
    : null;

  const image = trip.images?.[0]?.url
    ?? trip.images?.[0]?.src
    ?? trip.images?.[0]?.imageUrl
    ?? trip.images?.[0]
    ?? null;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.15)' }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/trips/${trip._id}`)}
    >
      {/* Image or gradient fallback */}
      <div className="relative h-44 overflow-hidden">
        {image && typeof image === 'string' ? (
          <img
            src={image}
            alt={trip.destination}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.parentElement.classList.add('fallback'); e.target.style.display = 'none'; }}
          />
        ) : null}
        <div className={`absolute inset-0 bg-hero-gradient ${image ? 'opacity-50' : 'opacity-100'}`} />
        <div className="absolute inset-0 flex items-end p-4">
          <div>
            <p className="text-white/70 text-xs font-medium">{trip.source}</p>
            <h3 className="text-white text-xl font-black">{trip.destination}</h3>
          </div>
        </div>
        {daysCount && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
            {daysCount}D
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-primary-500" />
            {fmt(trip.startDate)} – {fmt(trip.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} className="text-primary-500" />
            {trip.adults} Adult{trip.adults !== 1 ? 's' : ''}
            {trip.children > 0 ? ` · ${trip.children} Child` : ''}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={12} className="text-primary-500" />
            {trip.budget}
          </span>
        </div>

        {trip.interests?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {trip.interests.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                {tag}
              </span>
            ))}
            {trip.interests.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                +{trip.interests.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Created {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete trip"
            >
              <Trash2 size={14} />
            </button>
            <span className="text-xs text-primary-600 font-semibold flex items-center gap-1">
              View <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Empty state ─────────────────────────────────────────────────────────────── */
const Empty = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full text-center py-20"
  >
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-5">
      <Plane size={32} className="text-primary-500" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
      Plan your first AI-powered trip and it will appear here.
    </p>
    <Link to="/dashboard">
      <Button variant="gradient" icon={<Plus size={16} />}>Plan a Trip</Button>
    </Link>
  </motion.div>
);

/* ── MyTripsPage ─────────────────────────────────────────────────────────────── */
const MyTripsPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [trips, setTrips]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get('/api/trips');
        if (data.success) setTrips(data.trips);
        else setError('Could not load trips.');
      } catch (err) {
        setError(err.response?.data?.message ?? 'Failed to load trips.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = (id) => setTrips((t) => t.filter((x) => x._id !== id));

  const filtered = trips.filter((t) =>
    !search || t.destination?.toLowerCase().includes(search.toLowerCase())
      || t.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Header */}
      <div className="bg-hero-gradient py-14 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black text-white">My Trips</h1>
          <p className="mt-2 text-white/70 text-sm">
            Hi {user?.name?.split(' ')[0]} — you have {trips.length} saved trip{trips.length !== 1 ? 's' : ''}.
          </p>
        </motion.div>
      </div>

      <div className="section-container -mt-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="form-input pl-9"
              placeholder="Search by destination or source…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/dashboard">
            <Button variant="gradient" icon={<Plus size={16} />}>New Trip</Button>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 space-y-3">
            <AlertCircle size={40} className="text-red-400 mx-auto" />
            <p className="text-gray-600">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.length ? (
                filtered.map((trip, i) => (
                  <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
                ))
              ) : (
                <Empty />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
