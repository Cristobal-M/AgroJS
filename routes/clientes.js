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

router.post('/', function(req, res, next) {
  debug('guardado de un cliente solicitado:' +JSON.stringify(req.body));
  var id=req.body._id;
  if(id!=undefined){
    debug('el cliente ya existe se editara');
    Cliente.findOne({_id: id},function(err, cliente) {
      if (err) throw err;
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
  Cliente.findOne({'_id':req.params.id}, function(err, cliente) {
    if (err) throw err;
    res.json(cliente.fincas);
  });
});

router.post('/:id/fincas', function(req, res, next) {
  debug('Peticion para añadir o editar una finca del cliente id='+req.params.id);
  Cliente.findOne({'_id':req.params.id}, function(err, cliente) {
    if (err) throw err;
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
        return errores.tratarError(err,res,next);
      }
      debug('finca guardada correctamente id='+finca._id);
      res.json(finca);

    });
  });
});

router.get('/:id', function(req, res, next) {
  Cliente.findOne({'_id':req.params.id}, function(err, cliente) {
    if (err) return next(err);
    res.json(cliente);
  });

});

router.get('/crear', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var nuevo=new Cliente({nombre: 'cristobal', dni : '     00100000Z'});

  nuevo.save(function(err, clientes) {
    if (err){
      mensaje=errores.getMensaje(err);
      if(mensaje){
        res.json({ok: false, msg: mensaje});
        return;
      }
      else
        return next(err);
    }
    res.json({ok:true, msg:"Cliente creado"});
  });

});

router.get('/prueba', function(req, res, next) {
  if(req.session.n==undefined)
    req.session.n=0;
  req.session.n++;
  comun++;
  res.json([req.session.n, req.session.user, comun]);
});

module.exports = router;
