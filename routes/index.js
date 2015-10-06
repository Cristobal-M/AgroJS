var express = require('express');
var router = express.Router();
var errores= require('../lib/errores');
var Usuario=require('../models/usuario');
var seguridad=require('../lib/seguridad');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index.html', { title: 'Express' });
});
/********************************************************************/



module.exports = router;
