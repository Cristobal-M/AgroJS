var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
//var Jornal=require('../models/jornal');
//var Temporada=require('../models/temporada');
var Factura=require('../models/factura');
var debug = require('debug')('agrojs:facturas');
var moment = require('moment');

//Listado simplificado de facturas, con los minimos datos de cada una
router.get('/', function(req, res, next) {
  debug('listado de facturas solicitada '+JSON.stringify(req.query));
  var year=req.query.year;
  var busqueda={};

  if(year && Number.isInteger(year)) busqueda.year=year;

  Factura.find(busqueda,"cliente.nombre fecha numero total num year" ,function(err, e) {
    if (err) next(err);
    debug('enviando facturas solicitadas '+JSON.stringify(e));
    res.json(e);
  });

});

router.get('/:id', function(req, res, next) {
  debug('factura solicitada '+JSON.stringify(req.params));

  Factura.findOne({_id: req.params.id},function(err, e) {
    debug(JSON.stringify(err));
    if (err) return next(err);
    if(!e){
      res.status(404).json({ok:false, msg:"La factura no existe"});
      return;
    }
    debug('enviando factura solicitada '+JSON.stringify(e));
    res.json(e);
  });

});

router.post('/', function(req, res, next) {
  debug('guardado de una factura solicitada:' +JSON.stringify(req.body));
  //Por si acaso, el año y el num deben asignarse en el servidor
  delete req.body.year;
  delete req.body.num;
  var id=req.body._id;
  if(id!==undefined){
    var e=new Error("Esta factura ya tiene id, parece que quiere editarla");
    e.status=400;
    return next(e);
  }
  debug('Se creara una nueva');
  var factura=new Factura(req.body);
  var error=factura.invalido();
  if(error){
    debug('Error'+JSON.stringify(error));
    next(error);
    return;
  }
  factura.save(function(err,fac) {
    if (err)return next(err);
    debug('factura guardada');
    res.json(fac);

  });
});
router.put('/:id', function(req, res, next){
  var id=req.params.id;
  var factura=req.body;
  delete factura._id;
  debug('se editara la factura '+id);
  Factura.findOne({_id: id},function(err, factura) {
    if (err) next(err);
    if(!factura){
      res.status(400).json({ok:false, msg:"No existe la factura"});
      return;
    }
    factura.set(req.body);
    factura.save(function(err, fac) {
      if (err) return next(err);
      debug('factura editada');
      res.json(fac);
    });
  });
});

module.exports = router;
