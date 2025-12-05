# Frontend Testing Guide

Step-by-step guide for testing all frontend pages as a developer.

## Prerequisites

1. **Node.js installed** (version 18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **Backend server running** (optional for full testing, but recommended)
   - The frontend can run independently, but some features require backend
   - Backend should be running on `http://localhost:3000`

## Setup Steps

### 1. Navigate to Frontend Directory

```bash
cd SpyGameBackend/SpyGameFrontend
```

### 2. Install Dependencies (First Time Only)

```bash
npm install
```

This will install all required packages (React, Vite, Tailwind, etc.)

### 3. Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open Browser

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Testing Each Page

### ✅ Page 1: Home/Landing Page

**URL**: `http://localhost:5173/`

**What to check:**
- [ ] Background image displays correctly
- [ ] "SPY GAME" title is visible and styled
- [ ] Subtitle "Find the spy among your friends" appears
- [ ] "GET STARTED" button is visible
- [ ] "SIGN IN" button appears (if not logged in)
- [ ] Buttons are clickable
- [ ] Page is responsive (try resizing browser)

**How to test:**
1. Open `http://localhost:5173/` in browser
2. Verify all elements are visible
3. Click "GET STARTED" - should navigate to guest page
4. Click "SIGN IN" - should navigate to login page

---

### ✅ Page 2: Login Page

**URL**: `http://localhost:5173/login`

**What to check:**
- [ ] Background image displays
- [ ] "SPY GAME" title visible
- [ ] Email input field works
- [ ] Password input field works (hidden)
- [ ] "SIGN IN" button is clickable
- [ ] "Sign up" link works
- [ ] "Continue as Guest" button works
- [ ] Form validation (try submitting empty form)

**How to test:**
1. Navigate to `http://localhost:5173/login`
2. Try entering email and password
3. Click "SIGN IN" (will fail if backend not running - that's OK)
4. Click "Sign up" link - should go to register page
5. Click "Continue as Guest" - should go to guest page

**Note**: If backend is not running, you'll see an error toast. This is expected.

---

### ✅ Page 3: Registration Page

**URL**: `http://localhost:5173/register`

**What to check:**
- [ ] Background image displays
- [ ] All form fields visible (username, email, password, confirm password)
- [ ] Form validation works
- [ ] "SIGN UP" button is clickable
- [ ] "Sign in" link works
- [ ] Password mismatch validation (try different passwords)

**How to test:**
1. Navigate to `http://localhost:5173/register`
2. Fill in the form
3. Try submitting with mismatched passwords - should show error
4. Try submitting with short password (< 6 chars) - should show error
5. Click "Sign in" link - should go to login page

---

### ✅ Page 4: Guest Login Page

**URL**: `http://localhost:5173/guest`

**What to check:**
- [ ] Background image displays
- [ ] Username input field works
- [ ] "CONTINUE AS GUEST" button is clickable
- [ ] "Create an account" link works
- [ ] Form validation (try empty submission)

**How to test:**
1. Navigate to `http://localhost:5173/guest`
2. Enter a username (e.g., "TestUser")
3. Click "CONTINUE AS GUEST"
4. If backend is running, should redirect to lobby
5. If backend not running, will show error toast

---

### ✅ Page 5: Lobby Page (Requires Authentication)

**URL**: `http://localhost:5173/lobby`

**What to check:**
- [ ] Background image displays
- [ ] "CREATE ROOM" button works
- [ ] Room code input field works
- [ ] "JOIN ROOM" button works
- [ ] When in a room:
  - [ ] Room code displays prominently
  - [ ] Copy code button works
  - [ ] Player list shows current players
  - [ ] "READY" / "NOT READY" button works
  - [ ] "START GAME" button appears (if host)
  - [ ] "Leave" button works

**How to test:**

**Option A: With Backend Running**
1. First, login/register/guest to authenticate
2. Navigate to `http://localhost:5173/lobby`
3. Click "CREATE ROOM" - should create a room
4. Verify room code appears
5. Test "READY" button
6. Test "Leave" button

**Option B: Without Backend (UI Only)**
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. In LocalStorage, add:
   ```json
   token: "test-token"
   user:  
   ```
4. Refresh page
5. Navigate to `/lobby`
6. You can see the UI, but buttons won't work without backend

**Quick Auth Test (Browser Console):**
```javascript
// In browser console, run:
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({userId: 'test', username: 'TestUser', isGuest: true}));
// Then refresh and go to /lobby
```

---

### ✅ Page 6: Game Page (Requires Active Game)

**URL**: `http://localhost:5173/game/{gameId}`

**What to check:**
- [ ] Background image displays (different for game end)
- [ ] Header shows round number and game state
- [ ] Timer displays (if in timed phase)
- [ ] Player list sidebar shows all players
- [ ] Chat sidebar works
- [ ] Game phase components render correctly:
  - [ ] Clue Phase: Input field, submit button
  - [ ] Voting Phase: Player selection, vote button
  - [ ] Spy Guess Phase: Guess input, submit button
  - [ ] Game End: Results display
- [ ] "Leave Game" button works

**How to test:**

**Full Test (Requires Backend + Multiple Players):**
1. Start backend server
2. Open multiple browser windows/tabs (or use incognito)
3. Login/register in each window
4. Create/join same room in all windows
5. All players click "READY"
6. Host clicks "START GAME"
7. Game page should load automatically
8. Test each phase as game progresses

**UI-Only Test:**
1. Authenticate (see Lobby section above)
2. Manually navigate to: `http://localhost:5173/game/test-game-id`
3. You'll see the game UI structure
4. Note: Game logic won't work without backend connection

---

## Quick Testing Checklist

### Without Backend (UI/Visual Testing)
- [x] All pages load without errors
- [x] Background images display
- [x] Buttons are visible and styled
- [x] Forms have proper inputs
- [x] Navigation links work
- [x] Responsive design (test mobile view)
- [x] No console errors

### With Backend (Full Functionality)
- [x] Authentication works (login/register/guest)
- [x] Room creation works
- [x] Room joining works
- [x] Ready status toggles
- [x] Game starts with 4+ players
- [x] Game phases work correctly
- [x] Chat works
- [x] Real-time updates work

---

## Common Issues & Solutions

### Issue: "Cannot GET /login" or similar
**Solution**: Make sure you're using React Router routes, not direct file paths. Always start from `/` and navigate using buttons/links.

### Issue: Pages show "Loading..." forever
**Solution**: Check if backend is running. Some pages require backend connection.

### Issue: Protected routes redirect to login
**Solution**: You need to authenticate first. Use login/register/guest page, or manually set localStorage (see Lobby testing above).

### Issue: Background images not showing
**Solution**: 
1. Check if images exist in `assets/images/` folder
2. Check browser console for 404 errors
3. Verify image paths in code match actual file names
4. Make sure dev server is running

### Issue: Styling looks broken
**Solution**:
1. Make sure Tailwind CSS is configured
2. Check if `npm install` completed successfully
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

## Browser DevTools Tips

### Check Authentication State
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Simulate Authentication
```javascript
// In browser console:
localStorage.setItem('token', 'test-token');
localStorage.setItem('user', JSON.stringify({
  userId: 'test-123',
  username: 'TestUser',
  isGuest: true
}));
// Then refresh page
```

### Clear Authentication
```javascript
// In browser console:
localStorage.removeItem('token');
localStorage.removeItem('user');
// Then refresh
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to "Network" tab
3. Filter by "Fetch/XHR" to see API calls
4. Check for errors (red entries)

---

## Testing Different Screen Sizes

### Desktop
- Default browser size
- Test at 1920x1080, 1366x768

### Tablet
- Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)
- Select iPad or custom size (768px width)

### Mobile
- Chrome DevTools: Toggle device toolbar
- Select iPhone or custom size (375px width)
- Test portrait and landscape

---

## Automated Testing (Optional)

For more advanced testing, you can use:

1. **React Testing Library** - Component testing
2. **Cypress** - End-to-end testing
3. **Playwright** - Browser automation

But for basic development testing, manual testing with the steps above is sufficient.

---

## Quick Start Command Reference

```bash
# Navigate to frontend
cd SpyGameBackend/SpyGameFrontend

# Install (first time)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Testing Workflow

1. **Start Dev Server**: `npm run dev`
2. **Open Browser**: `http://localhost:5173`
3. **Test Public Pages**: Home, Login, Register, Guest
4. **Authenticate**: Use one of the auth methods
5. **Test Protected Pages**: Lobby, Game
6. **Check Responsiveness**: Resize browser window
7. **Check Console**: Look for errors/warnings
8. **Test Navigation**: Click all buttons/links

---

## Need Help?

- Check browser console for errors
- Check Network tab for failed requests
- Verify backend is running (if testing full functionality)
- Check that all dependencies are installed
- Restart dev server if issues persist

Happy Testing! 🚀

