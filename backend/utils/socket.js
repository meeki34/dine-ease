const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict this to your frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('join_tenant', (tenantId) => {
      socket.join(`tenant_${tenantId}`);
      console.log(`Socket ${socket.id} joined tenant_${tenantId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from socket');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const emitUpdate = (tenantId, event) => {
  if (io) {
    io.to(`tenant_${tenantId}`).emit(event);
  }
};

module.exports = { initSocket, getIO, emitUpdate };
