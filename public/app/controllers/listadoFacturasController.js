var app = angular.module("app");
app.controller('listadoFacturasController', ['$scope', '$http', 'Factura',
  function ($scope, $http, Factura) {
    $scope.facturas=Factura.query();


  }]);
