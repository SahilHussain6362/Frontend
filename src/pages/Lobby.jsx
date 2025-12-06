import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { roomAPI } from '../services/apiService';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';
import audioService from '../services/audioService';

export default function Lobby() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { room, joinRoom, leaveRoom, toggleReady, startGame, setRoomState } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (room && room.status === 'playing') {
      navigate(`/game/${room.roomId}`);
    }
  }, [room, navigate]);

  // Check for room restoration on mount
  useEffect(() => {
    if (user && !room) {
      // Wait a bit for socket to connect and check room
      const timer = setTimeout(() => {
        // Room restoration is handled by socket check_room event
        // This is just a fallback to ensure we check
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, room]);

  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      const response = await roomAPI.createRoom({ maxPlayers: 8, isPrivate: false });
      const roomData = response.data.data;
      
      // Set room state immediately from API response
      if (roomData) {
        setRoomState(roomData);
        toast.success('Room created!');
      }
      
      // Also join via socket for real-time updates
      if (roomData?.roomCode) {
        joinRoom(roomData.roomCode);
      }
      
      setCreating(false);
    } catch (error) {
      setCreating(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create room';
      toast.error(errorMessage);
      console.error('Create room error:', error);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setJoining(true);
    try {
      // First, join via REST API
      const response = await roomAPI.joinRoom({ roomCode: roomCode.trim(), asSpectator: false });
      const roomData = response.data.data;
      
      // Set room state immediately from API response for instant feedback
      if (roomData) {
        setRoomState(roomData);
        toast.success('Joined room!');
        setRoomCode('');
      }
      
      // Also join via socket for real-time updates
      joinRoom(roomCode.trim());
      
      setJoining(false);
    } catch (error) {
      setJoining(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to join room';
      toast.error(errorMessage);
      console.error('Join room error:', error);
    }
  };

  const handleLeaveRoom = async () => {
    if (room) {
      try {
        await roomAPI.leaveRoom({ roomCode: room.roomCode });
        leaveRoom();
        toast.success('Left room');
      } catch (error) {
        toast.error('Failed to leave room');
      }
    }
  };

  const handleStartGame = () => {
    if (room && room.players.length >= 4) {
      const allReady = room.players.every((p) => p.isReady);
      if (allReady) {
        startGame();
      } else {
        toast.error('All players must be ready');
      }
    } else {
      toast.error('Need at least 4 players to start');
    }
  };

  const canStart = room && room.players.length >= 4 && room.players.every((p) => p.isReady);
  const isHost = room && (() => {
    const hostUserId = typeof room.host === 'object'
      ? room.host._id?.toString() || room.host.userId?.toString()
      : room.host?.toString();
    const currentUserId = user?._id?.toString() || user?.userId?.toString();
    return hostUserId === currentUserId;
  })();

  if (room) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/images/LOBBY_BACKGROUND_Player List_Ready State.766Z.png" 
            alt="Lobby Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-bg/70"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  ROOM: {room.roomCode}
                </h1>
                <p className="text-gray-300 text-sm mt-1">
                  {room.players.length} / {room.settings.maxPlayers} players
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={handleLeaveRoom}>
                  Leave
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>

            {/* Room Code Display */}
            <div className="bg-dark-surface/90 backdrop-blur-lg border-2 border-neon-cyan/50 rounded-xl p-6 mb-6 text-center shadow-2xl">
              <p className="text-gray-300 text-sm mb-3">Share this code to invite friends</p>
              <p className="text-5xl md:text-6xl font-display font-black text-neon-cyan tracking-wider mb-3">
                {room.roomCode}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room.roomCode);
                  toast.success('Room code copied!');
                }}
                className="text-neon-cyan hover:text-neon-purple text-sm transition-colors font-medium"
              >
                Copy Code
              </button>
            </div>

            {/* Players List */}
            <div className="mb-6 flex-1">
              <h2 className="text-2xl font-display font-bold text-gray-200 mb-4">Players</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {room.players.map((player, index) => (
                    <motion.div
                      key={player.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-dark-surface/90 backdrop-blur-lg border-2 rounded-xl p-4 text-center transition-all ${
                        player.isReady
                          ? 'border-neon-green shadow-lg shadow-neon-green/30'
                          : 'border-dark-border'
                      }`}
                    >
                      <div className="mx-auto mb-3 flex justify-center">
                        <Avatar user={player} size="lg" />
                      </div>
                      <p className="text-sm font-medium text-gray-200 truncate mb-1">
                        {player.username}
                      </p>
                      {player.isReady && (
                        <p className="text-xs text-neon-green font-bold">✓ Ready</p>
                      )}
                      {(() => {
                        const playerUserId = typeof player.userId === 'object' 
                          ? player.userId._id?.toString() || player.userId.userId?.toString()
                          : player.userId?.toString();
                        const hostUserId = typeof room.host === 'object'
                          ? room.host._id?.toString() || room.host.userId?.toString()
                          : room.host?.toString();
                        return playerUserId === hostUserId;
                      })() && (
                        <p className="text-xs text-neon-cyan font-bold mt-1">👑 Host</p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center pb-4">
              <Button
                size="lg"
                variant={(() => {
                  const currentUserId = user?._id?.toString() || user?.userId?.toString();
                  const player = room.players.find((p) => {
                    const playerUserId = typeof p.userId === 'object'
                      ? p.userId._id?.toString() || p.userId.userId?.toString()
                      : p.userId?.toString();
                    return playerUserId === currentUserId;
                  });
                  return player?.isReady ? 'secondary' : 'primary';
                })()}
                onClick={toggleReady}
                className="min-w-[180px]"
              >
                {(() => {
                  const currentUserId = user?._id?.toString() || user?.userId?.toString();
                  const player = room.players.find((p) => {
                    const playerUserId = typeof p.userId === 'object'
                      ? p.userId._id?.toString() || p.userId.userId?.toString()
                      : p.userId?.toString();
                    return playerUserId === currentUserId;
                  });
                  return player?.isReady ? 'NOT READY' : 'READY';
                })()}
              </Button>
              {isHost && (
                <Button
                  size="lg"
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className="min-w-[180px]"
                >
                  START GAME
                </Button>
              )}
            </div>

            {room.players.length < 4 && (
              <p className="text-center text-gray-300 text-sm mb-4">
                Need at least 4 players to start
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/images/LOBBY_BACKGROUND_Player List_Ready State.766Z.png" 
          alt="Lobby Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark-bg/70"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-black mb-2 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              LOBBY
            </h1>
            <p className="text-gray-300">Create or join a room</p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCreateRoom}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'CREATE ROOM'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-surface text-gray-400">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                maxLength={6}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all text-center text-2xl font-display tracking-wider"
              />
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleJoinRoom}
                disabled={joining}
              >
                {joining ? 'Joining...' : 'JOIN ROOM'}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
