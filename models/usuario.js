var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var debug = require('debug')('agrojs:model_usuario');
var bcrypt = require('bcrypt');
var salt=10;

var usuarioSchema = new Schema({
  nombre: {type : String, required: true, trim: true},
  apellidos: String,
  usuario: {type : String, required: true, trim: true},
  rol: {type : String, required: true, trim: true},
  clave: {type : String, required: true, trim: true},
  email : {type : String, lowercase: true, trim: true}
});
//Funcion del modelo usuario para verificar una clave
//Parece que las putas funciones se definen antes de crear el modelo, si no "is not a function"
//this.db.model('')
usuarioSchema.methods.verificaClave = function(clave, callback) {
  debug('Comparando clave');
  bcrypt.compare(clave, this.clave, function(err, isMatch) {
    if (err) return callback(err);
    debug('Clave comparada->'+isMatch);
    callback(null, isMatch);
  });
};
var Usuario =module.exports = mongoose.model('Usuario', usuarioSchema);

//Para esta validacion el modelo cliente debe estar definido
usuarioSchema.path('usuario').validate(function (value, respond) {
  //console.log(value);
  this.model('Usuario').findOne({ usuario: {$regex: new RegExp(value, "i")} }, function (err, user) {
    if(err) throw err;
    if(user) {
      return respond(false);
    }
    respond(true);
  });
}, 'Ya hay alguien registrado con ese usuario');

usuarioSchema.path('usuario').validate(function (value) {
  var exp=/^[a-z0-9_-]+$/i;
  if(value.match(exp)!=null)
    return true;
  return false;
}, 'El nombre de usuario no es valido, solo letras, numeros, _ o -');

//Recordar que la funcion no se ejecuta si se hace un update, solo en save
usuarioSchema.pre('save',function (next) {
  debug("Funcion previa al save de usuario");
  var user = this;
  //Solo se realiza si se ha modificado o es nueva
  if (!user.isModified('clave')) return next();
  debug('La clave no se ha modificado, no se genera el hash');
//  if (user.usuario=='admin' && user.isNew )return next();
//s->salt generado, otra operacion asincrona.....
  debug('Se va ha generar un salt');
  bcrypt.genSalt(salt, function(err, s) {
    //debug('La clave no se ha modificado, no se genera el hash');
    if (err) return next(err);
    //Se crea el hash, tambien asincrona ¬¬
    bcrypt.hash(user.clave, s, function(err, hash) {
      debug('Hash generado');
      if (err) return next(err);
      //Sustituimos su clave por el hash
      user.clave = hash;
      debug('Hash del usuario->'+hash);
      next();
    });
  });
});
