var mongoose = require('mongoose');
var DNI = require('../lib/dni')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var empleadoSchema = new Schema({
  nombre: {type : String, required: true, trim: true},
  apellidos: String,
  observaciones : String,
  dni : {type : String, uppercase: true, trim: true},
  email : {type : String, lowercase: true, trim: true},
  telefono : {type : String, trim: true}
});

var Empleado = module.exports = mongoose.model('Empleado', empleadoSchema);

//Comprobamos que no hay empleados con el mismo dni
empleadoSchema.path('dni').validate(function (value, respond) {
  if(value=="") return respond(true);
  value=value.toUpperCase();
  Empleado.findOne({ dni: value }, function (err, emp) {
    if(err) throw err;
    if(emp) {
      return respond(false);
    }
    respond(true);
  });
}, 'Ya hay un empleado con este dni ');
//Validar el dni
empleadoSchema.path('dni').validate(function (value) {
  if(value=="") return true;
  return DNI.validar(value);
}, 'El dni no es valido reviselo');
