import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Input component.
 *
 * Props:
 *  label      – string
 *  error      – string (validation message)
 *  icon       – ReactNode (left icon)
 *  type       – input type (handles password toggle automatically)
 *  hint       – string (helper text below input)
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      type = 'text',
      hint,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    const [showPwd, setShowPwd] = useState(false);
    const isPassword = type === 'password';
    const inputType  = isPassword ? (showPwd ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {icon && (
            <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`form-input ${icon ? 'pl-10' : ''} ${
              isPassword ? 'pr-12' : ''
            } ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' : ''} ${className}`}
            {...rest}
          />

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-red-500 font-medium flex items-center gap-1"
            >
              <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-px" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Hint text */}
        {hint && !error && (
          <p className="text-xs text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
