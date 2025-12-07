import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';
import audioService from '../services/audioService';

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  // Initialize room state from localStorage so UI doesn't ask again on navigation/refresh
  const [room, setRoom] = useState(() => {
    try {
      const saved = localStorage.getItem('room');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });
  const [game, setGame] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Ensure socket is connected
    const token = localStorage.getItem('token');
    if (token && !socketService.connected) {
      socketService.connect(token);
    }

    // Room events
    socketService.on('room_joined', (data) => {
      if (data.room) {
        // Clear messages when joining a new room
        setMessages([]);
        setTypingUsers([]);
        // Create a new object reference with new array references to ensure React detects the change
        // This should include ALL current players in the room
        setRoom({
          ...data.room,
          players: data.room.players ? [...data.room.players] : []
        });
        try {
          localStorage.setItem('room', JSON.stringify(data.room));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }
        audioService.play('click');
        console.log('Room joined via socket - socket is now in room:', data.room.roomCode, 'Players:', data.room.players?.length, 'Player list:', data.room.players?.map(p => p.username));
      }
    });

    socketService.on('room_updated', (data) => {
      if (data.room) {
        // Always update room state when we receive room_updated event
        // This ensures all players see real-time updates
        // Create a new object reference with new array references to ensure React detects the change
        setRoom({
          ...data.room,
          players: data.room.players ? [...data.room.players] : []
        });
        try {
          localStorage.setItem('room', JSON.stringify(data.room));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }
        console.log('Room updated:', data.room.roomCode, 'Players:', data.room.players?.length, 'Player list:', data.room.players?.map(p => p.username));
      }
    });

    // Handle room state response if backend supports get_room_state
    socketService.on('room_state', (data) => {
      if (data.room) {
        setRoom({
          ...data.room,
          players: data.room.players ? [...data.room.players] : []
        });
        try {
          localStorage.setItem('room', JSON.stringify(data.room));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }
        console.log('Room state received:', data.room.roomCode, 'Players:', data.room.players?.length);
      }
    });

    socketService.on('room_left', (data) => {
      setRoom(null);
      setGame(null);
      setMessages([]);
      setTypingUsers([]);
      try {
        localStorage.removeItem('room');
      } catch (err) {
        console.error('Failed to remove room from localStorage', err);
      }
      console.log('Room left');
    });

    socketService.on('room_error', (error) => {
      console.error('Room error:', error);
      // Show error to user if we have a message
      if (error.message) {
        // Import toast here or use window notification
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error(error.message);
        }
      }
    });

    socketService.on('player_joined', (data) => {
      console.log('Player joined:', data.username);
      // Update room state immediately if room data is provided
      // This ensures all players see the new player instantly
      if (data.room) {
        // Create a new object reference with new array references to ensure React detects the change
        setRoom({
          ...data.room,
          players: data.room.players ? [...data.room.players] : []
        });
        try {
          localStorage.setItem('room', JSON.stringify(data.room));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }
        console.log('Room updated after player joined:', data.room.roomCode, 'Players:', data.room.players?.length);
      } else if (room) {
        // If room data not provided but we have a room, request an update
        // This ensures we get the latest player list
        console.log('player_joined event received without room data - requesting room update');
        socketService.emit('get_room_state', { roomCode: room.roomCode });
      } else {
        // If no room data and no local room, wait for room_updated
        console.warn('player_joined event received without room data - waiting for room_updated event');
      }
    });

    socketService.on('player_left', (data) => {
      console.log('Player left:', data.username);
      // Update room state immediately if room data is provided
      // This ensures all players see the player removal instantly
      if (data.room) {
        // Create a new object reference with new array references to ensure React detects the change
        setRoom({
          ...data.room,
          players: data.room.players ? [...data.room.players] : []
        });
        try {
          localStorage.setItem('room', JSON.stringify(data.room));
        } catch (err) {
          console.error('Failed to persist room to localStorage', err);
        }
        console.log('Room updated after player left:', data.room.roomCode, 'Players:', data.room.players?.length);
      } else if (room) {
        // If room data not provided but we have a room, request an update
        console.log('player_left event received without room data - requesting room update');
        socketService.emit('get_room_state', { roomCode: room.roomCode });
      } else {
        // If no room data and no local room, wait for room_updated
        console.warn('player_left event received without room data - waiting for room_updated event');
      }
    });

    // Game events
    socketService.on('game_start', (data) => {
      setGame(data.game);
      audioService.play('spyReveal');
      audioService.playMusic();
    });

    socketService.on('player_turn', (data) => {
      // Update game state when player turn changes
      if (data.game) {
        setGame(data.game);
      }
    });

    socketService.on('game_state_update', (data) => {
      setGame(data.game);
    });

    socketService.on('game_end', (data) => {
      setGame(data.game);
      audioService.stopMusic();
      audioService.play('spyReveal');
    });

    // Clue events
    socketService.on('clue_phase_start', (data) => {
      // Update game state if provided, otherwise keep current
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('timer');
    });

    socketService.on('clue_submitted', (data) => {
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('click');
    });

    // Voting events
    socketService.on('voting_phase_start', (data) => {
      // Update game state if provided
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('vote');
    });

    socketService.on('vote_casted', (data) => {
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('vote');
    });

    socketService.on('voting_results', (data) => {
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('spyReveal');
    });

    socketService.on('spy_guess_start', (data) => {
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('timer');
    });

    socketService.on('spy_guess_result', (data) => {
      if (data.game) {
        setGame(data.game);
      }
      audioService.play('spyReveal');
    });

    socketService.on('round_start', (data) => {
      if (data.game) {
        setGame(data.game);
      }
    });

    socketService.on('round_end', (data) => {
      if (data.game) {
        setGame(data.game);
      }
    });

    socketService.on('clue_phase_end', (data) => {
      if (data.game) {
        setGame(data.game);
      }
    });

    socketService.on('voting_phase_end', (data) => {
      if (data.game) {
        setGame(data.game);
      }
    });

    socketService.on('error', (error) => {
      console.error('Socket error:', error);
      // Show error to user if it's a chat-related error
      if (error.message && typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.message);
      }
    });

    // Chat events
    socketService.on('message_received', (data) => {
      console.log('Message received event:', data);
      if (data && data.message) {
        const message = data.message;
        console.log('Adding message to state:', message);
        setMessages((prev) => {
          // Remove any pending messages with the same content from the same user
          const filtered = prev.filter(m => {
            // Remove temporary/pending messages that match this confirmed message
            if (m.isPending && m.sender?.userId?.toString() === message.sender?.userId?.toString() && m.message === message.message) {
              return false;
            }
            return true;
          });
          
          // Check if message already exists (prevent duplicates)
          const exists = filtered.some(m => {
            const mId = m._id?.toString() || m.id?.toString();
            const msgId = message._id?.toString() || message.id?.toString();
            return mId && msgId && mId === msgId;
          });
          
          if (exists) {
            console.log('Message already exists, skipping:', message._id);
            return filtered;
          }
          
          return [...filtered, message];
        });
      } else {
        console.warn('Message received but data structure is invalid:', data);
      }
    });

    socketService.on('typing_start', (data) => {
      if (data.userId !== user.userId) {
        setTypingUsers((prev) => [...new Set([...prev, data.username])]);
      }
    });

    socketService.on('typing_stop', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    });

    return () => {
      socketService.off('room_joined');
      socketService.off('room_updated');
      socketService.off('room_left');
      socketService.off('room_error');
      socketService.off('room_status');
      socketService.off('room_state');
      socketService.off('player_joined');
      socketService.off('player_left');
      socketService.off('game_start');
      socketService.off('game_state_update');
      socketService.off('game_end');
      socketService.off('clue_phase_start');
      socketService.off('clue_submitted');
      socketService.off('voting_phase_start');
      socketService.off('vote_casted');
      socketService.off('voting_results');
      socketService.off('message_received');
      socketService.off('typing_start');
      socketService.off('typing_stop');
      socketService.off('player_turn');
      socketService.off('spy_guess_start');
      socketService.off('spy_guess_result');
      socketService.off('round_start');
      socketService.off('round_end');
      socketService.off('clue_phase_end');
      socketService.off('voting_phase_end');
      socketService.off('error');
    };
  }, [user]);

  const joinRoom = (roomCode) => {
    if (!roomCode) {
      console.error('joinRoom: No room code provided');
      return;
    }

    // Ensure socket is connected
    const token = localStorage.getItem('token');
    if (!socketService.connected) {
      console.warn('Socket not connected, attempting to connect...');
      if (token) {
        socketService.connect(token);
        // Wait for connection, then emit
        // Use a promise-based approach to ensure connection is ready
        const waitForConnection = () => {
          return new Promise((resolve, reject) => {
            if (socketService.connected) {
              resolve();
              return;
            }
            
            // Check if socket exists and listen for connect event
            const checkInterval = setInterval(() => {
              if (socketService.connected) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
              clearInterval(checkInterval);
              if (!socketService.connected) {
                reject(new Error('Socket connection timeout'));
              }
            }, 5000);
          });
        };

        waitForConnection()
          .then(() => {
            console.log('Socket connected, joining room:', roomCode);
            // Small delay to ensure all listeners are registered
            setTimeout(() => {
              socketService.emit('join_room', { roomCode });
            }, 100);
          })
          .catch((error) => {
            console.error('Socket connection failed:', error);
          });
      } else {
        console.error('No token available for socket connection');
      }
      return;
    }

    console.log('Joining room via socket:', roomCode);
    // Small delay to ensure all listeners are registered
    setTimeout(() => {
      socketService.emit('join_room', { roomCode });
    }, 50);
  };

  // When leaving room locally, clear storage too
  const leaveRoomLocal = () => {
    try {
      localStorage.removeItem('room');
    } catch (err) {
      console.error('Failed to remove room from localStorage', err);
    }
    setRoom(null);
    setGame(null);
    setMessages([]);
    setTypingUsers([]);
  };

  const leaveRoom = () => {
    if (room) {
      socketService.emit('leave_room', { roomCode: room.roomCode });
    }
  };

  const toggleReady = () => {
    if (room && user) {
      const currentUserId = user._id?.toString() || user.userId?.toString();
      const currentPlayer = room.players.find((p) => {
        const playerUserId = typeof p.userId === 'object'
          ? p.userId._id?.toString() || p.userId.userId?.toString()
          : p.userId?.toString();
        return playerUserId === currentUserId;
      });
      socketService.emit('player_ready', {
        roomCode: room.roomCode,
        isReady: !currentPlayer?.isReady,
      });
    }
  };

  const startGame = (category = null) => {
    if (room) {
      // If no category provided, select a random one
      const categories = ['food', 'animals', 'places', 'movies', 'jobs', 'sports', 'countries', 'objects'];
      const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];

      socketService.emit('game_start', {
        roomCode: room.roomCode,
        category: selectedCategory
      });
    }
  };

  const submitClue = (clue) => {
    if (game) {
      socketService.emit('submit_clue', { gameId: game.gameId, clue });
    }
  };

  const castVote = (targetUserId) => {
    if (game) {
      socketService.emit('cast_vote', { gameId: game.gameId, votedForId: targetUserId });
    }
  };

  const submitSpyGuess = (word) => {
    if (game) {
      socketService.emit('submit_spy_guess', { gameId: game.gameId, word });
    }
  };

  const sendMessage = (messageText) => {
    if (room || game) {
      const roomCode = room?.roomCode || game?.roomId;
      if (!roomCode) {
        console.error('Cannot send message: No room code available', { room, game });
        return;
      }
      
      if (!socketService.connected) {
        console.error('Cannot send message: Socket not connected. Attempting to connect...');
        const token = localStorage.getItem('token');
        if (token) {
          socketService.connect(token);
          // Wait a bit for connection, then retry
          setTimeout(() => {
            if (socketService.connected) {
              socketService.emit('send_message', {
                roomCode,
                message: messageText,
                messageType: 'chat',
              });
            } else {
              console.error('Socket still not connected after retry');
            }
          }, 1000);
        }
        return;
      }
      
      // Optimistic update - add message to local state immediately
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        sender: {
          userId: user?._id || user?.userId,
          username: user?.username || 'You',
        },
        message: messageText,
        messageType: 'chat',
        createdAt: new Date(),
        isPending: true, // Mark as pending until confirmed by server
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      
      console.log('Sending message via socket:', { roomCode, message: messageText, socketConnected: socketService.connected });
      socketService.emit('send_message', {
        roomCode,
        message: messageText,
        messageType: 'chat',
      });
    } else {
      console.error('Cannot send message: No room or game available', { room, game });
    }
  };

  const sendTyping = () => {
    if (room || game) {
      socketService.emit('typing_start', {
        roomCode: room?.roomCode || game?.roomId,
      });
    }
  };

  const stopTyping = () => {
    if (room || game) {
      socketService.emit('typing_stop', {
        roomCode: room?.roomCode || game?.roomId,
      });
    }
  };

  const setRoomState = (roomData) => {
    setRoom(roomData);
  };

  const updateAvatar = (avatar) => {
    if (room) {
      socketService.emit('update_avatar', {
        roomCode: room.roomCode,
        avatar,
      });
    }
  };

  const updateName = (username) => {
    if (room) {
      socketService.emit('update_name', {
        roomCode: room.roomCode,
        username,
      });
    }
  };

  const value = {
    room,
    game,
    messages,
    typingUsers,
    joinRoom,
    leaveRoom,
    leaveRoomLocal,
    toggleReady,
    startGame,
    submitClue,
    castVote,
    submitSpyGuess,
    sendMessage,
    sendTyping,
    stopTyping,
    setRoomState,
    updateAvatar,
    updateName,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

