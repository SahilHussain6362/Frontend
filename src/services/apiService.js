import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://spygamebackend-4z6x.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  guest: (data) => api.post('/api/auth/guest', data),
  google: () => window.location.href = `${API_URL}/api/auth/google`,
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.patch('/api/users/profile', data),
  getStats: () => api.get('/api/users/stats'),
};

export const friendsAPI = {
  getFriends: () => api.get('/api/friends'),
  getRequests: () => api.get('/api/friends/requests'),
  sendRequest: (toUserId) => api.post('/api/friends/request', { toUserId }),
  acceptRequest: (friendRequestId) => api.post('/api/friends/accept', { friendRequestId }),
  rejectRequest: (friendRequestId) => api.post('/api/friends/reject', { friendRequestId }),
  removeFriend: (friendId) => api.delete(`/api/friends/${friendId}`),
};

export const roomAPI = {
  createRoom: (data) => api.post('/api/rooms', data),
  getRoom: (roomCode) => api.get(`/api/rooms/${roomCode}`),
  joinRoom: (data) => api.post('/api/rooms/join', data),
  leaveRoom: (data) => api.post('/api/rooms/leave', data),
  toggleReady: (data) => api.post('/api/rooms/ready', data),
};

export const gameAPI = {
  getGame: (gameId) => api.get(`/api/games/${gameId}`),
};

export default api;

