const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombreCategoria: String
});
module.exports = mongoose.model('categorias', CategoriaSchema);

