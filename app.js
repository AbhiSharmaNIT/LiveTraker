const express = require('express');
const app = express();
const path = require('path');

const http = require("http");
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on("send-location", (location) => {
    io.emit("receive-location", {id: socket.id, ...location});
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
