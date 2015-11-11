//Critobal Molina
//He creado este pequeño modulo para obtener los mensajes de error o generarlos para los casos
//en los que interese informar de dicho error al usuario.

//Casos en los que sea un error de validacion al guardar
//Abajo estructura de un error
function mensajeValidacion(err){
  var key=Object.keys(err.errors)[0];
  console.log(JSON.stringify(err));
  var type=err.errors[key].kind;
  var message=err.errors[key].message;
  var path=err.errors[key].path;
  var name=err.errors[key].name;
  var msg=message;

  switch(name){
    case 'CastError':
      msg="El campo "+path+" es incorrecto";
      break;
    case 'ValidatorError':
      switch(type){
        case 'required':
          msg="Falta el campo "+path;
          break;
        case 'user defined':
          msg=message;
      }
  }

  return msg;
}

//Si es un error que se espera se genera un string con un mensaje, si no se devuelve false

var getMensaje = module.exports.getMensaje = function(err){
  console.log(err);
  switch(err.name){
    case 'ValidationError':
      msg=mensajeValidacion(err);
      break;
    case 'MongoError':
      var field = err.message.split('.$')[1];
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_'));
      msg="Ya existe uno con el mismo campo "+field;
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
/*
{

    "stack":"Error\n at MongooseError.ValidationError (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/error/validation.js:22:16)\n at model.Document.invalidate (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/document.js:1260:32)\n at /home/cristobal/workspace/agrojs/node_modules/mongoose/lib/document.js:1135:16\n at validate (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:662:7)\n at /home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:693:9\n at Array.forEach (native)\n at SchemaString.SchemaType.doValidate (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:667:19)\n at /home/cristobal/workspace/agrojs/node_modules/mongoose/lib/document.js:1133:9\n at doNTCallback0 (node.js:419:9)\n at process._tickCallback (node.js:348:13)",
    "message":"Cliente validation failed",
    "name":"ValidationError",
    "errors":{
        "dni":{
            "properties":{
                "type":"user defined",
                "message":"El dni no es valido reviselo",
                "path":"dni",
                "value":"2222"
            },
            "stack":"Error\n at MongooseError.ValidatorError (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/error/validator.js:25:16)\n at validate (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:661:13)\n at /home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:693:9\n at Array.forEach (native)\n at SchemaString.SchemaType.doValidate (/home/cristobal/workspace/agrojs/node_modules/mongoose/lib/schematype.js:667:19)\n at /home/cristobal/workspace/agrojs/node_modules/mongoose/lib/document.js:1133:9\n at doNTCallback0 (node.js:419:9)\n at process._tickCallback (node.js:348:13)",
            "message":"El dni no es valido reviselo",
            "name":"ValidatorError",
            "kind":"user defined",
            "path":"dni",
            "value":"2222"
        }
    }

}
*/
