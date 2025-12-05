# Frontend Endpoints & Routes

Complete list of all frontend routes/endpoints for the Spy Game application.

**Base URL**: `http://localhost:5173` (or your dev server URL)

---

## Public Routes (No Authentication Required)

### 1. Home/Landing Page
- **Route**: `/`
- **Component**: `Home.jsx`
- **Description**: Main landing page with game title and "Get Started" button
- **Access**: Public (anyone can view)
- **Features**:
  - Game title and tagline
  - "Get Started" button (redirects to guest or lobby based on auth status)
  - "Sign In" button (if not authenticated)
- **URL**: `http://localhost:5173/`

---

### 2. Login Page
- **Route**: `/login`
- **Component**: `Login.jsx`
- **Description**: User login page with email and password
- **Access**: Public
- **Features**:
  - Email and password input
  - "Sign In" button
  - Link to registration page
  - "Continue as Guest" option
- **URL**: `http://localhost:5173/login`

---

### 3. Registration Page
- **Route**: `/register`
- **Component**: `Register.jsx`
- **Description**: New user registration page
- **Access**: Public
- **Features**:
  - Username, email, password, and confirm password inputs
  - "Sign Up" button
  - Link to login page
- **URL**: `http://localhost:5173/register`

---

### 4. Guest Login Page
- **Route**: `/guest`
- **Component**: `Guest.jsx`
- **Description**: Quick guest access without account creation
- **Access**: Public
- **Features**:
  - Username input only
  - "Continue as Guest" button
  - Link to registration page
- **URL**: `http://localhost:5173/guest`

---

## Protected Routes (Authentication Required)

### 5. Lobby Page
- **Route**: `/lobby`
- **Component**: `Lobby.jsx`
- **Description**: Room creation and joining interface
- **Access**: Protected (requires authentication)
- **Features**:
  - Create new room button
  - Join room by code input
  - Room management (when in a room):
    - Room code display with copy button
    - Player list with ready status
    - Ready/Not Ready toggle
    - Start Game button (host only)
    - Leave room button
- **URL**: `http://localhost:5173/lobby`
- **Note**: Redirects to `/login` if not authenticated

---

### 6. Game Page
- **Route**: `/game/:gameId`
- **Component**: `Game.jsx`
- **Description**: Main game interface with different phases
- **Access**: Protected (requires authentication)
- **URL Pattern**: `http://localhost:5173/game/{gameId}`
- **Example**: `http://localhost:5173/game/abc123-def456-ghi789`
- **Features**:
  - **Clue Phase**: Players give clues about their word
  - **Voting Phase**: Vote for suspected spy
  - **Spy Guess Phase**: Spy tries to guess the word
  - **Game End**: Results and winner display
  - In-game chat
  - Player list sidebar
  - Timer countdown
  - Leave game button
- **Note**: 
  - Redirects to `/login` if not authenticated
  - Redirects to `/lobby` if game not found
  - Game ID is typically provided by the backend when game starts

---

## Route Flow

### For New Users:
1. `/` (Home) → Click "Get Started"
2. `/guest` → Enter username → Auto-login
3. `/lobby` → Create/Join room
4. `/game/:gameId` → Play game

### For Returning Users:
1. `/` (Home) → Click "Sign In"
2. `/login` → Enter credentials → Auto-redirect to `/lobby`
3. `/lobby` → Create/Join room
4. `/game/:gameId` → Play game

### For Registered Users:
1. `/` (Home) → Click "Sign Up"
2. `/register` → Create account → Auto-redirect to `/lobby`
3. `/lobby` → Create/Join room
4. `/game/:gameId` → Play game

---

## Quick Access URLs

When running locally (`npm run dev`):

```
Home Page:        http://localhost:5173/
Login:            http://localhost:5173/login
Register:         http://localhost:5173/register
Guest Login:      http://localhost:5173/guest
Lobby:            http://localhost:5173/lobby (requires auth)
Game:             http://localhost:5173/game/{gameId} (requires auth)
```

---

## Protected Route Behavior

Routes marked as "Protected" use the `ProtectedRoute` component which:
- Checks if user is authenticated
- Shows loading spinner while checking
- Redirects to `/login` if not authenticated
- Allows access if authenticated

---

## Navigation Flow

```
┌─────────┐
│   /     │ (Home - Public)
└────┬────┘
    │
    ├──→ /login ──→ /lobby ──→ /game/:gameId
    ├──→ /register ──→ /lobby ──→ /game/:gameId
    └──→ /guest ──→ /lobby ──→ /game/:gameId
```

---

## Testing All Pages

To test all pages, follow this sequence:

1. **Home Page**: `http://localhost:5173/`
2. **Login Page**: `http://localhost:5173/login`
3. **Register Page**: `http://localhost:5173/register`
4. **Guest Page**: `http://localhost:5173/guest`
5. **Lobby Page**: 
   - First login/register/guest, then navigate to `http://localhost:5173/lobby`
   - Or click "Get Started" after authentication
6. **Game Page**: 
   - Create/join a room in lobby
   - Start a game (requires 4+ players)
   - Will automatically navigate to `/game/:gameId`

---

## Notes

- All routes use React Router v6
- The `*` route (catch-all) redirects to `/` for any undefined routes
- Authentication state is managed by `AuthContext`
- Game state is managed by `GameContext`
- Toast notifications appear for user feedback
- All pages use the provided background images

---

## Development Tips

- Use browser dev tools to check authentication state
- Check localStorage for `token` and `user` to verify auth
- Game pages require an active game session
- Lobby automatically redirects to game when game starts
- All protected routes will redirect to login if not authenticated

