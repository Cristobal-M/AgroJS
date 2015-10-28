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

  if(year!==undefined) busqueda.year=year;

  Factura.find(busqueda,"nombreCliente dniCliente fecha numero total" ,function(err, e) {
    if (err) next(err);
    debug('enviando facturas solicitadas '+JSON.stringify(e));
    res.json(e);
  });

});

router.get('/:id', function(req, res, next) {
  debug('factura solicitada '+JSON.stringify(req.params));

  Factura.find({_id: req.params.id},"nombreCliente dniCliente fecha numero total" ,function(err, e) {
    if (err) next(err);
    debug('enviando factura solicitada '+JSON.stringify(e));
    res.json(e);
  });

});

router.post('/', function(req, res, next) {
  debug('guardado de una factura solicitada:' +JSON.stringify(req.body));
  //Por si acaso, el año y el num deben asignarse en el servidor
  delete req.body.year;
  delete req.body.num;
  var fecha=moment(new Date(req.body.fecha));
  if(!fecha.isValid()){
    debug('la fecha no es valida se cancela');
    res.status(400);
    res.json({ok: false, msg: 'La fecha no es valida'});
    return;
  }
  var id=req.body._id;
  if(id!==undefined){
    debug('la factura ya existe se editara');
    Factura.findOne({_id: id},function(err, factura) {
      if (err) next(err);
      factura.set(req.body);
      var error=factura.invalido();
      if(error){
        res.json(error);
        return;
      }
      factura.save(function(err, fac) {
        if (err){
          debug(JSON.stringify(err));
          errores.tratarError(err,res,next);
          return;
        }
        debug('factura editada');
        res.json(fac);

      });
    });
  }
  else{
    debug('la factura no existe se crea uno nuevo');
    var factura=new Factura(req.body);
    var error=factura.invalido();
    if(error){
      res.json(error);
      return;
    }
    factura.save(function(err) {
      if (err){
        debug(JSON.stringify(err));
        errores.tratarError(err,res,next);
        return;
      }
      debug('jornal guardado');
      res.json(jornal);

    });
  }
});

router.get('/temporadas', function(req, res, next) {
  debug('listado de temporadas');
  Temporada.find({}, function(err, e) {
    if (err) throw err;
    res.json(e);
  });
});

router.post('/temporadas', function(req, res, next) {
  debug('guardado de una temporada solicitada'+JSON.stringify(req.body));
  var id=req.body._id;
  if(id!==undefined){
    debug('la temporada ya existe se editara');
    Temporada.findOne({},function(err, temp) {
      if (err) return next(err);
      temp.set(req.body);
      temp.save(function(err, jornal) {
        if (err){
          debug(JSON.stringify(err));
          errores.tratarError(err,res,next);
          return;
        }
        debug('temporada editado');
        res.json(temp);

      });
    });
  }
  else{
    debug('la temporada no existe se crea uno nuevo');
    var temp=new Temporada(req.body);
    temp.save(function(err) {
      if (err){
        debug(JSON.stringify(err));
        errores.tratarError(err,res,next);
        return;
      }
      debug('temporada guardado');
      res.json(temp);
    });
  }
});

module.exports = router;
