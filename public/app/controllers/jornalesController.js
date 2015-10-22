var app = angular.module("app");
app.controller('jornalesController', ['$scope', '$http', 'Jornal', 'Temporada', 'Cliente', 'EmpleadosActivos','Finca',
  function ($scope, $http, Jornal, Temporada, Cliente, EmpleadosActivos, Finca) {
    var empleadosActivos=EmpleadosActivos.query();
    $scope.clientes=Cliente.query();
    $scope.temporada={};
    $scope.cliente={};
    $scope.finca={};

    $scope.Temporada=Temporada;
    $scope.temporadas=Temporada.query(function(e){console.log(JSON.stringify(e))});
    $scope.infoTablaTemporadas=[
      {name:'Nombre', var:'nombre'},
      {name:'Inicio', var:'inicio'},
      {name:'Fin', var:'fin'}
    ];

    $scope.guardarTemporada=function(tmp, cb){
      console.log(JSON.stringify(tmp));
      tmp.$save(
        //Funcion para caso de exito
        function(e){
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

    $scope.fechaFin=new Date();
    $scope.fechaInicio=new Date().setDate($scope.fechaFin.getDate()-5);

    $scope.getFincas=function(idC){
      console.log(idC);
      $scope.fincas=Finca.query({'idCliente': idC});
    }

    $scope.getJornales=function(){
      /*
      var jornalesDia= Jornal.query(
        {'fecha': $scope.fechaInicio, 'finca': finca, 'temporada': temporada},
        function(jj){
          console.log(JSON.stringify(jj));
        }
      );

      return 0;
      */
      $scope.empleados=empleadosActivos;
      var jornales=$scope.jornales={};
      var finca=$scope.finca;
      var temporada=$scope.temporada;

      var fechaFin=moment($scope.fechaFin);
      var fechaInicio=moment($scope.fechaInicio);
      var fechaActual=moment(fechaInicio);
      var num=Math.abs(fechaInicio.diff(fechaFin,'days'));
      $scope.fechas=[];
      $scope.ordenes=[];
      console.log(num);
      for (var i = 0; i<=num; i++) {
        var f=fechaActual.format("YYYY-MM-DD");
        console.log(f);
        $scope.fechas.push(f);
        var aux={};
        aux[f]='_';
        $scope.ordenes.push(aux);
        jornales[f]={};
        var jornalesDia= Jornal.query(
          {'fecha': f, 'finca': finca._id, 'temporada': temporada._id},
          function(jd){
            console.log(JSON.stringify(jd));
            for (var j=0;j<jd.length;j++) {
              var jornal_aux=jd[j];
              if(jornal_aux.empleado!==undefined)
              jornales[moment.utc(jornal_aux.fecha).format('YYYY-MM-DD')][jornal_aux.empleado]=angular.copy(jornal_aux);
            }
          }
        );
        fechaActual.add(1,'days');
      }

    }

  }]);
