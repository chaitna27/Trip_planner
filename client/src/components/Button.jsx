import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './Loader';

/**
 * Reusable Button component.
 *
 * Props:
 *  variant  – 'primary' | 'secondary' | 'ghost' | 'gradient' | 'danger'
 *  size     – 'sm' | 'md' | 'lg'
 *  loading  – bool   (shows spinner + disables)
 *  icon     – ReactNode (left icon)
 *  iconRight– ReactNode (right icon)
 *  fullWidth– bool
 */
const variantClasses = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  gradient:  'btn-gradient',
  danger:
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: '', // default — handled by variant
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const base = variantClasses[variant] ?? variantClasses.primary;
    const sz   = sizeClasses[size] ?? '';

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
        whileTap={{ scale: loading || disabled ? 1 : 0.97 }}
        transition={{ duration: 0.15 }}
        disabled={loading || disabled}
        className={`${base} ${sz} ${fullWidth ? 'w-full' : ''} ${
          loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
        } ${className}`}
        {...rest}
      >
        {loading ? (
          <Spinner size={16} />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && iconRight && (
          <span className="shrink-0">{iconRight}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
