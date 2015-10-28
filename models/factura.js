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
  year: {type : String},
  num: {type : Number},
  fecha: {type : Date, required: true},
  fecha_creacion: {type : Date, default: Date.now}
  conceptos: [{
    codigo: String,
    descripcion: {type: String, required: true},
    num: {type: Number, required: true},
    precio: {type: Number, required: true}
  }]
});
//Comprobar que es valido, creo que es mejor para obtener mensajes de error
facturaSchema.methods.invalido= function(){
  if(this.year===undefined || this.year.length!==4){
    return {ok: false, msg: "El año no es valido"};
  }
  if(this.num===undefined || this.num<=0){
    return {ok: false, msg: "El numero de factura no es valido"};
  }
  if(this.cliente===undefined || !DNI.validar(this.cliente.dni)){
    return {ok: false, msg: "El DNI/NIF no es valido"};
  }
  if(this.conceptos===undefined || this.conceptos.length==0){
    return {ok: false, msg: "La factura no puede estar vacia"};
  }
  for (var i = 0; i < this.conceptos.length; i++) {
    var con=this.conceptos[i];
    if(con.precio<=0)
      return {ok: false, msg: "El precio no es valido"};
  }
  //nada incorrecto
  return false;
}
facturaSchema.index({ year: 1, num: 1}, { unique: true });
var Factura = module.exports = mongoose.model('Factura', facturaSchema);
