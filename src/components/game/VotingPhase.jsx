import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';
import audioService from '../../services/audioService';

export default function VotingPhase({ game, currentPlayer }) {
  const { castVote } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [voted, setVoted] = useState(false);

  const hasVoted = game.rounds[game.currentRound - 1]?.votes?.some(
    (v) => v.voterId === currentPlayer?.userId
  );

  const availablePlayers = game.players.filter(
    (p) => !p.isEliminated && p.userId !== currentPlayer?.userId
  );

  const handleVote = () => {
    if (!selectedPlayer) {
      toast.error('Please select a player to vote for');
      return;
    }

    castVote(selectedPlayer);
    setVoted(true);
    audioService.play('vote');
    toast.success('Vote cast!');
  };

  if (hasVoted || voted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl text-center"
        >
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            VOTING PHASE
          </h2>
          <p className="text-neon-green font-bold text-lg mb-4">
            ✓ Vote cast! Waiting for others...
          </p>
          <p className="text-gray-400">
            Results will be shown when all players have voted
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
          <h2 className="text-3xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            VOTING PHASE
          </h2>
          <p className="text-gray-300 mb-6">
            Vote for who you think is the spy
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <AnimatePresence>
            {availablePlayers.map((player, index) => (
              <motion.button
                key={player.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPlayer(player.userId)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlayer === player.userId
                    ? 'bg-neon-purple/20 border-neon-purple shadow-lg shadow-neon-purple/20'
                    : 'bg-dark-bg border-dark-border hover:border-neon-cyan/50'
                }`}
              >
                <div className="mx-auto mb-2 flex justify-center">
                  <Avatar user={player} size="lg" />
                </div>
                <p className="text-sm font-medium text-gray-300 truncate">
                  {player.username}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleVote}
          disabled={!selectedPlayer}
        >
          CAST VOTE
        </Button>
      </motion.div>
    </div>
  );
}

