var app = angular.module("app", ['ngRoute','ngResource','clientesServices','dialogosServices', 'empleadosServices','ngSanitize','ui.bootstrap']);
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
   when('/factura/:id?', {
      templateUrl: viewsDir+'factura.html',
      controller: 'facturaController',
      menuActivo: 'facturas'
   }).
   when('/facturas', {
      templateUrl: viewsDir+'listaFacturas.html',
      controller: 'listadoFacturasController',
      menuActivo: 'facturas'
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
  this.vacio=new E();
  this.original=null;
  this.copia=null;
  var that=this;
  this.seleccionar= function(elemento){
    if(elemento){
      this.original= elemento;
      this.copia = angular.copy(elemento);
      this.nuevo=false;
    }
    else{
      this.original= null;
      this.copia = angular.copy(this.vacio);
      this.nuevo=true;
    }
    return this.copia;
  };

  this.guardar= function(idDialogo){
    function funcionError(err){
      if(error!=undefined){
        error(err);
        return;
      }
      else if(err.status==400){
         alert(err.data.msg);
      }
      console.log(JSON.stringify(err));
    };

    var nuevo=this.original===null;
    var that=this;
    if(nuevo){
      this.copia.$save(
        //Funcion para caso de exito
        function(e){
          angular.copy(e, that.original);
          callback(true,e)
          if(idDialogo!=undefined)
            $(idDialogo).modal('hide');
        },
        //Funcion en Error
        funcionError
      );
    }
    else{
      this.copia.$update(
        function(e){
          callback(false,e);
          if(idDialogo!=undefined)
            $(idDialogo).modal('hide');
        },
        funcionError
      );
    }
  };
};
