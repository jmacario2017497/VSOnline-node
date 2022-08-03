const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IdiomaSchema = Schema({
    nombreIdioma: String,
    pais: String
});
module.exports = mongoose.model('idiomas', IdiomaSchema);

