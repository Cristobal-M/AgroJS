//modulo que devuelve una funcion (middleware) para restringir el acceso a solo unos roles(req.session.rol) concretos
var debug = require('debug');
var bcrypt = require('bcrypt');
var Usuario=require('../models/usuario');
var debug = require('debug')('agrojs:seguridad');
//permitir(ruta, rol1, rol2....)
//si se quiere enviar un error 403
var roles=['ANONYMOUS', 'USER', 'ADMIN'];
//Administrador por defecto en el sistema
//123 bcrypt ->$2a$10$YbMdow6iRFdLOMtMREOmCuN2O9KQ7qe6iW06/DSz1SMvSuQM4q.YW
var admin={usuario: 'admin', clave: '$2a$10$YbMdow6iRFdLOMtMREOmCuN2O9KQ7qe6iW06/DSz1SMvSuQM4q.YW', rol: 'ADMIN'};
module.exports.getRoles=function(){
  return roles;
}
module.exports.getNombreAdmin=function(){
  return admin.usuario;
}

function setSesionAdmin(session){
  session.user=admin.nombre;
  session.rol=admin.rol;
}
//Funcion que realiza el proceso de logeo incluido las variables de sesion
module.exports.login= function(req, callback){
  debug('iniciado proceso de logeo');
  //id puede ser correo o usuario
  var id= req.body.identificacion;
  var clave= req.body.clave;
  //Por si son undefined
  id=id||"";
  clave=clave||"";
  if(id==admin.usuario){
    debug('es posible que sea el admin por defecto del sistema, comprobando');
    bcrypt.compare(clave, admin.clave, function(err, isMatch) {
      if (err) return callback(err);
      debug('claves comparadas->'+isMatch);
      req.session.usuario=admin.usuario;
      req.session.rol=admin.rol;
      return callback(null, isMatch);
    });
    return;
  }
  if(id=="" || clave==""){
    debug('la clave o la identificacion estan vacias, se termina');
    return callback(null, false);
  }
  //Buscamos entre los usuarios uno que cumpla con usuario o email
  debug('buscando usuario en la bd');
  Usuario.findOne({$or: [{'usuario': id}, {'email': id}]},
    function(err,user){
      if(err) throw(err);
      if(user){
        debug('usuario encontrado, comprobando clave');
        user.verificaClave(clave, function(err, igual){
          if(err) callback(err);
          if(igual){
            debug('las claves coinciden, terminando');
            req.session.usuario=user.usuario;
            req.session.rol=user.rol;
            //Se llama al callback con un true
            return callback(null, true);
          }
          else {
            debug('no coinciden, terminando');
            return callback(null, false);
          }
        });
      }
      else
       return callback(null, false);
    });
}
module.exports.permitirRoles= function(ruta){
  var arg=arguments;
  return function(req, res, next){
    debug('Comprobando roles');
    //Si no se ha logeado puede ser undefined, pasa a ser anonymous
    req.session.rol=req.session.rol||'ANONYMOUS';
    var rolUsuario=req.session.rol.toUpperCase();
    debug('Rol: '+rolUsuario);
    for (var i = 1; i < arg.length; i++) {
      debug('Comprobando rol '+ arg[i]);
      //Si hay una coincidencia se deja continuar
      if(arg[i].toUpperCase()==rolUsuario){
        debug('Rol permitido');
        next();
        return;
      }
    }
    debug('Usuario con rol no permitido');
    //Si no hay coincidencia se redirige a la ruta indicada o se envia un 403
    if(ruta){
      debug('se redirecciona');
      res.redirect(ruta);
    }
    else{
      debug('Envio 403');
      res.status(403);
      res.render('error.html', {
        message: 'Error 403: No puedes pasar!!!',
        error: {status: 403}
      });
    }
  }
}
