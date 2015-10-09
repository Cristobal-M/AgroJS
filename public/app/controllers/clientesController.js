var app = angular.module("app");
app.controller('listaClientesController', ['$scope', '$http','Cliente','Finca',
  function ($scope, $http, Cliente, Finca) {
    $scope.clientes=Cliente.query();

    var edicion=factoriaEdicion(Cliente,function(nuevo, cli){
      if(nuevo)
        $scope.clientes.push(cli);

    });

    $scope.seleccionarCliente=function(cli){
      $scope.clienteSeleccionado= edicion.seleccionar(cli);
      $scope.clienteSeleccionado.fincas=Finca.query({'idCliente': cli._id});
      /*
      $scope.clienteSeleccionado.fincas=Finca.query({'idCliente': cli._id}, function(fincas){
        fincas[0].nombre="POZO";
        fincas[0].$save({'idCliente': cli._id});
      });
      */
    };
    $scope.guardarCliente=edicion.guardar;
    $scope.constructorFinca=Finca;
    $scope.cargarFincas=function(cli){
      $scope.clienteSeleccionado=cli;
      cli.fincas=Finca.query({'idCliente': cli_id});
    }

    $scope.infoTablaFincas=[{name:'Nombre', var:'nombre'},{name:'Direccion', var:'direccion'}];
    $scope.guardarFinca=function(f, nuevo){
      console.log(JSON.stringify(f));
      f.$save({'idCliente': $scope.clienteSeleccionado._id},
        //Funcion para caso de exito
        function(e){
          if(nuevo) $scope.clienteSeleccionado.fincas.push(f);
        },
        //Funcion en Error
        function(err){
          if(err.status==400){
             alert(err.data.msg);
          }
          console.log(JSON.stringify(err));
        }
      );
      console.log("guardar finca terminado");
    }
  }]);
  //Objeto que contiene dos funciones para trabajar con edicion y guardado, y una variable al objeto que se editar
  //seleccionar requiere que el objeto sea generado por $resource para hacer un $save
  //si no se le pasa un elemento crea uno nuevo y se considera que sera un nuevo registro
  //seleccionar(elemento)
  //guardar(idDialogoModal) -> id de un modal de Bootstrap

  //A la funcion de la factoria (no se si llamarlo factoria xD), se le pasa el constructor y una funcion que se llamara
  //al finalizar correctamente el guardado, en caso de edicion se copia el objeto que devuelve el servidor en el original
