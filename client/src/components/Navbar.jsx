import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, LogOut, Map, Home, LogIn, UserPlus } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // ── Scroll detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close mobile menu on route change ───────────────────────────────────────
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
     ${isActive
       ? 'text-primary-600 bg-primary-50'
       : scrolled
         ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
         : 'text-white/90 hover:text-white hover:bg-white/10'}`;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-xl transition-colors duration-300 ${
                  scrolled ? 'bg-primary-50 text-primary-600' : 'bg-white/10 text-white'
                }`}
              >
                <Plane size={22} strokeWidth={2.5} />
              </motion.div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                Trip<span className={scrolled ? 'text-primary-600' : 'text-accent-400'}>AI</span>
              </span>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <Home size={15} /> Home
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink to="/my-trips" className={navLinkClass}>
                    <Map size={15} /> My Trips
                  </NavLink>

                  {/* Avatar + logout */}
                  <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/20">
                    <div className={`text-sm font-semibold ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>
                      Hi, {user?.name?.split(' ')[0]}
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
                        ${scrolled
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <NavLink to="/login" className={navLinkClass}>
                    <LogIn size={15} /> Login
                  </NavLink>
                  <Link to="/register">
                    <Button
                      variant={scrolled ? 'gradient' : 'secondary'}
                      size="sm"
                      icon={<UserPlus size={14} />}
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* ── Mobile hamburger ─────────────────────────────────────── */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-16 inset-x-0 z-40 bg-white shadow-xl border-t border-gray-100 md:hidden overflow-hidden"
          >
            <nav className="section-container py-4 flex flex-col gap-1">
              <MobileNavLink to="/" icon={<Home size={16} />}>Home</MobileNavLink>

              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/my-trips" icon={<Map size={16} />}>My Trips</MobileNavLink>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 px-3 mb-2">Signed in as {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
                  <MobileNavLink to="/login" icon={<LogIn size={16} />}>Login</MobileNavLink>
                  <Link to="/register">
                    <Button variant="gradient" fullWidth icon={<UserPlus size={15} />}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const MobileNavLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        isActive
          ? 'bg-primary-50 text-primary-600'
          : 'text-gray-700 hover:bg-gray-50'
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default Navbar;
