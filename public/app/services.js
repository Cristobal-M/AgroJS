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

clientesServices.factory('Factura', ['$resource',
  function($resource){
    function success(res){
      alert("Factura guardada");
    };
    function error(res){
      if(res.data.msg){
        alert(res.data.msg);
      }
    };

    return $resource('/facturas/:id', {id:'@_id'},
      { query: {method:'GET', isArray:true},
        save: {method:'POST'   /*, interceptor:{response: success, responseError: error}*/ },
        update: {method:'PUT'  /*, interceptor:{response: success, responseError: error}*/ },
        get: {method:'GET'}
      }
    );
  }
]);

clientesServices.factory('Empresa', ['$resource',
  function($resource){
    return $resource('/empresa', {},
      { get: {method:'GET', isArray:false},
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
/*
//Usa bootbox
var dialogosServices = angular.module('dialogosServices', ['ngResource']);
dialogosServices.factory('Dialogo',
  function(){

    //Texto a mostrar y funciones que se llaman si se cancela o acepta
    return function(){
      this.confirm=function(text, cbA, cbC){
        bootbox.dialog({
          message: text,
          title: "Confirme",
          buttons: {
            cancel: {
              label: "Cancelar",
              className: "btn-default",
              callback: cbC
            },
            main: {
              label: "Aceptar",
              className: "btn-primary",
              callback: cbA
            }
          }
        });
      };

      this.alert=function(text, cb){
        cb=cb||function(){};
        bootbox.dialog({
          message: text,
          title: "Aviso",
          buttons:{
            main: {
              label: "Aceptar",
              className: "btn-primary",
              callback: cb
            }
          }
        });
      };
    }
  }
);
*/

var dialogosServices = angular.module('dialogosServices', ['ngResource']);
dialogosServices.factory('Dialogo',
  function(){
    var dialogo=$('<div class="modal" > \
          <div class="modal-dialog"> \
            <div class="modal-content"> \
              <div class="modal-header"> \
                <h4 class="modal-title">Modal title</h4> \
              </div> \
              <div class="modal-body"> \
                <p>One fine body&hellip;</p> \
              </div> \
              <div class="modal-footer"> \
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
                <button type="button" class="btn btn-primary">Save changes</button> \
              </div> \
            </div>\
          </div>\
        </div>');

    $("body").append(dialogo);
    var footer=dialogo.find(".modal-footer");
    var title=dialogo.find(".modal-title");
    var body=dialogo.find(".modal-body");

    var setTitle=function(texto){
      title.html(texto);
    }
    var setText=function(texto){
      body.html(texto);
    }

    //Funcion para generar otra funcion que realiza un callback
    //No se puede usar buttons[i] al definir la funcion en el bucle ya que i cambia
    var makeCallback=function(cb){
      return function(){
        if(cb) cb();
        hide();
      }
    };

    var setButtons=function(buttons){

      footer.html('');
      var cont={};
      for (var i = 0; i < buttons.length; i++) {
        var btn=$('<button class="'+buttons[i].class+'">'+buttons[i].text+'</button>');
        btn.click( makeCallback(buttons[i].fn));
        footer.append(btn);
      }
    }
    var show=function(){
      dialogo.modal('show');
    }
    var hide=function(){
      dialogo.modal('hide');
    }
    //Texto a mostrar y funciones que se llaman si se cancela o acepta
    return function(){
      this.confirm=function(text, cbA, cbC){
        dialogo.modal('show');
        setTitle("Confirme");
        setText('<p>'+text+'</p>');
        setButtons([
          {class:"btn btn-default", text:"Cancelar", fn: cbC},
          {class:"btn btn-primary", text:"Aceptar", fn: cbA}
        ]);
      };

      this.alert=function(text, cb){
        dialogo.modal('show');
        setTitle("Aviso");
        setText('<p>'+text+'</p>');
        setButtons([
          {class:"btn btn-primary", text:"Aceptar", fn: cb}
        ]);
      };
    }
  }
);
