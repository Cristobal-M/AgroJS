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

//Funcion para obtener un cliente por su id, devuelve un error para el usuario por si no existe
jornalSchema.statics.getById= function(id, cb){
  this.findOne({'_id': id}, function(err, jornal) {
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
    if(!jornal){
      var error=new Error("El jornal no existe");
      error.status=404;
      return cb(error);
    }
    cb(false, jornal);
  });
};

jornalSchema.index({ fecha: 1, finca: 1, empleado: 1}, { unique: true });
var Jornal = module.exports = mongoose.model('Jornal', jornalSchema);
