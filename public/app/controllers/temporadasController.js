var app = angular.module("app");
app.controller('temporadasController', ['$scope', '$http', 'Temporada',
  function ($scope, $http, Temporada) {
    $scope.Temporada=Temporada;
    $scope.temporadas=Temporada.query(function(e){console.log(JSON.stringify(e))});
    //Tabla de temporadas
    $scope.infoTablaTemporadas=[
      {name:'Nombre', var:'nombre'},
      {name:'Inicio', var:'inicio'},
      {name:'Fin', var:'fin'}
    ];
    var idDialogoPuestos=$scope.idDialogoPuestos='modalPuestos';
    $scope.botonesTablaTemporadas=[
      {fn:function(t){ $('#'+idDialogoPuestos).modal('show'); $scope.temporadaSeleccionada=t; }, content:'<span class="glyphicon glyphicon-info-sign"></span>'}
    ];

    $scope.infoTablaPuestos=[
      {name:'Nombre del puesto', var:'nombre'},
      {name:'Coste por hora', var:'coste_hora'}
    ];
    $scope.ObjetoVacio=function(){};

    $scope.guardarTemporada=function(tmp, cb){
      console.log(JSON.stringify(tmp));
      tmp.$save(
        //Funcion para caso de exito
        function(e){
          if($scope.actualizarTemporadas) $scope.actualizarTemporadas($scope.temporadas);
          if(cb){
            $scope.temporadas.push(e);
            cb();
          }
        },
        //Funcion en Error
        function(err){
          if(err.status==400){
             alert(err.data.msg);
          }
          console.log(JSON.stringify(err));
        }
      );
      console.log("guardar temporada terminado");
    };

    $scope.actualizarTemporada=function(tmp, cb){
      console.log(JSON.stringify(tmp));
      tmp.$update(
        //Funcion para caso de exito
        function(e){
          if($scope.actualizarTemporadas) $scope.actualizarTemporadas($scope.temporadas);
          if(cb) cb();
        },
        //Funcion en Error
        function(err){
          if(err.status==400){
             alert(err.data.msg);
          }
          console.log(JSON.stringify(err));
        }
      );
      console.log("guardar temporada terminado");
    };

    $scope.guardarTemporadaPuestos=function(p, cb){
      console.log(JSON.stringify(p));
      $scope.temporadaSeleccionada.puestos.push(p);
      $scope.temporadaSeleccionada.$update(
        //Funcion para caso de exito
        function(e){
          if($scope.actualizarTemporadas) $scope.actualizarTemporadas($scope.temporadas);
          //angular.copy(e, $scope.temporadaSeleccionada);
          if(cb){
            cb();
          }
        },
        //Funcion en Error
        function(err){
          if(err.status==400){
             alert(err.data.msg);
          }
          console.log(JSON.stringify(err));
        }
      );
      console.log("guardar temporada terminado");
    };

  }
]);
