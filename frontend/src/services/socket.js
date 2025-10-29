import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // User joins
  userJoin(userId) {
    this.emit('user-join', userId);
  }

  // Captain joins
  captainJoin(captainId) {
    this.emit('captain-join', captainId);
  }

  // Send captain location
  sendCaptainLocation(captainId, lat, lng, rideId) {
    this.emit('captain-location', { captainId, lat, lng, rideId });
  }

  // Request ride
  requestRide(data) {
    this.emit('ride-request', data);
  }

  // Accept ride
  acceptRide(data) {
    this.emit('ride-accepted', data);
  }

  // Start ride
  startRide(data) {
    this.emit('ride-started', data);
  }

  // Complete ride
  completeRide(data) {
    this.emit('ride-completed', data);
  }

  // Cancel ride
  cancelRide(data) {
    this.emit('ride-cancelled', data);
  }

  // Listen for captain location updates
  onCaptainLocationUpdate(callback) {
    this.on('captain-location-update', callback);
  }

  // Listen for new ride requests
  onNewRideRequest(callback) {
    this.on('new-ride-request', callback);
  }

  // Listen for ride accepted
  onRideAccepted(callback) {
    this.on('ride-accepted-notification', callback);
  }

  // Listen for ride started
  onRideStarted(callback) {
    this.on('ride-started-notification', callback);
  }

  // Listen for ride completed
  onRideCompleted(callback) {
    this.on('ride-completed-notification', callback);
  }

  // Listen for ride cancelled
  onRideCancelled(callback) {
    this.on('ride-cancelled-notification', callback);
  }
}

export default new SocketService();
