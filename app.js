var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var nunjucks  = require('nunjucks');
//var RedisStore = require('connect-redis')(session);
var mongoStore = require('connect-mongo')(session);
var app = express();

//Conexion a la bd
mongoose.connect('mongodb://localhost/agricola');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//nunjucks similar a twig, basado en jinja2
nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Las sesiones se guardan en una bd de mongo a parte
app.use(session({
  secret: 'puto nodejs sdkj2389ghsrdf897234',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 24*60*60*1000
  },
  rolling:true,
  store: new mongoStore({
    db: 'sesiones_bigagro',
    host: '127.0.0.1',
    port: 27017
  })
}));
///////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////
//var clientes = require('./routes/clientes');


var seguridad = require('./lib/seguridad');
//Operaciones relacionadas con clietes
app.use('/clientes',seguridad.permitirRoles(false,'admin','usuario') , require('./routes/clientes'));
app.use('/empleados',seguridad.permitirRoles(false,'admin','usuario') , require('./routes/empleados'));
app.use('/jornales',seguridad.permitirRoles(false,'admin','usuario') , require('./routes/jornales'));
app.use('/facturas',seguridad.permitirRoles(false,'admin','usuario') , require('./routes/facturas'));
app.use('/empresa',seguridad.permitirRoles(false,'admin','usuario') , require('./routes/empresa'));
//Para lo relacionado con el login
app.use('/login', require('./routes/login'));
//Index de la web, la propia aplicacion
app.use('/', seguridad.permitirRoles('/login','admin','usuario'), require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Error: Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if(err.status===400){
    res.status(400).json({ok: false, msg:err.message});
  }
  else{
    next(err);
  }

});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
