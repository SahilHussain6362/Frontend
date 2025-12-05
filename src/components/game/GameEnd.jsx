import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useGame } from '../../contexts/GameContext';

export default function GameEnd({ game, currentPlayer }) {
  const navigate = useNavigate();
  const { leaveRoom } = useGame();

  const winner = game.winner;
  const isSpy = currentPlayer?.role === 'spy';
  const spyWon = winner === 'spy';
  const playerWon = spyWon ? isSpy : !isSpy;

  const handleBackToLobby = () => {
    leaveRoom();
    navigate('/lobby');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl mb-4"
        >
          {playerWon ? '🎉' : '😔'}
        </motion.div>

        <h2 className="text-4xl font-display font-black mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          GAME OVER
        </h2>

        <div className="mb-8 space-y-4">
          {playerWon ? (
            <p className="text-2xl text-neon-green font-bold">YOU WON!</p>
          ) : (
            <p className="text-2xl text-neon-red font-bold">YOU LOST!</p>
          )}

          <p className="text-gray-300">
            {spyWon ? 'The spy won!' : 'The villagers won!'}
          </p>

          {!isSpy && (
            <div className="mt-6 p-4 bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-400 mb-2">The word was:</p>
              <p className="text-2xl font-display font-black text-neon-green">
                {currentPlayer?.word?.toUpperCase()}
              </p>
            </div>
          )}

          {isSpy && game.rounds[game.currentRound - 1]?.spyGuess && (
            <div className="mt-6 p-4 bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Your guess was:</p>
              <p className="text-xl font-display font-bold text-gray-300">
                {game.rounds[game.currentRound - 1].spyGuess.toUpperCase()}
              </p>
              {game.rounds[game.currentRound - 1].spyGuess.toLowerCase() === currentPlayer?.word?.toLowerCase() && (
                <p className="text-sm text-neon-green mt-2">✓ Correct!</p>
              )}
            </div>
          )}

          {/* Show all players and their roles */}
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-400 mb-3">Players:</p>
            <div className="grid grid-cols-2 gap-2">
              {game.players.map((player) => (
                <div
                  key={player.userId}
                  className="bg-dark-bg border border-dark-border rounded p-2 text-sm"
                >
                  <p className="text-gray-300">{player.username}</p>
                  <p className={`text-xs ${player.role === 'spy' ? 'text-neon-red' : 'text-neon-green'}`}>
                    {player.role === 'spy' ? '🕵️ Spy' : '👤 Villager'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button size="lg" onClick={handleBackToLobby} className="w-full">
          BACK TO LOBBY
        </Button>
      </motion.div>
    </div>
  );
}

