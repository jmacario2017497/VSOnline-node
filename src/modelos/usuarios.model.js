const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    usuario: String,
    rol: String,
    password: String,

    reseñas: [{
        usuario: String,
        puntuacion: Number
    }],
    calificacion: String,
    ventasHechas: Number,
    clasesImpartidas: Number
    
});
module.exports = mongoose.model('usuarios', UsuarioSchema);

