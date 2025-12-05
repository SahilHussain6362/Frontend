import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Only connect if we have a token
    if (!token) {
      console.warn('SocketService: No token provided, skipping connection');
      return;
    }

    try {
      this.socket = io(SOCKET_URL, { 
        auth: { token }, 
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Handle connection errors
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        // If it's an auth error, clear token
        if (error.message.includes('auth') || error.message.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
    } catch (error) {
      console.error('SocketService: Error creating socket connection:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(ev, payload) {
    if (this.socket?.connected) {
      this.socket.emit(ev, payload);
    } else {
      console.warn(`SocketService: Cannot emit ${ev} - socket not connected`);
    }
  }

  on(ev, cb) {
    if (this.socket) {
      this.socket.on(ev, cb);
    }
  }

  off(ev, cb) {
    if (this.socket) {
      this.socket.off(ev, cb);
    }
  }

  get connected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
