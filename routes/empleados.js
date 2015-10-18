var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var Empleado=require('../models/empleado');
var Jornal=require('../models/cliente');
var debug = require('debug')('agrojs:empleados');

router.get('/', function(req, res, next) {
  debug('listado empleados solicitado');
  var busqueda={};

  //Buscamos por nombre o apellidos si se solicita
  if(req.query.nombre!=undefined){
    var expNombre=new RegExp('.*'+req.query.nombre+'.*', "i");
    busqueda.$or=[{'nombre': expNombre}, {'apellidos': expNombre}];
  }
  if(req.query.dni!=undefined){
    var expDni=new RegExp('.*'+req.query.dni+'.*', "i");
    busqueda.dni=expDni;
  }

  Empleado.find(busqueda, 'nombre apellidos direccion email dni observaciones telefono', function(err, empleados) {
    if (err) return next(err);
    res.json(empleados);
  });

});

router.get('/activos', function(req, res, next) {
  debug('listado empleados activos solicitado');

  Empleado.find({}, 'nombre apellidos dni', function(err, empleados) {
    if (err) return next(err);
    res.json(empleados);
  });

});

router.post('/', function(req, res, next) {
  debug('guardado de un empleado solicitado:' +JSON.stringify(req.body));
  var id=req.body._id;
  if(id!=undefined){
    debug('el empleado ya existe se editara');
    Empleado.findOne({_id: id},function(err, empleado) {
      if (err) throw err;
      empleado.set(req.body);
      empleado.save(function(err, empleados) {
        if (err){
          debug(JSON.stringify(err));
          errores.tratarError(err,res,next);
          return;
        }
        debug('empleado editado');
        res.json(empleado);

      });
    });
  }
  else{
    debug('el empleado no existe se crea uno nuevo');
    empleado=new Empleado(req.body);
    empleado.save(function(err) {
      if (err){
        debug(JSON.stringify(err));
        errores.tratarError(err,res,next);
        return;
      }
      debug('empleado editado');
      res.json(empleado);

    });
  }


});

router.get('/:idEmpleado', function(req, res, next) {
  debug('empleado solicitado');

  Empleado.findOne({_id: req.params.idEmpleado}, function(err, empleado) {
    if (err) return next(err);
    res.json(empleado);
  });

});

router.get('/:idEmpleado/jornales', function(req, res, next) {
  debug('listado de jornales del empleado '+req.params.idEmpleado);
  var busqueda={};

  Jornal.find(busqueda, function(err, jornales) {
    if (err) return next(err);
    res.json(jornales);
  });

});





module.exports = router;
