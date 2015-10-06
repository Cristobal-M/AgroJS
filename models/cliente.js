var mongoose = require('mongoose');
var DNI = require('../lib/dni')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var clienteSchema = new Schema({
  nombre: {type : String, required: true, trim: true},
  apellidos: String,
  observaciones : String,
  dni : {type : String, uppercase: true, trim: true},
  email : {type : String, lowercase: true, trim: true},
  telefono : {type : String, trim: true},
  direccion : String,
  fincas : [{
      nombre: {type : String, required: true, trim: true},
      direccion: String,
      observaciones: String
    }]
});
/*
clienteSchema.methods.set= function(cl){
  cliente.telefono=req.body.telefono;
  cliente.dni=req.body.dni;
  cliente.direccion=req.body.direccion;
  cliente.email=req.body.email;
  cliente.nombre=req.body.nombre;
  cliente.apellidos=req.body.apellidos;
  cliente.observaciones=req.body.observaciones;
}
*/
var Cliente =module.exports = mongoose.model('Cliente', clienteSchema);

//Para esta validacion el modelo cliente debe estar definido
clienteSchema.path('dni').validate(function (value, respond) {
  //Permitimos los dni vacios
  if(value==="") respond(true);
  value=value.toUpperCase();
  var id=this._id;

  Cliente.findOne({ dni: value }, function (err, cl) {
    if(err) throw err;
    console.log("------>"+id+"<<\n>>"+cl._id+"<<\n");
    if(cl && !cl._id.equals(id)) {
      return respond(false);
    }
    respond(true);
  });
}, 'Ya hay un cliente con este dni ');

//Validar el dni
clienteSchema.path('dni').validate(function (value) {
  if(value=="") return true;
  return DNI.validar(value);
}, 'El dni no es valido reviselo');
