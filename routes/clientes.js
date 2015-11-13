var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var Cliente=require('../models/cliente');
var debug = require('debug')('agrojs:clientes');

var comun=0;
//Busqueda por nombre y dni
router.get('/', function(req, res, next) {
  debug('listado clientes solicitado');
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

  Cliente.find(busqueda, 'nombre apellidos direccion email dni observaciones telefono', function(err, clientes) {
    if (err) throw err;
    res.json(clientes);
  });

});

router.get('/:id', function(req, res, next) {
  Cliente.getById(req.params.id, function(err, cliente) {
    if (err) return next(err);
    res.json(cliente);
  });
});

router.put('/:id', function(req, res, next) {
  Cliente.getById(req.params.id, function(err, cliente) {
    if (err) return next(err);
    delete req.body._id;
    cliente.set(req.body);
    cliente.save(function(err, cl){
      if(err) return next(err);
      res.json(cl);
    });
  });
});

router.post('/', function(req, res, next) {
  debug('guardado de un cliente solicitado:' +JSON.stringify(req.body));
  var id=req.body._id;
  if(id!=undefined){
    debug('el cliente ya existe se editara');
    Cliente.findOne({_id: id},function(err, cliente) {
      if (err) return next(err);
      cliente.set(req.body);
      cliente.save(function(err, clientes) {
        if (err){
          debug(JSON.stringify(err));
          errores.tratarError(err,res,next);
          return;
        }
        debug('cliente editado');
        res.json(cliente);

      });
    });
  }
  else{
    debug('el cliente no existe se crea uno nuevo');
    cliente=new Cliente(req.body);
    cliente.save(function(err) {
      if (err){
        debug(JSON.stringify(err));
        errores.tratarError(err,res,next);
        return;
      }
      debug('cliente editado');
      res.json(cliente);

    });
  }


});

router.get('/:id/fincas', function(req, res, next) {
  if(req.params.id===undefined)
    return res.json([]);
  Cliente.getById(req.params.id, function(err, cliente) {
    if (err) return next(err);
    res.json(cliente.fincas);
  });
});

router.post('/:id/fincas', function(req, res, next) {
  debug('Peticion para añadir o editar una finca del cliente id='+req.params.id);
  Cliente.getById(req.params.id, function(err, cliente) {
    if (err) return next(err);
    var finca=req.body;
    if(finca._id && finca._id!=""){
      debug('La finca se editara, ya que tiene id='+finca._id);
      var original=cliente.fincas.id(finca._id);
      debug('Finca original: '+JSON.stringify(original));
      if(original){
        original.set(finca);
      }
    }
    else{
      //Creamos un subdocumento finca a partir del schema, de esta forma se genera un id
      finca=cliente.fincas.create(finca);
      debug('Finca creada con id='+finca._id);
      cliente.fincas.push(finca);

    }
    cliente.save(function(err) {
      if (err){
        debug(JSON.stringify(err));
        return next(err);
      }
      debug('finca guardada correctamente id='+finca._id);
      res.json(finca);

    });
  });
});




module.exports = router;
