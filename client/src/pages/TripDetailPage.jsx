import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Users, DollarSign, Cloud, Wind,
  Droplets, Thermometer, Hotel, Plane, Package, Lightbulb,
  Trash2, Star, Clock, CheckCircle2, AlertCircle, ChevronDown,
  ChevronUp, Tag, Utensils, Globe, Image as ImageIcon, TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from '../components/Button';
import Loader from '../components/Loader';

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

// Currency formatter — strips any leading ₹ before prepending one,
// so values that already contain ₹ (from the backend) never double up.
const fmtCurrency = (val) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str) return null;
  if (str.startsWith('₹')) return str;
  const num = Number(str.replace(/,/g, ''));
  if (!isNaN(num) && str !== '') return `₹${num.toLocaleString('en-IN')}`;
  return str;
};

const getTimeOfDay = (str) => {
  if (!str || typeof str !== 'string') return 'night';
  const s = str.toLowerCase();
  if (/morning|sunrise|breakfast/.test(s)) return 'morning';
  if (/afternoon|lunch|noon|midday/.test(s)) return 'afternoon';
  if (/evening|sunset|dusk/.test(s)) return 'evening';
  if (/night|dinner|midnight|late/.test(s)) return 'night';
  // Parse numeric hour from "8:00 AM", "14:30", "8 AM"
  const m = s.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)?/);
  if (m) {
    let h = parseInt(m[1], 10);
    if (m[2] === 'pm' && h !== 12) h += 12;
    if (m[2] === 'am' && h === 12) h = 0;
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
  }
  return 'night';
};

const VALID_BANDS = new Set(['morning', 'afternoon', 'evening', 'night']);

const groupByTime = (activities) => {
  const out = { morning: [], afternoon: [], evening: [], night: [] };
  if (!Array.isArray(activities)) return out;
  activities.forEach((act) => {
    let band;
    if (typeof act === 'string') {
      band = getTimeOfDay(act);
    } else if (act && typeof act === 'object') {
      // New schema: act.timeOfDay is already the exact band name
      const directBand = typeof act.timeOfDay === 'string' ? act.timeOfDay.toLowerCase().trim() : null;
      if (directBand && VALID_BANDS.has(directBand)) {
        band = directBand;
      } else {
        // Fallback: infer from any available time string
        const timeStr = act.time ?? act.timing ?? act.recommendedTime ?? act.timeOfDay ?? '';
        band = getTimeOfDay(timeStr);
      }
    } else {
      band = 'night';
    }
    out[band].push(typeof act === 'string' ? { activity: act } : act);
  });
  return out;
};

// Images are now served per-activity from the backend (act.imageUrl).
// pickImage cycling removed to prevent incorrect image assignments.

/* ─── Time-of-Day Band Config ────────────────────────────────────────────── */
const BANDS = [
  {
    key: 'morning',
    label: 'Morning',
    emoji: '🌅',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    key: 'afternoon',
    label: 'Afternoon',
    emoji: '☀️',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
    dot: 'bg-sky-400',
    badge: 'bg-sky-100 text-sky-800',
  },
  {
    key: 'evening',
    label: 'Evening',
    emoji: '🌇',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    dot: 'bg-orange-400',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    key: 'night',
    label: 'Night',
    emoji: '🌙',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-100 text-indigo-800',
  },
];

/* ─── Left Sidebar Nav Items ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'itinerary', label: 'Itinerary', icon: Calendar },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'travel-tips', label: 'Travel Tips', icon: Lightbulb },
  { id: 'packing-tips', label: 'Packing Tips', icon: Package },
];

const scrollToSection = (id) => {
  // Some section IDs (weather, hotels, flights) exist in both the hidden
  // mobile block AND the visible desktop sidebar. Pick the first one that
  // is actually rendered (offsetParent !== null means it is not display:none).
  const candidates = document.querySelectorAll(`[id="${id}"]`);
  const el =
    Array.from(candidates).find((e) => e.offsetParent !== null) ??
    document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ─────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────────────────────────────────── */

