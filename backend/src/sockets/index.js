export function configureSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join-user-room', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('send-dm', ({ toUserId, message }) => {
      io.to(`user:${toUserId}`).emit('new-dm', message);
    });

    socket.on('disconnect', () => {});
  });
}
