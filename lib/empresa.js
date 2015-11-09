var fs = require('fs');
var file='empresa.json';

var obj;

function getDatos(cb){
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) console.log(err);
    obj = JSON.parse(data);
    cb(false, obj);
  });
}

function setDatos(obj, cb){
  var data=JSON.stringify(obj);
  fs.writeFile(file, data, 'utf8', function (err) {
    cb(err);
  });
}


module.exports.getDatos= getDatos;
module.exports.setDatos= setDatos;
