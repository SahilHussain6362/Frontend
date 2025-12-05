import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import audioService from '../services/audioService';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    audioService.play('click');
    if (isAuthenticated) {
      navigate('/lobby');
    } else {
      navigate('/guest');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/images/main_background.352Z.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-dark-bg/60"></div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center max-w-4xl px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Title */}
        <motion.h1 
          className="text-8xl md:text-9xl lg:text-[12rem] font-display font-black mb-8 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          SPY GAME
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-2xl md:text-3xl text-gray-200 mb-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Find the spy among your friends
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button size="lg" onClick={handleGetStarted} className="min-w-[200px]">
            {isAuthenticated ? 'GO TO LOBBY' : 'GET STARTED'}
          </Button>
          {!isAuthenticated && (
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/login')}
              className="min-w-[200px]"
            >
              SIGN IN
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
