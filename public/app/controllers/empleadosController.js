var app = angular.module("app");
app.controller('listaEmpleadosController', ['$scope', '$http', 'Empleado',
  function ($scope, $http, Empleado) {
    $scope.empleados=Empleado.query();

    $scope.constructorEmpleado=Empleado;
    $scope.infoTablaEmpleados=[
      {name:'DNI', var:'dni'},
      {name:'Nombre', var:'nombre'},
      {name:'Apellidos', var:'apellidos'},
      {name:'Telefono', var:'telefono'},
      {name:'Direccion', var:'direccion'}
    ];
    $scope.prueba="----";


    $scope.botonesTablaEmpleados=[
      {fn:function(e){ window.location="#/empleado/"+e._id; }, content:'<span class="glyphicon glyphicon-info-sign"></span>'}
    ];
    $scope.guardarEmpleado=function(f, cb){
      console.log(JSON.stringify(f));
      f.$save(
        //Funcion para caso de exito
        function(e){
          if(cb){
            $scope.empleados.push(f);
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
      console.log("guardar empleado terminado");
    }
  }]);

app.controller('empleadoController', ['$scope', '$http','$routeParams','Empleado',
    function ($scope, $http, $routeParams, Empleado) {
      var id=$routeParams.id;
      $scope.empleado=Empleado.get({'id': id});


      $scope.today = function() {
  $scope.dt = new Date();
};
$scope.today();

$scope.clear = function () {
  $scope.dt = null;
};

// Disable weekend selection
$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();
$scope.maxDate = new Date(2020, 5, 22);

$scope.open = function($event) {
  $scope.status.opened = true;
};

$scope.dateOptions = {
  formatYear: 'yy',
  startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];

$scope.status = {
  opened: false
};

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var afterTomorrow = new Date();
afterTomorrow.setDate(tomorrow.getDate() + 2);
$scope.events =
  [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

$scope.getDayClass = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);

    for (var i=0;i<$scope.events.length;i++){
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

      if (dayToCheck === currentDay) {
        return $scope.events[i].status;
      }
    }
  }

  return '';
};
    }]);
