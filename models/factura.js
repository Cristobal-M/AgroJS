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
  fecha_creacion: {type : Date, default: Date.now},
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

facturaSchema.index({ year: 1, num: 1}, { unique: true, sparse: true });

//Funcion para reparar la numeracion de las facturas de un año si se han introducido con una fecha distinta
facturaSchema.statics.reordenar= function(year, next){
  var ini = new Date(Date.UTC(year, 0, 1));
  var fin = new Date(Date.UTC(year+1, 0, 1));
  debug("se reordenaran las facturas "+ini+" "+fin);
  var that=this;
  //Ponemos los num a null
  this.update({fecha: {$gte: ini, $lt: fin}}, {'year': year, 'num': null}, { multi: true }, function(err){
    if(err) return next (err);
    that.find({fecha: {$gte: ini, $lt: fin}}).sort('fecha').exec(function(err,facturas){
      if(err) return next(err);
      debug("Facturas obtenidas"+ facturas.length+"=>"+JSON.stringify(facturas));
      var c=0;
      var res=[];
      var size=facturas.length;
      for (var i = 0; i < size; i++) {
        facturas[i].num=i+1;
        facturas[i].save(function(err, fac){
          debug("procesando factura nº"+fac.num);
          if(size>c){
            c++;
            if(err){
              debug("error se cancela");
              c=size+1;
              return next(err);
            }
            res.push(fac);
            //Si es el ultimo, se llama a next
            if(size==c){
              debug("se actualizara el contador");
              contadorFactura.findOne({'year': year}).exec().then(
              function(contador){
                debug("contador a "+size);
                contador.num=size;
                return contador.save();
              })
              .then(function(contador){
                debug("devolucion de respuesta");
                next(false, res);
              });
            }
          }
        });
      }
    });
  });
}

//Comprobar que es valido, creo que es mejor para obtener mensajes de error
facturaSchema.methods.invalido= function(){
  try{
    var err=new Error();
    err.status=400;
    this.cliente=this.cliente||{};

    if(!this.cliente.nombre || this.cliente.nombre===""){
      err.message="Se necesita un nombre";
      return err;
    }

    if(!this.cliente.dni || !DNI.validar(this.cliente.dni)){
      err.message="El NIF no es valido";
      return err;
    }
    var fecha=moment(new Date(this.fecha));
    if(!fecha.isValid()){
      debug('la fecha no es valida se cancela');
      err.status(400);
      err.message='La fecha no es valida';
      return err;
    }
    if(!this.conceptos || this.conceptos.length==0){
      err.message="La factura debe tener al menos un concepto";
      return err;
    }
    if(isNaN(this.iva) || this.iva<0){
      err.message="El IVA no tiene un valor valido";
      return err;
    }
    if(this.total==0){
      err.message="Una factura no puede tener un total de 0";
      return err;
    }
    for (var i = 0; i < this.conceptos.length; i++) {
      var con=this.conceptos[i];
      if(isNaN(con.precio_unidad) || con.precio_unidad<=0){
        err.message="El precio no es valido";
        return err;
      }
      if(isNaN(con.unidades) || con.precio_unidad<=0){
        err.message="El numero de unidades no es valido";
        return err;
      }
    }
    //nada incorrecto
    return false;
  }catch(err){
    return err;
  }

}

facturaSchema.methods.calcularTotal= function(){
  var subTotal=0;
  var iva=this.iva;
  for (var i = 0; i < this.conceptos.length; i++) {
    var con=this.conceptos[i];
    subTotal+=con.precio_unidad*con.unidades;
  }
  //nada incorrecto
  return subTotal*(1+iva/100);
}

facturaSchema.pre('save', function (next) {
  this.total=this.calcularTotal();
  var err=this.invalido();
  if(err)return next(err);

  if (!this.isNew) {
    next();
    return;
  }
  var fecha=moment(this.fecha);
  this.fecha_creacion=new Date();
  var fac=this;
  debug("Se va a generar el numero");
  contadorFactura.generarNumero(fecha.year(), function(err,numero){
    if(err) return next(err);
    fac.num=numero.num;
    fac.year=numero.year;
    debug("numero de factura"+fac.year+"-"+fac.num);
    next();
  });
});



facturaSchema.virtual('numero')
.get(function () {
  if(!this.num) return "";
  var num=this.num.toString();
  return this.year+"-"+("00000".slice(num.length))+num;
});
/*
facturaSchema.virtual('nombre_cliente')
.get(function () {
  return this.cliente.nombre;
});

facturaSchema.virtual('dni_cliente')
.get(function () {
  return this.cliente.dni;
});
*/
var Factura = module.exports = mongoose.model('Factura', facturaSchema);
