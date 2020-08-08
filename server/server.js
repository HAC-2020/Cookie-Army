const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3005;

const router = require('./router');

const server = http.createServer(app);
const io = socketio(server);
4;

io.on('connection', (socket) => {
  console.log('user joined');

  socket.on('disconnect', () => {
    console.log('user left');
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
