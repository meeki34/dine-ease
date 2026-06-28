import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket;

export const initSocket = (tenantId) => {
  if (socket) socket.disconnect();
  
  socket = SOCKET_URL ? io(SOCKET_URL) : io();
  
  socket.on('connect', () => {
    console.log('Connected to socket server');
    if (tenantId) {
      socket.emit('join_tenant', tenantId);
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
