import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Users, DollarSign,
  Cloud, Wind, Droplets, Thermometer, Hotel, Plane,
  Image, Package, Lightbulb, ChevronDown, ChevronUp,
  Trash2, ExternalLink, Star, Clock, CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from '../components/Button';
import Loader from '../components/Loader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

/* ── Section wrapper ─────────────────────────────────────────────────────────── */
const Section = ({ title, icon: Icon, color = 'text-primary-600', children, className = '' }) => (
  <motion.div variants={fadeUp} className={`bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden ${className}`}>
    <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
      <div className={`p-2 rounded-xl bg-white shadow-sm ${color}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <h2 className="text-base font-bold text-gray-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

/* ── Weather card ────────────────────────────────────────────────────────────── */
const WeatherSection = ({ weather }) => {
  if (!weather) return null;
  const w = weather?.current || weather;
  const temp   = w?.temp_c ?? w?.temperature ?? w?.temp ?? '–';
  const feels  = w?.feelslike_c ?? w?.feels_like ?? '–';
  const humid  = w?.humidity ?? '–';
  const wind   = w?.wind_kph ?? w?.wind_speed ?? '–';
  const cond   = w?.condition?.text ?? w?.description ?? w?.weather?.[0]?.description ?? 'N/A';
  const icon   = w?.condition?.icon
    ? `https:${w.condition.icon}`
    : `https://openweathermap.org/img/wn/${w?.weather?.[0]?.icon ?? '01d'}@2x.png`;

  return (
    <Section title="Current Weather" icon={Cloud} color="text-sky-500">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img src={icon} alt={cond} className="w-20 h-20 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat icon={Thermometer} label="Temperature" value={`${temp}°C`} color="text-orange-500" />
          <Stat icon={Thermometer} label="Feels Like"  value={`${feels}°C`} color="text-amber-500" />
          <Stat icon={Droplets}    label="Humidity"    value={`${humid}%`}  color="text-sky-500" />
          <Stat icon={Wind}        label="Wind"        value={`${wind} km/h`} color="text-teal-500" />
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 capitalize font-medium">{cond}</p>
    </Section>
  );
};

const Stat = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
    <Icon size={18} className={`${color} mb-1`} />
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-base font-bold text-gray-900 mt-0.5">{value}</span>
  </div>
);

