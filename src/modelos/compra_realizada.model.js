const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompraRealizadaSchema = Schema({
    nombreCliente: String,
    usuarioCliente: String,
    usuarioProfesor: String,
    tema: String,
    tipo: String,
    fechaCompra: Date,
    precio: Number
});
module.exports = mongoose.model('compras_realizadas', CompraRealizadaSchema);