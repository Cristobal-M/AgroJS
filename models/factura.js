var mongoose = require('mongoose');
var DNI = require('../lib/dni');
var contadorFactura = require('./contadorFactura');
var debug = require('debug')('agrojs:model_factura');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var facturaSchema = new Schema({
  cliente: {
    nombre: {type : String, required: true},
    //La variable la he llamado dni pero puede ser nif
    dni : {type : String, uppercase: true, trim: true, required: true},
    telefono : {type : String, trim: true},
    direccion : String
  },
  //Nuestra empresa, quizas se cambie de direccion o algo asi, por lo que prefiero ser precavido
  empresa: {
    nombre: {type : String, required: true},
    dni : {type : String, uppercase: true, trim: true, required: true},
    telefono : {type : String, trim: true},
    direccion : String
  },
  year: {type : String},
  num: {type : Number},
  iva: {type : Number},
  fecha: {type : Date, required: true},
  fechaCreacion: {type : Date, default: Date.now},
  total: {type : Number},
  conceptos: [{
    codigo: String,
    descripcion: {type: String, required: true},
    unidades: {type: Number, required: true},
    precio_unidad: {type: Number, required: true}
  }]
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true
  }
});


//Comprobar que es valido, creo que es mejor para obtener mensajes de error
facturaSchema.methods.invalido= function(){
  var err=new Error();
  err.status=400;

  if(this.cliente===undefined || !DNI.validar(this.cliente.dni)){
    err.message="El NIF no es valido";
    return err;
  }

  if(this.conceptos===undefined || this.conceptos.length==0){
    err.message="La factura no puede estar vacia";
    return err;
  }
  for (var i = 0; i < this.conceptos.length; i++) {
    var con=this.conceptos[i];
    if(con.precio<=0){
      err.message="El precio no es valido";
      return err;
    }
  }
  //nada incorrecto
  return false;
}

facturaSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  var fecha=moment(this.fecha);
  var fac=this;
  debug("Se va a generar el numero");
  contadorFactura.generarNumero(fecha.year(), function(err,numero){
    if(err) throw err;

    fac.num=numero.num;
    fac.year=numero.year;
    debug("numero de factura"+fac.year+"-"+fac.num);
    next();
  });
});

facturaSchema.index({ year: 1, num: 1}, { unique: true });

var Factura = module.exports = mongoose.model('Factura', facturaSchema);

facturaSchema.virtual('numero')
.get(function () {
  var num=this.num.toString();
  return this.year+"-"+("00000".slice(num.length))+num;
});

facturaSchema.virtual('nombreCliente')
.get(function () {
  return this.cliente.nombre;
});

facturaSchema.virtual('dniCliente')
.get(function () {
  return this.cliente.dni;
});