/* ── Flights section ─────────────────────────────────────────────────────────── */
const FlightsSection = ({ flights }) => {
  if (!flights?.length) return (
    <Section title="Flights" icon={Plane} color="text-primary-600">
      <p className="text-sm text-gray-400 text-center py-4">No flight data available.</p>
    </Section>
  );

  return (
    <Section title="Suggested Flights" icon={Plane} color="text-primary-600">
      <div className="space-y-3">
        {flights.map((f, i) => {
          const airline  = f.airline  ?? f.carrier    ?? f.name   ?? `Flight ${i + 1}`;
          const flightNo = f.flight   ?? f.flightNo   ?? f.number ?? '';
          const dep      = f.departure ?? f.departs   ?? f.from   ?? '';
          const arr      = f.arrival  ?? f.arrives    ?? f.to     ?? '';
          const price    = f.price    ?? f.cost       ?? f.fare   ?? '';
          const duration = f.duration ?? f.time       ?? '';
          const stops    = f.stops    ?? f.layovers   ?? 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                  <Plane size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{airline}</p>
                  {flightNo && <p className="text-xs text-gray-500">{flightNo}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {dep && <span className="font-semibold">{dep}</span>}
                {dep && arr && <span className="text-gray-300">→</span>}
                {arr && <span className="font-semibold">{arr}</span>}
                {duration && <span className="text-gray-400 text-xs"><Clock size={10} className="inline mr-1" />{duration}</span>}
                {stops !== undefined && stops !== '' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${Number(stops) === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {Number(stops) === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>
              {price && (
                <div className="text-right">
                  <span className="text-lg font-black text-primary-700">₹{typeof price === 'number' ? price.toLocaleString() : price}</span>
                  <p className="text-xs text-gray-400">per person</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

/* ── Hotels section ─────────────────────────────────────────────────────────── */
const HotelsSection = ({ hotels }) => {
  if (!hotels?.length) return (
    <Section title="Hotels" icon={Hotel} color="text-emerald-600">
      <p className="text-sm text-gray-400 text-center py-4">No hotel data available.</p>
    </Section>
  );

  return (
    <Section title="Recommended Hotels" icon={Hotel} color="text-emerald-600">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotels.slice(0, 6).map((h, i) => {
          const name    = h.name    ?? h.hotel_name ?? `Hotel ${i + 1}`;
          const rating  = h.rating  ?? h.stars      ?? h.score   ?? '';
          const address = h.address ?? h.location   ?? h.city    ?? '';
          const price   = h.price   ?? h.rate       ?? h.cost    ?? '';
          const url     = h.url     ?? h.link       ?? h.website ?? '';
          const category= h.category ?? h.type      ?? '';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                  {category && <p className="text-xs text-gray-500 mt-0.5">{category}</p>}
                  {address && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={10} className="shrink-0" />{address}
                    </p>
                  )}
                </div>
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer"
                    className="text-primary-500 hover:text-primary-700 shrink-0">
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
              <div className="flex items-center justify-between mt-3">
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star size={13} fill="#F59E0B" className="text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{rating}</span>
                  </div>
                )}
                {price && (
                  <span className="text-sm font-bold text-emerald-700">₹{typeof price === 'number' ? price.toLocaleString() : price}/night</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

/* ── Image gallery ───────────────────────────────────────────────────────────── */
const ImagesSection = ({ images }) => {
  if (!images?.length) return null;

  return (
    <Section title="Destination Gallery" icon={Image} color="text-violet-600">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.slice(0, 6).map((img, i) => {
          const src = img.url ?? img.src ?? img.imageUrl ?? img.image ?? img;
          const alt = img.alt ?? img.title ?? img.description ?? `Photo ${i + 1}`;
          if (!src || typeof src !== 'string') return null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="relative overflow-hidden rounded-xl aspect-video group"
            >
              <img src={src} alt={alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

/* ── Day itinerary ───────────────────────────────────────────────────────────── */
const ItinerarySection = ({ itinerary }) => {
  const [openDay, setOpenDay] = useState(null);

  const days = itinerary?.days
    ?? itinerary?.itinerary
    ?? itinerary?.dayWisePlan
    ?? itinerary?.dailyPlan
    ?? [];

  if (!Array.isArray(days) || !days.length) {
    // Try to find any array in the itinerary object
    const found = Object.values(itinerary || {}).find(Array.isArray);
    if (!found?.length) return null;
    return <ItinerarySectionInner days={found} openDay={openDay} setOpenDay={setOpenDay} />;
  }

  return <ItinerarySectionInner days={days} openDay={openDay} setOpenDay={setOpenDay} />;
};

const ItinerarySectionInner = ({ days, openDay, setOpenDay }) => (
  <Section title="Day-wise Itinerary" icon={Calendar} color="text-primary-600">
    <div className="space-y-3">
      {days.map((day, i) => {
        const dayLabel    = day.day     ?? day.dayNumber ?? day.title ?? `Day ${i + 1}`;
        const date        = day.date    ?? '';
        const theme       = day.theme   ?? day.focus     ?? day.subtitle ?? '';
        const activities  = day.activities ?? day.schedule ?? day.events ?? day.places ?? [];
        const isOpen      = openDay === i;

        return (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-sm">
                    {typeof dayLabel === 'string' && !dayLabel.toLowerCase().startsWith('day')
                      ? `Day ${i + 1} – ${dayLabel}` : dayLabel}
                  </span>
                  {(theme || date) && (
                    <p className="text-xs text-gray-500 mt-0.5">{[date, theme].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </div>
              {isOpen ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {Array.isArray(activities) && activities.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {activities.map((act, j) => {
                          const text = typeof act === 'string'
                            ? act
                            : act.activity ?? act.name ?? act.description ?? act.title ?? JSON.stringify(act);
                          const time = typeof act === 'object' ? (act.time ?? act.timing ?? '') : '';
                          return (
                            <li key={j} className="flex items-start gap-3 text-sm">
                              <CheckCircle2 size={15} className="text-primary-500 shrink-0 mt-0.5" />
                              <span className="text-gray-700">
                                {time && <span className="font-semibold text-gray-500 text-xs mr-2">{time}</span>}
                                {text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-gray-500">
                        {typeof day === 'string' ? day : (day.description ?? day.summary ?? 'No details available.')}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  </Section>
);

/* ── Packing tips ────────────────────────────────────────────────────────────── */
const PackingTips = ({ itinerary }) => {
  const tips = itinerary?.packingList
    ?? itinerary?.packing_tips
    ?? itinerary?.packingTips
    ?? itinerary?.packing
    ?? [];

  if (!Array.isArray(tips) || !tips.length) return null;

  return (
    <Section title="Packing Tips" icon={Package} color="text-amber-600">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <span>{typeof tip === 'string' ? tip : tip.item ?? tip.tip ?? JSON.stringify(tip)}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ── Travel tips ─────────────────────────────────────────────────────────────── */
const TravelTips = ({ itinerary }) => {
  const tips = itinerary?.travelTips
    ?? itinerary?.travel_tips
    ?? itinerary?.tips
    ?? itinerary?.generalTips
    ?? [];

  if (!Array.isArray(tips) || !tips.length) return null;

  return (
    <Section title="Travel Tips" icon={Lightbulb} color="text-green-600">
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </div>
            <span>{typeof tip === 'string' ? tip : tip.tip ?? tip.advice ?? JSON.stringify(tip)}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ── Trip Summary Card ───────────────────────────────────────────────────────── */
const TripSummary = ({ trip, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/trips/${trip._id}`);
      toast.success('Trip deleted.');
      navigate('/my-trips', { replace: true });
    } catch {
      toast.error('Failed to delete trip.');
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '–';

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Hero strip */}
      <div className="h-3 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-400" />
      <div className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MapPin size={14} className="text-primary-500" />
              <span>{trip.source} → {trip.destination}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {trip.itinerary?.tripTitle ?? trip.itinerary?.title ?? `${trip.source} → ${trip.destination}`}
            </h1>
            {trip.itinerary?.description && (
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">{trip.itinerary.description}</p>
            )}
          </div>
          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Info icon={Calendar} label="Start Date" value={fmt(trip.startDate)} />
          <Info icon={Calendar} label="End Date" value={fmt(trip.endDate)} />
          <Info icon={Users} label="Travelers" value={`${trip.adults} Adult${trip.adults !== 1 ? 's' : ''}${trip.children ? ` · ${trip.children} Child` : ''}`} />
          <Info icon={DollarSign} label="Budget" value={trip.budget} />
        </div>

        {trip.interests?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {trip.interests.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="p-3 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
      <Icon size={12} /> {label}
    </div>
    <p className="font-bold text-gray-900 text-sm">{value}</p>
  </div>
);

/* ── TripDetailPage ──────────────────────────────────────────────────────────── */
const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/trips/${id}`);
        if (data.success) setTrip(data.trip);
        else setError('Trip not found.');
      } catch (err) {
        setError(err.response?.data?.message ?? 'Failed to load trip.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-16">
      <div className="text-center space-y-3">
        <Loader fullPage />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-16 px-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle size={48} className="text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-500 text-sm">{error}</p>
        <Button variant="primary" onClick={() => navigate('/my-trips')}>← Back to My Trips</Button>
      </div>
    </div>
  );

  const { itinerary, weather, hotels, flights, images } = trip;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="section-container">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
          <TripSummary trip={trip} />
          <WeatherSection weather={weather} />
          <ItinerarySection itinerary={itinerary} />
          <FlightsSection flights={flights} />
          <HotelsSection hotels={hotels} />
          <ImagesSection images={images} />
          <PackingTips itinerary={itinerary} />
          <TravelTips itinerary={itinerary} />
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetailPage;
