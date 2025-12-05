import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import Button from '../components/common/Button';
import Chat from '../components/game/Chat';
import PlayerList from '../components/game/PlayerList';
import CluePhase from '../components/game/CluePhase';
import VotingPhase from '../components/game/VotingPhase';
import SpyGuessPhase from '../components/game/SpyGuessPhase';
import GameEnd from '../components/game/GameEnd';
import audioService from '../services/audioService';

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { game, leaveRoom } = useGame();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!game) {
      // Try to get game from API if not in context
      navigate('/lobby');
    }
  }, [game, navigate]);

  useEffect(() => {
    if (!game) return;

    // Timer logic based on game state
    let interval;
    if (game.currentState === 'clue_phase') {
      setTimeLeft(60);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (game.currentState === 'voting_phase') {
      setTimeLeft(30);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (game.currentState === 'spy_guess_phase') {
      setTimeLeft(30);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [game?.currentState]);

  if (!game) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentPlayer = game.players.find((p) => p.userId === user?.userId);
  const isSpy = currentPlayer?.role === 'spy';
  const isEliminated = currentPlayer?.isEliminated;

  const handleLeave = () => {
    leaveRoom();
    navigate('/lobby');
  };

  // Determine which background to use based on game state
  const getBackgroundImage = () => {
    if (game.currentState === 'game_end') {
      return '/assets/images/SPY_REVEAL_SCREEN.696Z.png';
    }
    return '/assets/images/GAME_SCREEN_BACKGROUND_Clue Phase_Voting Phase_Spy Guess.019Z.png';
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={getBackgroundImage()} 
          alt="Game Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark-bg/60"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-dark-surface/80 backdrop-blur-lg border-b border-dark-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-black bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                ROUND {game.currentRound}
              </h1>
              <p className="text-sm text-gray-300 capitalize">
                {game.currentState.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {timeLeft > 0 && (
                <div className="bg-dark-bg border border-neon-cyan/30 rounded-lg px-4 py-2">
                  <p className="text-neon-cyan font-display font-bold text-xl">
                    {timeLeft}s
                  </p>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLeave}>
                Leave Game
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 p-4 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Left Sidebar - Players */}
          <div className="w-64 flex-shrink-0">
            <PlayerList players={game.players} currentUserId={user?.userId} />
          </div>

          {/* Center - Game Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {game.currentState === 'game_end' ? (
                <GameEnd key="end" game={game} currentPlayer={currentPlayer} />
              ) : game.currentState === 'spy_guess_phase' ? (
                <SpyGuessPhase key="spy" game={game} currentPlayer={currentPlayer} />
              ) : game.currentState === 'voting_phase' ? (
                <VotingPhase key="vote" game={game} currentPlayer={currentPlayer} />
              ) : (
                <CluePhase key="clue" game={game} currentPlayer={currentPlayer} />
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Chat */}
          <div className="w-80 flex-shrink-0">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
