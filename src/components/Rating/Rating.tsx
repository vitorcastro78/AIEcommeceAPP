
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the Rating component.
 */
export interface RatingProps {
  /**
   * Current rating value (controlled).
   */
  value: number;
  /**
   * Callback when the rating changes.
   */
  onChange?: (value: number) => void;
  /**
   * Maximum number of stars.
   * @default 5
   */
  max?: number;
  /**
   * If true, disables interaction.
   */
  disabled?: boolean;
  /**
   * If true, shows a loading spinner.
   */
  loading?: boolean;
  /**
   * If true, shows error state.
   */
  error?: boolean;
  /**
   * ARIA label for the rating group.
   */
  'aria-label'?: string;
  /**
   * Size of the stars: 'sm' | 'md' | 'lg'
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional className for the wrapper.
   */
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const starVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.15 },
  tap: { scale: 0.95 },
  selected: { scale: 1.1 },
};

const Spinner = () => (
  <svg
    className="animate-spin h-6 w-6 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Loading"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="h-6 w-6 text-red-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Error"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      stroke="currentColor"
      strokeWidth="2"
      d="M15 9l-6 6m0-6l6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Star = React.memo(
  ({
    filled,
    onClick,
    onMouseEnter,
    onMouseLeave,
    tabIndex,
    ariaLabel,
    size,
    disabled,
    selected,
    id,
    onKeyDown,
  }: {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    tabIndex: number;
    ariaLabel: string;
    size: string;
    disabled: boolean;
    selected: boolean;
    id: string;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  }) => (
    <motion.button
      type="button"
      id={id}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-pressed={filled}
      aria-disabled={disabled}
      disabled={disabled}
      className={`focus:outline-none transition-colors ${size} ${
        filled
          ? 'text-yellow-400'
          : 'text-gray-300 dark:text-gray-600'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      variants={starVariants}
      initial="initial"
      animate={selected ? 'selected' : 'initial'}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      role="radio"
    >
      <svg
        className="w-full h-full"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    </motion.button>
  )
);

export const Rating: React.FC<RatingProps> = React.memo(
  ({
    value,
    onChange,
    max = 5,
    disabled = false,
    loading = false,
    error = false,
    'aria-label': ariaLabel = 'Rating',
    size = 'md',
    className,
  }) => {
    const [hovered, setHovered] = React.useState<number | null>(null);

    const stars = useMemo(() => Array.from({ length: max }), [max]);

    const handleClick = useCallback(
      (idx: number) => {
        if (disabled || loading || error || !onChange) return;
        onChange(idx + 1);
      },
      [onChange, disabled, loading, error]
    );

    const handleMouseEnter = useCallback(
      (idx: number) => {
        if (disabled || loading || error) return;
        setHovered(idx + 1);
      },
      [disabled, loading, error]
    );

    const handleMouseLeave = useCallback(() => {
      setHovered(null);
    }, []);

    const handleKeyDown = useCallback(
      (idx: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled || loading || error || !onChange) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(max, (hovered ?? value) + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(1, (hovered ?? value) - 1));
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(idx + 1);
        }
      },
      [onChange, disabled, loading, error, hovered, value, max]
    );

    return (
      <div
        className={`flex items-center gap-1 ${className ?? ''} ${
          disabled ? 'opacity-60 pointer-events-none' : ''
        }`}
        aria-label={ariaLabel}
        role="radiogroup"
      >
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorIcon />
        ) : (
          stars.map((_, idx) => (
            <Star
              key={idx}
              id={`rating-star-${idx}`}
              filled={hovered !== null ? idx < hovered : idx < value}
              selected={idx + 1 === (hovered ?? value)}
              onClick={() => handleClick(idx)}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
              tabIndex={disabled ? -1 : idx === 0 ? 0 : -1}
              ariaLabel={`Rate ${idx + 1} out of ${max}`}
              size={sizes[size]}
              disabled={disabled}
              onKeyDown={handleKeyDown(idx)}
            />
          ))
        )}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

