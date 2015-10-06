//Critobal Molina
//He creado este pequeño modulo para obtener los mensajes de error o generarlos para los casos
//en los que interese informar de dicho error al usuario.

//Casos en los que sea un error de validacion al guardar
function mensajeValidacion(err){
  key=Object.keys(err.errors)[0];
  type=err.errors[key].properties.type;
  message=err.errors[key].properties.message;
  path=err.errors[key].properties.path;
  switch(type){
    case 'required':
      msg="Falta el campo "+path;
      break;
    default:
      msg=message;
  }
  return msg;
}

//Si es un error que se espera se genera un string con un mensaje, si no se devuelve false

var getMensaje = module.exports.getMensaje = function(err){
  switch(err.name){
    case 'ValidationError':
      msg=mensajeValidacion(err);
      break;
    case 'MongoError':
      var field = err.message.split('.$')[1];
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_'));
      msg="Ya hay existe uno con el mismo campo "+field;
      break;
    default:
      return false;
  }
  return msg;
}

//Funcion sin probar
//La idea es responder en formato json para la aplicacion, si el error esta definido por nosotros
var tratarError = module.exports.tratarError =function(err, res, next){
  mensaje=getMensaje(err);
  if(mensaje){
    res.status(400);
    res.json({ok: false, msg: mensaje});
    return true;
  }
  else
    return next(err);
}
