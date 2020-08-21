const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const { ExpressPeerServer } = require('peer');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3006;

const router = require('./router');

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

const io = socketio(server);

const users = {};

io.on('connection', (socket) => {
  console.log('user joined');

  socket.on('join-class', (classNo, userId) => {
    socket.join(classNo);

    console.log('joined', classNo);
    socket.to(classNo).broadcast.emit('user-connected', userId);
    socket.in(classNo).emit('all-users', users);
    socket.on('disconnect', () => {
      socket.to(classNo).broadcast.emit('user-disconnected', userId);
      console.log('user left');
      delete users[socket.id];
    });
  });
});

app.use('/peerjs', peerServer);

app.use(router);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
