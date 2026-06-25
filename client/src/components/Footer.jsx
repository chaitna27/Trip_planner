import { Link } from 'react-router-dom';
import { Plane, Heart, Mail, Info, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* ── Main footer content ───────────────────────────────────────────────── */}
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-primary-600/20 rounded-xl text-primary-400">
                <Plane size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white">
                Trip<span className="text-accent-400">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Plan your perfect trip with AI-powered itineraries, real-time weather,
              hotel recommendations and flight options — all in one place.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/login">Login</FooterLink>
              <FooterLink to="/register">Register</FooterLink>
              <FooterLink to="/my-trips">My Trips</FooterLink>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#about"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Info size={14} /> About
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@tripai.dev"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail size={14} /> Contact
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <GitBranch size={14} /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {year} TripAI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
              className="text-red-400"
            >
              <Heart size={12} fill="currentColor" />
            </motion.span>{' '}
            using AI
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
