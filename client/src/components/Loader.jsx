import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* ── Full-page loader ──────────────────────────────────────────────────────── */
const FullPageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="text-primary-600"
    >
      <Loader2 size={48} strokeWidth={2} />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-gray-500 font-medium text-sm"
    >
      Loading…
    </motion.p>
  </div>
);

/* ── Inline spinner ────────────────────────────────────────────────────────── */
const Spinner = ({ size = 20, className = '' }) => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    className={`inline-block text-current ${className}`}
    style={{ width: size, height: size }}
  >
    <Loader2 size={size} strokeWidth={2.5} />
  </motion.span>
);

/* ── Skeleton card ─────────────────────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-48 rounded-xl w-full" />
    <div className="skeleton h-5 rounded-lg w-3/4" />
    <div className="skeleton h-4 rounded-lg w-1/2" />
    <div className="flex gap-2 pt-1">
      <div className="skeleton h-8 rounded-lg w-20" />
      <div className="skeleton h-8 rounded-lg w-20" />
    </div>
  </div>
);

/* ── Main export ───────────────────────────────────────────────────────────── */
const Loader = ({ fullPage = false, size, className }) => {
  if (fullPage) return <FullPageLoader />;
  return <Spinner size={size} className={className} />;
};

export { Spinner };
export default Loader;
