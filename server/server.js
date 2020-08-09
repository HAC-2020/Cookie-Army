const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { ExpressPeerServer } = require('peer');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3006;

const router = require('./router');
const { Socket } = require('socket.io-client');

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user joined');

  socket.on('join-class', (classNo, userId) => {
    socket.join(classNo);
    console.log('joined', classNo);
    socket.to(classNo).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(classNo).broadcast.emit('user-disconnected', userId);
      console.log('user left');
    });
  });
});

app.use('/peerjs', peerServer);

app.use(router);

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
