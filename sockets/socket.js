const { io } = require("../index");

/* const { TicketControl } = require("../classes/ticket-control");
const ticketControl = new TicketControl(); */

// Conexion con clientes
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("delete-carrito", (data) => {
    socket.emit("new-carrito", data);
    console.log(data);
  });

  socket.on("add-carrito-add", (data) => {
    socket.emit("new-carrito-add", data);
    console.log(data);
  });
});
