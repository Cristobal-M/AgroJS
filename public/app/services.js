var clientesServices = angular.module('clientesServices', ['ngResource']);

clientesServices.factory('Cliente', ['$resource',
  function($resource){
    //Para realizar una busqueda, de los que haya una coincidencia con el nombre y apellidos o dni
    return $resource('/clientes', {},
      { query: {method:'GET', isArray:true},
        save: {method:'POST'}
        }
    );
  }
]);

clientesServices.factory('Finca', ['$resource',
  function($resource){
    //Para realizar una busqueda, de los que haya una coincidencia con el nombre y apellidos o dni
    return $resource('/clientes/:idCliente/fincas', {},
      { query: {method:'GET', isArray:true},
        save: {method:'POST'}
        }
    );
  }
]);


//////////////////////////////////////////////////////////////////////////////////
//EMPLEADOS
var empleadosServices = angular.module('empleadosServices', ['ngResource']);

empleadosServices.factory('Empleado', ['$resource',
  function($resource){
    return $resource('/empleados/:id', {id: ''},
      { query: {method:'GET', isArray:true},
        get: {method:'GET'}
      }
    );
  }
]);

empleadosServices.factory('EmpleadosActivos', ['$resource',
  function($resource){
    return $resource('/empleados/activos', {},
      { query: {method:'GET', isArray:true},
        get: {method:'GET'}
      }
    );
  }
]);

empleadosServices.factory('Jornal', ['$resource',
  function($resource){
    return $resource('/jornales', {},
      { query: {method:'GET', isArray:true},
        get: {method:'GET'}
      }
    );
  }
]);

empleadosServices.factory('Temporada', ['$resource',
  function($resource){
    return $resource('/jornales/temporadas', {},
      { query: {method:'GET', isArray:true},
        get: {method:'GET'}
      }
    );
  }
]);
