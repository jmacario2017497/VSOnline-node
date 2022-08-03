const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var mesanjesSchema = Schema({
  message: String,
  fecha: String,
  usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
});

module.exports = mongoose.model("mensajes", mesanjesSchema);