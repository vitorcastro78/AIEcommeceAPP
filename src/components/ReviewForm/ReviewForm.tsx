
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for ReviewForm component.
 */
export interface ReviewFormProps {
  productId: string;
  onSubmitSuccess?: () => void;
  userName?: string;
  isAuthenticated: boolean;
}

/**
 * ReviewForm component for submitting product reviews.
 */
export const ReviewForm: React.FC<ReviewFormProps> = React.memo(
  ({ productId, onSubmitSuccess, userName, isAuthenticated }) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const stars = useMemo(() => [1, 2, 3, 4, 5], []);

    const handleRating = useCallback((star: number) => {
      setRating(star);
    }, []);

    const handleReviewChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(e.target.value);
      },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
          setError('Você precisa estar autenticado para enviar uma avaliação.');
          return;
        }
        if (rating === 0 || review.trim().length < 10) {
          setError('Por favor, dê uma nota e escreva um comentário com pelo menos 10 caracteres.');
          return;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
          await fetch(`/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rating,
              review,
              userName,
            }),
          });
          setSuccess(true);
          setReview('');
          setRating(0);
          if (onSubmitSuccess) onSubmitSuccess();
        } catch {
          setError('Erro ao enviar avaliação. Tente novamente.');
        } finally {
          setLoading(false);
        }
      },
      [productId, rating, review, userName, isAuthenticated, onSubmitSuccess]
    );

    return (
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="review-form-title"
        aria-describedby="review-form-desc"
      >
        <h2
          id="review-form-title"
          className="text-xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Avalie este produto
        </h2>
        <p id="review-form-desc" className="text-gray-500 dark:text-gray-300 text-sm mb-2">
          Sua opinião é importante para nós!
        </p>
        <div className="flex items-center gap-2" aria-label="Nota" role="radiogroup">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
              aria-checked={rating === star}
              role="radio"
              tabIndex={0}
              onClick={() => handleRating(star)}
              className={`transition-colors w-8 h-8 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                rating >= star
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <motion.svg
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                xmlns="http://www.w3.org/2000/svg"
                fill={rating >= star ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.6c.969 0 1.371 1.24.588 1.81l-5.347 3.89a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.347-3.89a1 1 0 00-1.176 0l-5.347 3.89c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118l-5.347-3.89c-.783-.57-.38-1.81.588-1.81h6.6a1 1 0 00.95-.69l2.036-6.29z"
                />
              </motion.svg>
            </button>
          ))}
        </div>
        <label htmlFor="review-text" className="sr-only">
          Comentário
        </label>
        <textarea
          id="review-text"
          name="review"
          minLength={10}
          maxLength={1000}
          required
          aria-required="true"
          aria-label="Comentário"
          className="w-full min-h-[100px] rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          placeholder="Escreva sua experiência com o produto..."
          value={review}
          onChange={handleReviewChange}
          disabled={loading}
        />
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary-600 text-white font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <motion.span
                className="flex items-center gap-2"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Enviando...
              </motion.span>
            ) : (
              'Enviar Avaliação'
            )}
          </button>
          {success && (
            <motion.span
              className="text-green-600 dark:text-green-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
            >
              Avaliação enviada!
            </motion.span>
          )}
        </div>
        {error && (
          <motion.div
            className="text-red-600 dark:text-red-400 text-sm mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </motion.div>
        )}
      </motion.form>
    );
  }
);

ReviewForm.displayName = 'ReviewForm';
