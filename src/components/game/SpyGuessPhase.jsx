import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import audioService from '../../services/audioService';

export default function SpyGuessPhase({ game, currentPlayer }) {
  const { submitSpyGuess } = useGame();
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isSpy = currentPlayer?.role === 'spy';
  const hasGuessed = game.rounds[game.currentRound - 1]?.spyGuess;

  if (!isSpy) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl text-center"
        >
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            SPY GUESS PHASE
          </h2>
          <p className="text-gray-300">
            The spy is trying to guess the word...
          </p>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!guess.trim()) {
      toast.error('Please enter a guess');
      return;
    }

    submitSpyGuess(guess.trim());
    setSubmitted(true);
    audioService.play('click');
    toast.success('Guess submitted!');
  };

  if (hasGuessed || submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl text-center"
        >
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            SPY GUESS PHASE
          </h2>
          <p className="text-neon-green font-bold text-lg mb-4">
            ✓ Guess submitted! Waiting for results...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-red to-neon-pink bg-clip-text text-transparent">
            🕵️ SPY GUESS PHASE
          </h2>
          <p className="text-gray-300 mb-2">
            You are the spy! Try to guess the word:
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Category: {game.category}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-red focus:ring-2 focus:ring-neon-red/20 transition-all text-center text-lg"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button size="lg" onClick={handleSubmit} className="w-full">
            SUBMIT GUESS
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

