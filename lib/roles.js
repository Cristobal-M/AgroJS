//modulo que devuelve una funcion (middleware) para restringir el acceso a solo unos roles(req.session.rol) concretos
var debug = require('debug');
//permitir(ruta, rol1, rol2....)
//si se quiere enviar un error 403
var roles=['ANONYMOUS', 'USER', 'ADMIN'];

module.exports.get=function(){
  return roles;
}

module.exports.permitir= function(ruta){
  var arg=arguments;
  return function(req, res, next){
    debug('Comprobando roles: '+arg);
    //Si no se ha logeado puede ser undefined, pasa a ser anonymous
    req.session.rol=req.session.rol||'ANONYMOUS';
    var rolUsuario=req.session.rol.toUpperCase();
    for (var i = 1; i < arg.length; i++) {
      //Si hay una coincidencia se deja continuar
      if(arg[i].toUpperCase()==rolUsuario){
        next();
        return;
      }
    }
    //Si no hay coincidencia se redirige a la ruta indicada o se envia un 403
    if(ruta){
      res.redirect(ruta);
    }
    else{
      res.status(403);
      res.render('error', {
        message: 'Error 403: No puedes pasar!!!',
        error: {}
      });
    }
  }
}
