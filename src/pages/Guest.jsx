import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import AvatarSelector from '../components/common/AvatarSelector';
import toast from 'react-hot-toast';

export default function Guest() {
  const navigate = useNavigate();
  const { guestLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/assets/images/Avatar/Boy_avatar_1.png');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setLoading(true);

    const result = await guestLogin(username.trim(), selectedAvatar);
    
    if (result.success) {
      toast.success('Welcome, guest!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Guest login failed');
    }
    
    setLoading(false);
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
        <div className="absolute inset-0 bg-dark-bg/70"></div>
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-black mb-2 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              QUICK PLAY
            </h1>
            <p className="text-gray-300">Enter as a guest and start playing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 transition-all"
                placeholder="Enter your username"
                maxLength={20}
              />
            </div>

            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
              className="mb-5"
            />

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Joining...' : 'CONTINUE AS GUEST'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Want to save your progress?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-neon-pink hover:text-neon-cyan transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
