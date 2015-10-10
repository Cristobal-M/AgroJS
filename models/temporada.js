var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var temporadaSchema = new Schema({
  nombre: {type : String, required: true},
  inicio: String,
  fin: String,
  puestos: [{nombre: String, coste_hora: Number}]
});

var Temporada = module.exports = mongoose.model('Temporada', temporadaSchema);
