var mongoose = require('mongoose');
var debug = require('debug')('agrojs:contadorFactura');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var contadorFacturaSchema = new Schema({
  year: {type : String, index: { unique: true }},
  num: {type : Number, default:0},
});
//Comprobar que es valido, creo que es mejor para obtener mensajes de error
contadorFacturaSchema.statics.generarNumero= function(year, next){
  //new es false por defecto y devuelve el elemento antes del cambio en caso de insertar uno nuevo seria null
  this.findOneAndUpdate( {year: year}, { $inc: { num: 1 } }, {upsert: true, new: true}, function (err, data) {
    if (err) next(err);
    next(false, data);
  });
}

var contadorFactura = module.exports = mongoose.model('contadorFactura', contadorFacturaSchema);
