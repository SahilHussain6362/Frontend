import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { userAPI, roomAPI } from '../services/apiService';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import AvatarSelector from '../components/common/AvatarSelector';
import toast from 'react-hot-toast';
import audioService from '../services/audioService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const { room, joinRoom, updateAvatar, updateName, setRoomState } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '/assets/images/Avatar/Boy_avatar_1.png');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // If user is already in a room, navigate to lobby
    if (room) {
      if (room.status === 'playing') {
        navigate(`/game/${room.roomId}`);
      } else {
        navigate('/lobby');
      }
    }
  }, [isAuthenticated, room, navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setSelectedAvatar(user.avatar || '/assets/images/Avatar/Boy_avatar_1.png');
    }
  }, [user]);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setJoining(true);
    try {
      const { roomAPI } = await import('../services/apiService');
      const response = await roomAPI.joinRoom({ roomCode: roomCode.trim(), asSpectator: false });
      const roomData = response.data.data;

      if (roomData) {
        // Persist room state locally so UI does not ask again
        setRoomState(roomData);
        try {
          localStorage.setItem('room', JSON.stringify(roomData));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }

        toast.success('Joined room!');
        setRoomCode('');
        navigate('/lobby');
      }

      // Ensure real-time socket join is attempted
      joinRoom(roomCode.trim());
      setJoining(false);
    } catch (error) {
      setJoining(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to join room';
      toast.error(errorMessage);
      console.error('Join room error:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setSaving(true);
    try {
      // Update profile via API
      await userAPI.updateProfile({
        username: username.trim(),
        avatar: selectedAvatar,
      });

      // Update avatar in room if in a room
      if (room) {
        updateAvatar(selectedAvatar);
        updateName(username.trim());
      }

      toast.success('Profile updated!');
      setEditingProfile(false);

      // Refresh user data in context
      await refreshUser();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRoom = () => {
    audioService.play('click');
    // Create room immediately and navigate to lobby
    (async () => {
      try {
        const response = await roomAPI.createRoom({ maxPlayers: 8, isPrivate: false });
        const roomData = response.data.data;
        if (roomData) {
          setRoomState(roomData);
          try {
            localStorage.setItem('room', JSON.stringify(roomData));
          } catch (err) {
            console.error('Failed to persist room to localStorage', err);
          }
          joinRoom(roomData.roomCode);
          toast.success('Room created!');
          navigate('/lobby');
        }
      } catch (error) {
        console.error('Create room from dashboard failed', error);
        toast.error('Failed to create room');
        navigate('/lobby');
      }
    })();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4">
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
        className="relative z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-dark-surface/90 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-black mb-2 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              DASHBOARD
            </h1>
            <p className="text-gray-300">Welcome back, {user.username}!</p>
          </div>

          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-200">Profile</h2>
              {!editingProfile && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                    placeholder="Enter your username"
                    maxLength={20}
                  />
                </div>

                <AvatarSelector
                  selectedAvatar={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setEditingProfile(false);
                      setUsername(user.username || '');
                      setSelectedAvatar(user.avatar || '/assets/images/Avatar/Boy_avatar_1.png');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6 p-6 bg-dark-bg/50 rounded-xl border border-dark-border">
                <Avatar user={user} size="xl" />
                <div>
                  <p className="text-xl font-bold text-gray-200">{user.username}</p>
                  <p className="text-sm text-gray-400">
                    {user.isGuest ? 'Guest Account' : user.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-gray-200 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handleCreateRoom}
              >
                CREATE ROOM
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/lobby')}
              >
                GO TO LOBBY
              </Button>
            </div>
          </div>

          {/* Join Room */}
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-200 mb-4">Join Room</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                maxLength={6}
                className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all text-center text-2xl font-display tracking-wider"
              />
              <Button
                size="lg"
                variant="secondary"
                onClick={handleJoinRoom}
                disabled={joining}
              >
                {joining ? 'Joining...' : 'JOIN'}
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

