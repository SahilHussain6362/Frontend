import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Guest from './pages/Guest';
import Dashboard from './pages/Dashboard';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/guest" element={<Guest />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lobby"
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:gameId"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1f2e',
                color: '#e5e7eb',
                border: '1px solid #2a2f3e',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#1a1f2e',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#1a1f2e',
                },
              },
            }}
          />
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}
