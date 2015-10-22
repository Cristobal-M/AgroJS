var mongoose = require('mongoose');
var DNI = require('../lib/dni')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var facturaSchema = new Schema({
  cliente: {
    nombre: {type : String, required: true},
    dni : {type : String, uppercase: true, trim: true, required: true},
    telefono : {type : String, trim: true},
    direccion : String
  },
  empleado: {type : ObjectId, ref: 'Empleado', required: true},
  puesto: {nombre: String, coste_hora: Number},
  fecha: {type : Date, required: true},
  horas : {type : Number, required: true},
  temporada: {type : ObjectId, ref: 'Temporada'}
});
jornalSchema.index({ fecha: 1, finca: 1, empleado: 1}, { unique: true });
var Jornal = module.exports = mongoose.model('Jornal', jornalSchema);