/* ── ActivityCard ─────────────────────────────────────────────────────────── */
const ActivityCard = ({ act, fallbackImg, band }) => {
  // Use the activity-specific imageUrl embedded by the backend;
  // fall back to the destination hero image — never cycle unrelated images.
  const imgSrc = act.imageUrl ?? fallbackImg ?? null;
  // New schema uses placeName; keep legacy fallbacks for old trips
  const name = act.placeName ?? act.activity ?? act.name ?? act.title ?? null;
  const desc = act.description ?? null;
  const category = act.category ?? null;
  // New schema uses recommendedTime for the time chip
  const time = act.recommendedTime ?? act.time ?? act.timing ?? null;
  const duration = act.duration ?? act.estimatedDuration ?? null;
  const cost = act.estimatedCost ?? act.cost ?? null;
  const travelMode = act.travelMode ?? act.transport ?? act.mode ?? null;
  const rating = act.rating ?? null;
  const [imgErr, setImgErr] = useState(false);

  if (!name) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
    >
      {/* Thumbnail */}
      <div className="w-20 sm:w-28 shrink-0 relative overflow-hidden">
        {imgSrc && !imgErr ? (
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover min-h-[90px] group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className={`w-full h-full min-h-[90px] ${band.bg} flex items-center justify-center text-3xl`}
          >
            {band.emoji}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {name}
          </h4>
          {rating !== null && rating !== undefined && String(rating).trim() !== '' && (
            <span className="shrink-0 flex items-center gap-0.5 bg-green-50 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded-full border border-green-100">
              <Star size={9} fill="currentColor" /> {rating}
            </span>
          )}
        </div>

        {desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{desc}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {category && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-semibold ${band.badge}`}
            >
              <Tag size={8} />
              {category}
            </span>
          )}
          {time && (
            <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              <Clock size={8} /> {time}
            </span>
          )}
          {duration && duration !== time && (
            <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              <Clock size={8} /> {duration}
            </span>
          )}
          {travelMode && (
            <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
              {travelMode}
            </span>
          )}
          {cost && (
            <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              {fmtCurrency(cost)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── DayCard ──────────────────────────────────────────────────────────────── */
const DayCard = ({ day, dayIndex, heroImg, isOpen, onToggle }) => {

  const dayNum = day.day ?? day.dayNumber ?? dayIndex + 1;
  const title = day.title ?? day.theme ?? day.focus ?? null;
  const date = day.date ?? null;
  const cost = day.estimatedCost ?? null;
  const activities = day.activities ?? day.schedule ?? day.events ?? day.places ?? [];
  const food = day.foodSuggestions ?? day.food ?? day.meals ?? [];

  const grouped = groupByTime(activities);

  const hasActivities = Array.isArray(activities) && activities.length > 0;

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
    >
      {/* Day Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-500 text-left focus:outline-none"
      >
        {/* Day number badge */}
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 font-black text-white text-sm border border-white/20">
          {typeof dayNum === 'number' ? dayNum : dayIndex + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-black text-base leading-tight">
              Day {typeof dayNum === 'number' ? dayNum : dayIndex + 1}
            </span>
            {title && (
              <span className="text-white/80 text-sm font-medium">— {title}</span>
            )}
          </div>
          {(date || cost) && (
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {date && <span className="text-white/65 text-xs">{date}</span>}
              {cost && (
                <span className="text-xs text-white/95 font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                  ~{fmtCurrency(cost)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0">
          {isOpen ? (
            <ChevronUp size={18} className="text-white/70" />
          ) : (
            <ChevronDown size={18} className="text-white/70" />
          )}
        </div>
      </button>

      {/* Day Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 space-y-5">
              {hasActivities ? (
                BANDS.map((band) => {
                  const acts = grouped[band.key];
                  if (!acts?.length) return null;

                  return (
                    <div key={band.key}>
                      {/* Band header */}
                      <div
                        className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${band.bg} border ${band.border}`}
                      >
                        <span className="text-lg leading-none">{band.emoji}</span>
                        <span className={`text-sm font-bold ${band.text}`}>
                          {band.label}
                        </span>
                        <span
                          className={`ml-auto text-xs font-medium ${band.text} opacity-60`}
                        >
                          {acts.length} {acts.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="relative pl-5 space-y-3">
                        {/* Vertical line */}
                        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-gray-200 rounded-full" />

                        {acts.map((act, i) => (
                          <div key={i} className="relative">
                            {/* Timeline dot */}
                            <div
                              className={`absolute -left-[15px] top-4 w-2.5 h-2.5 rounded-full ${band.dot} ring-2 ring-white z-10`}
                            />
                            <ActivityCard
                              act={act}
                              fallbackImg={heroImg}
                              band={band}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 italic py-2 leading-relaxed">
                  {typeof day === 'string'
                    ? day
                    : day.description ?? day.summary ?? 'No activities listed for this day.'}
                </p>
              )}

              {/* Food Suggestions */}
              {Array.isArray(food) && food.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Utensils size={14} className="text-rose-500" />
                    <span className="text-sm font-bold text-gray-700">Food Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {food.map((f, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-medium border border-rose-100"
                      >
                        {typeof f === 'string'
                          ? f
                          : f.name ?? f.restaurant ?? f.dish ?? JSON.stringify(f)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── WeatherWidget ────────────────────────────────────────────────────────── */
const WeatherWidget = ({ weather }) => {
  if (!weather) return null;

  const temp = weather.temperature ?? weather.temp_c ?? weather.temp ?? null;
  const feels = weather.feelsLike ?? weather.feelslike_c ?? weather.feels_like ?? null;
  const humidity = weather.humidity ?? null;
  const wind = weather.windSpeed ?? weather.wind_kph ?? weather.wind_speed ?? null;
  const desc =
    weather.description ??
    weather.condition?.text ??
    weather.weather?.[0]?.description ??
    null;
  const city = weather.city ?? weather.name ?? null;
  const iconCode = weather.icon ?? weather.weather?.[0]?.icon ?? null;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  return (
    <div id="weather" className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Current Weather
          </p>
          {city && (
            <p className="text-sm font-bold text-white mt-0.5">{city}</p>
          )}
        </div>
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={desc ?? 'weather'}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <Cloud size={36} className="text-white/60" />
        )}
      </div>

      {temp !== null && temp !== undefined && (
        <div className="text-4xl font-black mb-0.5">
          {Math.round(Number(temp))}°C
        </div>
      )}
      {desc && (
        <p className="text-sm text-white/80 capitalize mb-3">{desc}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {feels !== null && feels !== undefined && (
          <div className="bg-white/15 rounded-xl p-2.5">
            <Thermometer size={12} className="text-white/70 mb-1" />
            <p className="text-xs text-white/70">Feels like</p>
            <p className="text-sm font-bold">{Math.round(Number(feels))}°C</p>
          </div>
        )}
        {humidity !== null && humidity !== undefined && (
          <div className="bg-white/15 rounded-xl p-2.5">
            <Droplets size={12} className="text-white/70 mb-1" />
            <p className="text-xs text-white/70">Humidity</p>
            <p className="text-sm font-bold">{humidity}%</p>
          </div>
        )}
        {wind !== null && wind !== undefined && (
          <div className="bg-white/15 rounded-xl p-2.5 col-span-2">
            <Wind size={12} className="text-white/70 mb-1" />
            <p className="text-xs text-white/70">Wind Speed</p>
            <p className="text-sm font-bold">{wind} {weather.windSpeed !== undefined ? 'm/s' : 'km/h'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── HotelsWidget ─────────────────────────────────────────────────────────── */
const HotelsWidget = ({ hotels }) => {
  const [showAll, setShowAll] = useState(false);
  if (!hotels?.length) return null;

  const visible = showAll ? hotels : hotels.slice(0, 3);

  return (
    <div id="hotels">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hotel size={15} className="text-emerald-600" />
          <span className="text-sm font-bold text-gray-800">Top Hotels</span>
        </div>
        {hotels.length > 3 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            {showAll ? 'Show less' : `+${hotels.length - 3} more`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {visible.map((h, i) => {
          const name = h.name ?? h.hotel_name ?? null;
          const address = h.address ?? h.location ?? h.formatted ?? null;
          const rating = h.rating ?? h.stars ?? h.score ?? null;
          const price = h.price ?? h.rate ?? h.cost ?? null;
          if (!name) return null;

          return (
            <div
              key={i}
              className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-150"
            >
              <p className="font-semibold text-gray-900 text-xs leading-tight">{name}</p>
              {address && (
                <p className="text-xs text-gray-500 mt-1 flex items-start gap-1 leading-relaxed">
                  <MapPin size={9} className="shrink-0 mt-0.5 text-gray-400" />
                  {address}
                </p>
              )}
              {(rating || price) && (
                <div className="flex items-center gap-3 mt-1.5">
                  {rating && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-600 font-bold">
                      <Star size={9} fill="currentColor" /> {rating}
                    </span>
                  )}
                  {price && (
                    <span className="text-xs text-emerald-700 font-bold">
                      {fmtCurrency(price)}/night
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── FlightsWidget ────────────────────────────────────────────────────────── */
const FlightsWidget = ({ flights }) => {
  if (!flights?.length) return null;

  return (
    <div id="flights">
      <div className="flex items-center gap-2 mb-3">
        <Plane size={15} className="text-primary-600" />
        <span className="text-sm font-bold text-gray-800">Suggested Flights</span>
      </div>

      <div className="space-y-2">
        {flights.map((f, i) => {
          const airline = f.airline ?? f.carrier ?? null;
          const flightNum = f.flightNumber ?? f.flight ?? f.number ?? null;
          const from = f.from ?? f.departure ?? null;
          const to = f.to ?? f.arrival ?? null;
          const depTime = f.departureTime ?? f.departs ?? null;
          const arrTime = f.arrivalTime ?? f.arrives ?? null;
          const dur = f.duration ?? f.time ?? null;
          const price =
            f.estimatedPrice ?? f.price ?? f.cost ?? f.fare ?? null;

          if (!airline && !from && !to) return null;

          return (
            <div
              key={i}
              className="p-3 bg-primary-50 rounded-xl border border-primary-100"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {airline && (
                    <p className="text-xs font-bold text-gray-900 truncate">{airline}</p>
                  )}
                  {flightNum && (
                    <p className="text-xs text-gray-500 font-medium">{flightNum}</p>
                  )}
                </div>
                {price && (
                  <span className="shrink-0 text-sm font-black text-primary-700">
                    {fmtCurrency(price)}
                  </span>
                )}
              </div>

              {(from || to) && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-700 font-semibold">
                  {from && <span>{from}</span>}
                  {from && to && <span className="text-gray-400">→</span>}
                  {to && <span>{to}</span>}
                </div>
              )}

              {(depTime || arrTime || dur) && (
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  {depTime && <span>{depTime}</span>}
                  {depTime && arrTime && <span>–</span>}
                  {arrTime && <span>{arrTime}</span>}
                  {dur && (
                    <span className="ml-auto text-gray-400 flex items-center gap-0.5">
                      <Clock size={9} /> {dur}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── TripOverviewWidget ───────────────────────────────────────────────────── */
const TripOverviewWidget = ({ trip }) => {
  const { source, destination, startDate, endDate, adults, children, budget, itinerary } =
    trip;
  const totalCost = itinerary?.estimatedTotalCost ?? null;
  const bestTime = itinerary?.bestTimeToVisit ?? null;
  const duration = itinerary?.duration ?? null;

  const startFmt = fmtDate(startDate);
  const endFmt = fmtDate(endDate);

  const rows = [
    { icon: MapPin, label: 'From', value: source },
    { icon: MapPin, label: 'To', value: destination },
    {
      icon: Calendar,
      label: 'Dates',
      value:
        startFmt && endFmt
          ? `${startFmt} – ${endFmt}`
          : startFmt || null,
    },
    {
      icon: Users,
      label: 'Travelers',
      value: adults
        ? `${adults} Adult${adults !== 1 ? 's' : ''}${
            children ? ` · ${children} Child${children !== 1 ? 'ren' : ''}` : ''
          }`
        : null,
    },
    { icon: DollarSign, label: 'Budget', value: budget },
    {
      icon: TrendingUp,
      label: 'Est. Total',
      value: totalCost ? fmtCurrency(totalCost) : null,
    },
    { icon: Clock, label: 'Duration', value: duration },
    { icon: Globe, label: 'Best Time', value: bestTime },
  ].filter((r) => r.value);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-primary-700 to-secondary-500">
        <p className="text-xs font-black text-white/90 uppercase tracking-widest">
          Trip Overview
        </p>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 px-4 py-2.5">
            <Icon size={13} className="text-primary-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5 leading-snug">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {trip.interests?.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50">
          <div className="flex flex-wrap gap-1.5">
            {trip.interests.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full font-semibold border border-primary-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── LeftSidebarNav ───────────────────────────────────────────────────────── */
const LeftSidebarNav = ({ activeId }) => (
  <nav className="space-y-0.5">
    {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
      const active = activeId === id;
      return (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
            active
              ? 'bg-primary-50 text-primary-700 font-bold shadow-sm'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <Icon
            size={14}
            className={active ? 'text-primary-600' : 'text-gray-400'}
          />
          {label}
        </button>
      );
    })}
  </nav>
);

/* ── GallerySection ───────────────────────────────────────────────────────── */
const GallerySection = ({ images }) => {
  if (!images?.length) return null;

  return (
    <motion.div
      id="gallery"
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <ImageIcon size={17} className="text-violet-600" />
        <h2 className="text-base font-bold text-gray-800">Destination Gallery</h2>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {images.length} photo{images.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="p-4 columns-2 sm:columns-3 gap-3">
        {images.map((img, i) => {
          const src = img.imageUrl ?? img.url ?? img.src ?? null;
          const alt = img.description ?? img.alt ?? `Photo ${i + 1}`;
          if (!src) return null;

          return (
            <motion.div
              key={img.id ?? i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative break-inside-avoid mb-3 overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src={src}
                alt={alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.parentElement.style.display = 'none';
                }}
              />
              {img.photographer && (
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs truncate">
                    📷 {img.photographer}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ── TravelTipsSection ────────────────────────────────────────────────────── */
const TravelTipsSection = ({ itinerary }) => {
  const tips =
    itinerary?.travelTips ??
    itinerary?.travel_tips ??
    itinerary?.tips ??
    itinerary?.generalTips ??
    [];
  if (!Array.isArray(tips) || !tips.length) return null;

  return (
    <motion.div
      id="travel-tips"
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <Lightbulb size={17} className="text-green-600" />
        <h2 className="text-base font-bold text-gray-800">Travel Tips</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3.5 bg-green-50 rounded-xl border border-green-100"
          >
            <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {typeof tip === 'string'
                ? tip
                : tip.tip ?? tip.advice ?? JSON.stringify(tip)}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ── PackingTipsSection ───────────────────────────────────────────────────── */
const PackingTipsSection = ({ itinerary }) => {
  const tips =
    itinerary?.packingTips ??
    itinerary?.packingList ??
    itinerary?.packing_tips ??
    itinerary?.packing ??
    [];
  if (!Array.isArray(tips) || !tips.length) return null;

  return (
    <motion.div
      id="packing-tips"
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <Package size={17} className="text-amber-600" />
        <h2 className="text-base font-bold text-gray-800">Packing Tips</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 transition-colors duration-150"
          >
            <CheckCircle2 size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {typeof tip === 'string'
                ? tip
                : tip.item ?? tip.tip ?? JSON.stringify(tip)}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE — all existing state / hooks / API calls preserved exactly
   ═══════════════════════════════════════════════════════════════════════════ */
const TripDetailPage = () => {
  /* ── PRESERVED: routing & state ──────────────────────────────────────── */
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  // Accordion: null = all collapsed. Only one day open at a time.
  const [openDayIndex, setOpenDayIndex] = useState(null);

  /* ── PRESERVED: data fetch ───────────────────────────────────────────── */
  useEffect(() => {
    const fetchTrip = async () => {
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
    fetchTrip();
  }, [id]);

  /* ── Active sidebar section tracker (IntersectionObserver) ──────────── */
  useEffect(() => {
    if (!trip) return;
    const ids = NAV_ITEMS.map((n) => n.id);
    const observers = [];

    ids.forEach((sid) => {
      const el = document.getElementById(sid);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sid);
        },
        { rootMargin: '-25% 0px -65% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [trip]);

  /* ── PRESERVED: delete trip ──────────────────────────────────────────── */
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

  /* ── PRESERVED: loading state ────────────────────────────────────────── */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <Loader fullPage />
      </div>
    );

  /* ── PRESERVED: error state ──────────────────────────────────────────── */
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16 px-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle size={48} className="text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button variant="primary" onClick={() => navigate('/my-trips')}>
            ← Back to My Trips
          </Button>
        </div>
      </div>
    );

  /* ── Derived data ────────────────────────────────────────────────────── */
  const { itinerary, weather, hotels, flights, images } = trip;

  const heroImg = images?.[0]?.imageUrl ?? null;
  const tripTitle =
    itinerary?.tripTitle ??
    itinerary?.title ??
    `${trip.source} → ${trip.destination}`;
  const tripSummary = itinerary?.tripSummary ?? itinerary?.description ?? null;

  // Resolve days array from various possible keys
  const rawDays =
    itinerary?.itinerary ??
    itinerary?.days ??
    itinerary?.dayWisePlan ??
    itinerary?.dailyPlan ??
    null;
  const daysArr = Array.isArray(rawDays)
    ? rawDays
    : Object.values(itinerary ?? {}).find(Array.isArray) ?? [];

  // Activity images are now embedded directly in each activity object (act.imageUrl)
  // by the backend — no offset pre-computation needed.

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">

      {/* ══ HERO SECTION ════════════════════════════════════════════════ */}
      <div id="overview" className="relative pt-16">
        <div className="relative h-60 sm:h-80 lg:h-96 overflow-hidden">
          {/* Background */}
          {heroImg ? (
            <img
              src={heroImg}
              alt={trip.destination}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-500" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

          {/* Back & Delete buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 hover:bg-black/50 transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/90 bg-red-500/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-400/20 hover:bg-red-600/80 transition-all disabled:opacity-50"
            >
              <Trash2 size={13} />
              {deleting ? 'Deleting…' : 'Delete Trip'}
            </button>
          </div>

          {/* Hero text content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <div className="section-container">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-1.5 text-white/70 text-sm mb-1">
                  <MapPin size={13} />
                  <span>
                    {trip.source} → {trip.destination}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl">
                  {tripTitle}
                </h1>

                {tripSummary && (
                  <p className="text-white/75 text-sm mt-2 max-w-2xl line-clamp-2 leading-relaxed">
                    {tripSummary}
                  </p>
                )}

                {/* Info chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(fmtDate(trip.startDate) || fmtDate(trip.endDate)) && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                      <Calendar size={10} />
                      {fmtDate(trip.startDate)}
                      {fmtDate(trip.endDate) && ` – ${fmtDate(trip.endDate)}`}
                    </span>
                  )}
                  {trip.adults && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                      <Users size={10} />
                      {trip.adults} {trip.adults === 1 ? 'Traveler' : 'Travelers'}
                      {trip.children ? ` + ${trip.children} Child${trip.children !== 1 ? 'ren' : ''}` : ''}
                    </span>
                  )}
                  {trip.budget && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">
                      <DollarSign size={10} />
                      {trip.budget}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════ */}
      <div className="section-container py-6 lg:py-8">
        <div className="flex gap-6 items-start">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-20 self-start">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-3 mb-2">
                Navigate
              </p>
              <LeftSidebarNav activeId={activeSection} />
            </div>
          </aside>

          {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-6">

            {/* Mobile horizontal scrollable tab bar */}
            <div className="lg:hidden -mx-1 overflow-x-auto pb-1">
              <div className="flex gap-1.5 px-1 w-max">
                {NAV_ITEMS.map(({ id: nid, label, icon: Icon }) => (
                  <button
                    key={nid}
                    onClick={() => scrollToSection(nid)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all border ${
                      activeSection === nid
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={11} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── ITINERARY ──────────────────────────────────────────── */}
            {daysArr.length > 0 && (
              <motion.div
                id="itinerary"
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-4"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-primary-600" />
                  <h2 className="text-lg font-black text-gray-900">
                    Your Itinerary
                  </h2>
                  <span className="text-sm text-gray-400 font-medium">
                    {daysArr.length} day{daysArr.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {daysArr.map((day, i) => (
                  <DayCard
                    key={i}
                    day={day}
                    dayIndex={i}
                    heroImg={heroImg}
                    isOpen={openDayIndex === i}
                    onToggle={() =>
                      setOpenDayIndex((prev) => (prev === i ? null : i))
                    }
                  />
                ))}
              </motion.div>
            )}

            {/* ── WEATHER / HOTELS / FLIGHTS (mobile only, below itinerary) */}
            <div className="lg:hidden space-y-4">
              {weather && <WeatherWidget weather={weather} />}

              {hotels?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                  <HotelsWidget hotels={hotels} />
                </div>
              )}

              {flights?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                  <FlightsWidget flights={flights} />
                </div>
              )}
            </div>

            {/* ── GALLERY ────────────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <GallerySection images={images} />
            </motion.div>

            {/* ── TRAVEL TIPS ────────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <TravelTipsSection itinerary={itinerary} />
            </motion.div>

            {/* ── PACKING TIPS ───────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <PackingTipsSection itinerary={itinerary} />
            </motion.div>
          </main>

          {/* ── RIGHT SIDEBAR (md+) ───────────────────────────────────── */}
          <aside className="hidden md:flex flex-col gap-4 w-72 shrink-0 sticky top-20 self-start">
            <TripOverviewWidget trip={trip} />

            {weather && (
              <WeatherWidget weather={weather} />
            )}

            {hotels?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                <HotelsWidget hotels={hotels} />
              </div>
            )}

            {flights?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
                <FlightsWidget flights={flights} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
