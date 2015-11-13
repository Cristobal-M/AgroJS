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

//Funcion para obtener un cliente por su id, devuelve un error para el usuario por si no existe
empleadoSchema.statics.getById= function(id, cb){
  this.findOne({'_id': id}, function(err, emp) {
    if (err){
      //Si devuelve un CastError seguramente sea porque la id no es valida
      if(err.name && err.name==='CastError'){
        var error=new Error("La id no es valida");
        error.status=400;
        return cb(error);
      }
      else
        return cb(err)
    };
    //Si el cliente es undefined o null
    if(!emp){
      var error=new Error("El empleado no existe");
      error.status=404;
      return cb(error);
    }
    cb(false, emp);
  });
};

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
