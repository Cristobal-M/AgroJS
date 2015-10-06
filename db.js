//db = mongoose.createConnection('mongodb://user:pass@localhost:port/database');
var mongoose=require('mongoose');
var nombreBD='agricola';
var host='localhost';
var db=mongoose.createConnection('mongodb://'+localhost+'/'+nombreBD);

module.exports = db;
