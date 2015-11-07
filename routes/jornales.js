var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var Jornal=require('../models/jornal');
var Temporada=require('../models/temporada');
var debug = require('debug')('agrojs:jornales');
var moment = require('moment');

//Fechas para la pericion ISO 8601 (YYYY-MM-DD)
router.get('/', function(req, res, next) {
  debug('listado jornales solicitado '+JSON.stringify(req.query));
  var finca=req.query.finca;
  var fecha=req.query.fecha;
  var empleado=req.query.empleado;
  var busqueda={};

  if(fecha!==undefined){
    fecha=moment.utc(fecha, 'YYYY-MM-DD');
    if(!fecha.isValid()){
      debug('la fecha no es valida se cancela');
      res.status(400);
      res.json({ok: false, msg: 'La fecha no es valida'});
      return;
    }
    busqueda.fecha=fecha.toDate();//new Date(req.query.fecha);
  }
  if(finca!==undefined) busqueda.finca=finca;
  if(empleado!==undefined) busqueda.empleado=empleado;

  Jornal.find(busqueda, function(err, e) {
    if (err) throw err;
    debug('enviando jornales solicitado '+JSON.stringify(e));
    res.json(e);
  });

});

router.post('/', function(req, res, next) {
  debug('guardado de un jornal solicitado:' +JSON.stringify(req.body));
  var fecha=moment(new Date(req.body.fecha));
  if(!fecha.isValid()){
    debug('la fecha no es valida se cancela');
    res.status(400);
    res.json({ok: false, msg: 'La fecha no es valida'});
    return;
  }
  var id=req.body._id;
  if(id!==undefined){
    debug('el jornal ya existe se editara');
    Jornal.findOne({_id: id},function(err, jornal) {
      if (err) throw err;
      jornal.set(req.body);
      jornal.save(function(err, jornal) {
        if (err){
          debug(JSON.stringify(err));
          errores.tratarError(err,res,next);
          return;
        }
        debug('jornal editado');
        res.json(jornal);

      });
    });
  }
  else{
    debug('el jornal no existe se crea uno nuevo');
    var jornal=new Jornal(req.body);
    jornal.save(function(err) {
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

router.delete('/', function(req, res, next) {
  var id=req.query._id;
  debug('borrado de un jornal'+JSON.stringify(req.body));
  if(id===undefined){
    res.status=400;
    res.json({ok:false, msg: 'no hay id'});
    return;
  }

  Jornal.findByIdAndRemove(id, function(err, e) {
    if (err) next(err);
    res.json({ok:true, msg: 'borrado'});
  });
});
module.exports = router;
