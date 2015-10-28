var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var contadorFacturaSchema = new Schema({
  year: {type : String, index: { unique: true }},
  num: {type : Number, default:0},
});
//Comprobar que es valido, creo que es mejor para obtener mensajes de error
contadorFacturaSchema.statics.generarNumero= function(year, next){
  this.findOneAndUpdate( {year: year}, { $inc: { num: 1 } }, function (err, data) {
    if (err) next(err);
    var num = data.number;
    next(false, num);
  });
}

var contadorFactura = module.exports = mongoose.model('contadorFactura', facturaSchema);
