var app = angular.module("app");

app.controller('facturaController', ['$scope', '$http', '$routeParams', 'Factura', 'Empresa', 'Dialogo',
  function ($scope, $http, $routeParams, Factura, Empresa, Dialogo) {
    var id=$routeParams.id;
    var facturaNueva=false;
    var dialogo=new Dialogo();
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
      if($scope.factura.conceptos.length==0) {
        dialogo.alert("Debe insertar algo");
        return;
      }
      if(facturaNueva){
        $scope.factura.$save(
          function(f){
            facturaNueva=false;
          },
          function(err){
            if(err.data.msg)
              dialogo.alert(err.data.msg);
          }
        );
      }
      else{
        $scope.factura.$update(
          function(f){

          },
          function(err){
            console.log(err);
            if(err.data.msg)
              dialogo.alert(err.data.msg);
          }
        );
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
