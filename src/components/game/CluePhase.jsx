import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import audioService from '../../services/audioService';

export default function CluePhase({ game, currentPlayer }) {
  const { submitClue } = useGame();
  const [clue, setClue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isSpy = currentPlayer?.role === 'spy';
  const currentTurnPlayer = game.players[game.currentTurn];
  const isMyTurn = currentTurnPlayer?.userId === currentPlayer?.userId;
  const currentRoundData = game.rounds?.[game.currentRound - 1];
  const hasSubmitted = currentRoundData?.clues?.some(
    (c) => c.userId === currentPlayer?.userId
  ) || submitted;

  useEffect(() => {
    setSubmitted(hasSubmitted || false);
  }, [hasSubmitted]);

  const handleSubmit = () => {
    if (!clue.trim()) {
      toast.error('Please enter a clue');
      return;
    }

    if (clue.length > 20) {
      toast.error('Clue must be 20 characters or less');
      return;
    }

    submitClue(clue.trim());
    setSubmitted(true);
    audioService.play('click');
    toast.success('Clue submitted!');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            CLUE PHASE
          </h2>
          
          {isSpy ? (
            <div className="space-y-4">
              <p className="text-xl text-neon-red font-bold">
                🕵️ YOU ARE THE SPY!
              </p>
              <p className="text-gray-300">
                You don't know the word. Give a clue that could apply to anything!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-300">Your word is:</p>
              <p className="text-4xl font-display font-black text-neon-green">
                {currentPlayer?.word?.toUpperCase()}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Category: {game.category}
              </p>
            </div>
          )}

          {isMyTurn && !submitted && (
            <div className="mt-8 space-y-4">
              <p className="text-gray-300">It's your turn! Give a clue:</p>
              <input
                type="text"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder="Enter your clue (max 20 characters)"
                maxLength={20}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all text-center text-lg"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Button size="lg" onClick={handleSubmit} className="w-full">
                SUBMIT CLUE
              </Button>
            </div>
          )}

          {submitted && (
            <div className="mt-8">
              <p className="text-neon-green font-bold text-lg">
                ✓ Clue submitted! Waiting for others...
              </p>
            </div>
          )}

          {!isMyTurn && !submitted && (
            <div className="mt-8">
              <p className="text-gray-400">
                Waiting for {currentTurnPlayer?.username} to give their clue...
              </p>
            </div>
          )}

          {/* Show submitted clues */}
          {game.rounds[game.currentRound - 1]?.clues && (
            <div className="mt-8 space-y-2">
              <p className="text-sm text-gray-400">Submitted clues:</p>
              <div className="grid grid-cols-2 gap-2">
                {game.rounds[game.currentRound - 1].clues.map((c, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-bg border border-dark-border rounded p-2 text-sm text-gray-300"
                  >
                    {c.clue}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

