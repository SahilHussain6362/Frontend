import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';

export default function PlayerList({ players, currentUserId }) {
  return (
    <div className="h-full bg-dark-surface/80 backdrop-blur-lg border border-dark-border rounded-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-display font-bold text-gray-300 mb-4">Players</h2>
      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentUser = player.userId === currentUserId;
          const isEliminated = player.isEliminated;
          
          return (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-2 transition-all ${
                isCurrentUser
                  ? 'bg-neon-purple/20 border-neon-purple'
                  : isEliminated
                  ? 'bg-dark-bg/50 border-dark-border opacity-50'
                  : 'bg-dark-bg border-dark-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar user={player} size="md" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-neon-cyan' : 'text-gray-300'}`}>
                    {player.username}
                    {isCurrentUser && ' (You)'}
                  </p>
                  {isEliminated && (
                    <p className="text-xs text-neon-red">Eliminated</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

