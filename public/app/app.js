var app = angular.module("app", ['ngRoute','ngResource','clientesServices','empleadosServices','ngSanitize','ui.bootstrap']);
var viewsDir='/app/views/';
app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.

   when('/clientes', {
      templateUrl: viewsDir+'listaClientes.html',
      controller: 'listaClientesController',
      menuActivo: 'clientes'
   }).

   when('/empleados', {
      templateUrl: viewsDir+'listaEmpleados.html',
      controller: 'listaEmpleadosController',
      menuActivo: 'empleados'
   }).
   when('/empleado/:id', {
      templateUrl: viewsDir+'infoEmpleado.html',
      controller: 'empleadoController',
      menuActivo: 'empleados'
   }).
   when('/jornales', {
      templateUrl: viewsDir+'tablaJornales.html',
      controller: 'jornalesController',
      menuActivo: 'jornales'
   }).
   otherwise({
      redirectTo: '/'
   });
}]);
app.controller('menuController', ['$scope','$route',
    function ($scope, $route) {
      $scope.$route=$route;
    }]);

/*Genera on objeto con dos funciones, seleccionar y guardar. Depende de angular y resource
Seleccionar registrara y devolvera una referencia a un objeto que se quiere editar
Guardar reescribira el elemento original
callback se le llamara cuando sea la creacion de uno nuevo y la respuesta al $save sea correcta
se considera nuevo si se llama a seleccionar sin argumentos
*/
function factoriaEdicion(E,callback,error){
  var vacio=new E();
  var original=null;
  var copia=null;

  var seleccionar= function(elemento){
    if(elemento!=undefined){
      original= elemento;
      copia = angular.copy(elemento);
    }
    else{
      original= null;
      copia = angular.copy(vacio);
    }
    return copia;
  };

  var guardar= function(idDialogo){
    copia.$save(
      //Funcion para caso de exito
      function(e){
        if(original!=null){
          angular.copy(e, original);
          callback(false,e)
        }
        else {
          callback(true,e)
        }
        if(idDialogo!=undefined)
          $(idDialogo).modal('hide');
      },
      //Funcion en Error
      function(err){
        if(error!=undefined){
          error(err);
          return;
        }
        else if(err.status==400){
           alert(err.data.msg);
        }
        console.log(JSON.stringify(err));
      }
    );
  };
  return {'guardar': guardar, 'seleccionar': seleccionar};
};
