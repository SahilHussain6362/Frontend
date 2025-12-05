# Spy Game Frontend

A professional-grade React frontend for the Spy Game multiplayer experience.

## Features

✨ **Professional UI/UX**
- Modern, dark-themed interface with neon accents
- Smooth animations using Framer Motion
- Responsive design that works on all devices
- Professional background effects and gradients

🎮 **Game Features**
- User authentication (Login, Register, Guest mode)
- Room creation and joining with room codes
- Real-time multiplayer gameplay
- In-game chat with typing indicators
- Player list with status indicators
- Game phases: Clue, Voting, Spy Guess
- Game end screen with results

🔊 **Audio System**
- Sound effects for UI interactions
- Background music during gameplay
- Graceful handling of missing audio files
- Volume controls (configurable in code)

⚡ **Real-time Communication**
- WebSocket integration for live updates
- Socket.IO for real-time game state
- Automatic reconnection handling

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.IO Client** - Real-time communication
- **Howler.js** - Audio management
- **Axios** - HTTP requests
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running (see backend README)

### Installation

1. Navigate to the frontend directory:
```bash
cd SpyGameFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `SpyGameFrontend` directory (optional):

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

## Project Structure

```
SpyGameFrontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── game/             # Game-specific components
│   │       ├── Chat.jsx
│   │       ├── CluePhase.jsx
│   │       ├── GameEnd.jsx
│   │       ├── PlayerList.jsx
│   │       ├── SpyGuessPhase.jsx
│   │       └── VotingPhase.jsx
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.jsx
│   │   └── GameContext.jsx
│   ├── pages/               # Page components
│   │   ├── Game.jsx
│   │   ├── Guest.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Lobby.jsx
│   │   └── Register.jsx
│   ├── services/            # API and service integrations
│   │   ├── apiService.js
│   │   ├── audioService.js
│   │   └── socketService.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── assets/
│   ├── images/              # Image assets
│   └── sounds/              # Sound effects and music
├── index.html
├── package.json
├── tailwind.config.cjs
├── vite.config.js
└── README.md
```

## Usage

### Authentication

1. **Guest Mode**: Quick play without account
   - Click "Continue as Guest" on login page
   - Enter a username
   - Start playing immediately

2. **Register**: Create a permanent account
   - Click "Sign Up" on login page
   - Enter username, email, and password
   - Account saves your game history and stats

3. **Login**: Sign in to existing account
   - Enter email and password
   - Access your profile and stats

### Playing the Game

1. **Create or Join Room**
   - From lobby, click "CREATE ROOM" or enter a room code
   - Share the room code with friends

2. **Ready Up**
   - Click "READY" when you're prepared
   - Host can start when all players are ready (minimum 4 players)

3. **Gameplay**
   - **Clue Phase**: Give a clue about your word (spy doesn't know the word)
   - **Voting Phase**: Vote for who you think is the spy
   - **Spy Guess**: If spy survives, they guess the word
   - **Game End**: See results and who won

### Features

- **Chat**: Communicate with other players during the game
- **Player List**: See all players and their status
- **Timer**: Visual countdown for each phase
- **Sound Effects**: Audio feedback for actions

## Adding Sound Effects

See `SOUNDS_GUIDE.md` for detailed instructions on adding sound effects and background music.

Required files:
- `click.mp3` - Button clicks
- `vote.mp3` - Voting sounds
- `spy-reveal.mp3` - Game events
- `timer.mp3` - Timer sounds
- `error.mp3` - Error notifications
- `gameplay.mp3` - Background music

Place files in `assets/sounds/` directory.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

Preview production build:
```bash
npm run preview
```

## Customization

### Colors

Edit `tailwind.config.cjs` to change color scheme:
- `neon-purple`: Primary accent
- `neon-cyan`: Secondary accent
- `neon-pink`: Tertiary accent
- `dark-bg`: Background color
- `dark-surface`: Card/surface color

### Audio Volume

Edit `src/services/audioService.js`:
- `masterVolume`: Overall volume (0-1)
- `sfxVolume`: Sound effects volume (0-1)
- `musicVolume`: Background music volume (0-1)

## Troubleshooting

### Socket Connection Issues
- Ensure backend server is running
- Check `VITE_SOCKET_URL` environment variable
- Verify CORS settings on backend

### Audio Not Playing
- Check browser console for errors
- Ensure sound files exist in `assets/sounds/`
- Check browser audio permissions

### Styling Issues
- Clear browser cache
- Restart dev server
- Check Tailwind config is correct

## Contributing

When adding new features:
1. Follow existing code structure
2. Use TypeScript-style prop validation
3. Add error handling
4. Test with multiple players
5. Update this README if needed

## License

See main project LICENSE file.

