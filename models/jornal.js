var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var jornalSchema = new Schema({
  empleado: {type : ObjectId, ref: 'Empleado', required: true},
  finca: {type : ObjectId, ref: 'Cliente.fincas', required: true},
  cliente: {type : ObjectId, ref: 'Cliente', required: true},
  puesto: {nombre: String, coste_hora: Number},
  fecha: {type : Date, required: true},
  horas : {type : Number, required: true},
  temporada: {type : ObjectId, ref: 'Temporada'}
});
jornalSchema.index({ fecha: 1, finca: 1, empleado: 1}, { unique: true });
var Jornal = module.exports = mongoose.model('Jornal', jornalSchema);
