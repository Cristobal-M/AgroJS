var app = angular.module("app");
app.directive('contenteditable', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      var brRexp = /^.*<br>$/i;
      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$apply(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if( html == '<br>' ) {
          html = '';
        }
        if(brRexp.test(html)){
          html=html.substring(0,html.length-4);
        }
        ngModel.$setViewValue(html);
      }
    }
  }
});

app.controller('facturaController', ['$scope', '$http', '$routeParams', 'Factura', 'Empresa',
  function ($scope, $http, $routeParams, Factura, Empresa) {
    var id=$routeParams.id;
    var facturaNueva=false;
    $scope.nuevoConcepto={};
    var inicializaFactura=function(){
      facturaNueva=true;
      $scope.factura=new Factura();
      $scope.factura.cliente={};
      $scope.factura.conceptos=[];
      $scope.factura.fecha=new Date();
      var datosEmpresa=Empresa.get(function(e){
        $scope.factura.iva=e.iva;
      });
      $scope.factura.empresa=datosEmpresa;
    }
    //si no hay id se considera que se creara una nueva
    if(id===undefined){
      inicializaFactura();
    }
    else{
      $scope.factura=Factura.get({"id": id});
    }
    var getSubtotal=$scope.getSubtotal=function(){
      if($scope.factura.conceptos=== undefined || $scope.factura.conceptos.length==0){
        $scope.factura.total=0;
        $scope.factura.importeIva=0;
        return 0;
      }
      var suma=0;
      for (var i = 0; i < $scope.factura.conceptos.length; i++) {
        var c=$scope.factura.conceptos[i];
        suma+=c.unidades*c.precio_unidad;
      }
      $scope.factura.total=suma*(1+$scope.factura.iva/100);
      $scope.factura.importeIva=suma*($scope.factura.iva/100);
      return suma;
    };

    $scope.eliminarConcepto=function(i){
      $scope.factura.conceptos.splice(i,1);
    };

    $scope.anadirConcepto=function(){
      var nuevo=$scope.nuevoConcepto;
      if(nuevo.codigo && nuevo.descripcion && nuevo.unidades && nuevo.precio_unidad){
        $scope.factura.conceptos.push(nuevo);
        $scope.nuevoConcepto={};
      }
    };
    $scope.guardar=function(){
      if($scope.factura.conceptos.length==0) return;
      if(facturaNueva){
        $scope.factura.$save();
      }
      else{
        $scope.factura.$update();
      }
    }
    $scope.tipoDocumento=function(doc){
      //var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
      var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
      doc=doc.toUpperCase();
      if(nieRexp.test(doc)){
        return "NIE";
      }
      return "NIF";
    };
  }]);
