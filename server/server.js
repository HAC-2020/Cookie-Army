const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();

const PORT = process.env.PORT || 3003;

const server = http.createServer(app);
const io = socketio(server);
