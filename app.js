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


server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
echo "# LiveTraker" >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/AbhiSharmaNIT/LiveTraker.git
git push -u origin main