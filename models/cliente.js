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

//Funcion para obtener un cliente por su id, devuelve un error para el usuario por si no existe
clienteSchema.statics.getById= function(id, cb){
  this.findOne({'_id': id}, function(err, cliente) {
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
    if(!cliente){
      var error=new Error("El cliente no existe");
      error.status=404;
      return cb(error);
    }
    cb(false, cliente);
  });
};

var Cliente =module.exports = mongoose.model('Cliente', clienteSchema);

//Para esta validacion el modelo cliente debe estar definido
clienteSchema.path('dni').validate(function (value, respond) {
  //Permitimos los dni vacios
  if(value==="") respond(true);
  value=value.toUpperCase();
  var id=this._id;

  Cliente.findOne({ dni: value }, function (err, cl) {
    if(err) respond(false);
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
