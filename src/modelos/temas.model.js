const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemaSchema = Schema({
    nombreTema: String,
    profesorSolicitado: String,
    categoria: String,
    idioma: String,
    tipoInformacion: String,
    precio: Number
});
module.exports = mongoose.model('temas', TemaSchema);

