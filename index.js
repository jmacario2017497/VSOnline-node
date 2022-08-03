const mongoose = require('mongoose');
const app = require('./app');

const adminController = require('./src/controladores/ADMIN.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM2_U3_FF', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se encuentra conectado a la base de datos");

    

}).catch(error => console.log(error));

const server = app.listen(3333, function () {

        console.log("Puerto 3333, ejecución de VSOnline, completada");
        adminController.Admin();
        console.log("ADMINISTRADOR: Usu:Masterchief, Pass:******" );
        console.log("-------------------------------------------------------------------------------------------------");
        console.log("-------------------------------------------------------------------------------------------------");
})


const SocketIo = require("socket.io");
const io = SocketIo(server);


io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("message", (messageInfo) => {
    socket.broadcast.emit("getMessage", messageInfo);
  });
}); 