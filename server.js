const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

var createdRooms = [];

io.on("connection", (socket) => {
  console.log("A user has connect: ", socket.id);
  // io.of("/").adapter.rooms;
  console.log(io.of("/").adapter.rooms);
  // socket.broadcast.emit("rooms_avaible", createdRooms);
  socket.emit("rooms_avaible", createdRooms);

  // console.log(io.fetchSockets());
  socket.on("user_connect", (username) => {
    socket.broadcast.emit("a_user_has_connect", username);
    // soket.broadcast.emit("rooms_avaible", io.sockets.adapter.rooms);

    socket.on("join_room", (room) => {
      if (!createdRooms.includes(room)) {
        createdRooms.push(room);
        io.emit("room_created", room);
        socket.join(room, room);
        console.log(room + " created");
      }

      if (createdRooms.includes(room)) {
        socket.join(room, room);
        console.log(`${username} joined room`, room);
      }

      console.log(io.sockets.adapter.rooms);
    });
  });

  socket.on("writer", (data) => {
    console.log(`${data.name}: skriver!`);
    io.sockets.in(data.room).emit("writing", data.name);
  });

  socket.on("leave", (room) => {
    socket.leave(room);

    if (!io.sockets.adapter.rooms.get(room)) {
      var index = createdRooms.indexOf(room);
      if (index !== -1) {
        createdRooms.splice(index, 1);
      }
    }

    console.log(io.sockets.adapter.rooms.get(room));

    socket.emit("rooms_avaible", createdRooms);

    socket.broadcast.emit("rooms_avaible", createdRooms);

    // if (!createdRooms.includes(room)) {
    //   createdRooms.splice(room);
    //   io.emit("room_created", room);
    //   socket.join(room, room);
    //   console.log(room + " created");
    // }
    console.log(createdRooms);
    console.log(`Du lämmnade rum: ${room}`);
    console.log(io.sockets.adapter.rooms);
    // console.log(room); */
  });

  socket.on("message", (obj) => {
    /*     console.log("message being sent"); */
    io.to(obj.room).emit("message", obj.message);
    // io.to("join_room", obj.room).to(["room_created"]).emit("message", obj);
    // socket.to(["room_created"]).io.to("join_room", obj.room).emit("message", obj);
  });

  socket.on("output-message", (obj) => {
    console.log(obj);
    io.to(obj.room).emit("output-message", obj);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnect");
  });
});

server.listen(3000, () => {
  console.log("Servern är igång");
});
