var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var nunjucks  = require('nunjucks');
var mongoStore = require('connect-mongo')(session);
var app = express();


//Conexion a la bd
var db_name=process.env.OPENSHIFT_APP_NAME || "agricola";
mongodb_connection_string = (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1:27017/' )+ db_name;
mongoose.connect(mongodb_connection_string);

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
  store: new mongoStore(
    /*
    {
    db: 'sesiones_bigagro',
    host: '127.0.0.1',
    port: 27017
    }
    */
    { mongooseConnection: mongoose.connection }
  )
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
//client errors
//funcion que genera un mensaje para el usuario a partir de un error
var getMensajeError=require("./lib/errores").getMensaje;
//Si se ha generado un error debido a un fallo en la peticion
app.use(function(err, req, res, next) {
  try{
    if(err.status>=400 || err.status<500){
      res.status(err.status).json({'ok': false, 'msg':err.message});
    }
    else{
      var msg=getMensajeError(err);
      if(msg){
        res.status(err.status).json({'ok': false, 'msg':msg});
        return;
      }
      next(err);
    }
  }catch(error){
    error.status=500;
    next(error);
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
