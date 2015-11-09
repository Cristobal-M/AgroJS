var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var empresa= require('../lib/empresa');
var Factura=require('../models/factura');
var debug = require('debug')('agrojs:empresa');

router.get('/', function(req, res, next) {
  empresa.getDatos(function(err, e) {
    if (err) console.log(err);
    res.json(e);
  });

});

router.post('/', function(req, res, next) {
  var datos=req.body;
  empresa.setDatos(datos, function(err) {
    if (err) throw (err);
    res.json(datos);
  });
});


module.exports = router;
