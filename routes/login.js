var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var debug = require('debug')('agrojs:login');
var seguridad=require('../lib/seguridad');
var Usuario=require('../models/usuario');

/********************************************************************/
//Web de login
router.get('/', function(req, res, next) {
  res.render('login.html', {});
});

/********************************************************************/
//Operacion de login
router.post('/', function(req, res, next) {
  seguridad.login(req, function(err, valido){
    if(err) return next(err);
    if(valido)
      res.redirect('/');
    else
      res.render('login.html', {mensaje: 'Usuario o clave incorrectos', usuario: req.body.identificacion});
  });
});
/********************************************************************/
router.get('/crea_usuario', function(req, res, next) {
  var usuario=new Usuario({nombre: 'Juan Daniel', usuario: 'juan',email: 'aaaa@aaa.aa', clave: " 123 ", rol: 'usuario'});

  usuario.save(function(err){
    if (err){
      return errores.tratarError(err, res, next);
    }
    console.log('usuario registrado: '+usuario);
    res.json({ok:true, msg:"Usuario creado"});
  });
});

module.exports = router;
