const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReunionReservadaSchema = Schema({
    nombreCliente: String,
    usuarioCliente: String,
    usuarioProfesor: String,
    tema: String,
    fechaReunion: Date,
    precio: Number,
    estado: String,
});
module.exports = mongoose.model('reuniones_reservadas', ReunionReservadaSchema);