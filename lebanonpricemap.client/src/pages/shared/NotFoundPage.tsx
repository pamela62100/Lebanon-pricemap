import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-bg-base flex flex-col items-center justify-center p-4 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <span className="text-6xl mb-6 block">🧭</span>
        <h1 className="text-4xl font-bold text-text-main mb-2">404</h1>
        <p className="text-lg text-text-sub mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="h-12 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
}
