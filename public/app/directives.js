 angular.module("app").directive('agTablaDatos', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      datosCol: '=agCol',
      datos: '=ngModel',
      save: '=agOnSave',
      update: '=agOnUpdate',
      //Constructor para un nuevo elemento
      constructor: '=agConstructor',
      //Botones mostrados al final de cada fila, {fn: <funcion a ejecutar con ng-click funcion(elemento)>, title: <titulo>, content:<contenido del tag button>}
      buttons: '=agButtons'
    },
    link: function(scope, element, attrs) {
      scope.backup={};
      scope.nuevo={};
      scope.editando=false;
      scope.editable=(scope.update===undefined)? false : true;
      if(scope.constructor!==undefined){
        scope.nuevosElementos=true;
        scope.nuevo=new scope.constructor();
      }
      //Cuando cambien los datos se resetea
      /*
      scope.$watch('datos', function() {
        scope.editando=false;
      });
      */
      //Si esta dentro de un modal se resetea la edicion cuando se cierra, creo que es mas eficiente que lo anterior
      $(element).closest('div.modal').on("hidden.bs.modal", function(e) {scope.editando=false;});
      scope.editar=function(e){
        if(!scope.editando){
          scope.backup=angular.copy(e);
          e.editando=true;
          scope.editando=true;
        }

      }
      scope.cancelar=function(e){
        delete e.editando;
        scope.editando=false;
        angular.copy(scope.backup,e);
      }
      scope.guardar=function(e){
        delete e.editando;
        scope.editando=false;
        scope.update(e);
        console.log("callback save");
      }

      scope.guardarNuevo=function(){
        var nuevoElemento=angular.copy(scope.nuevo);
        scope.save(nuevoElemento, function(){
          scope.nuevo=new scope.constructor();
        });
      }
      scope.html=function(c){
        return c;
      }
    },
    template: '<div class="table-responsive"> \
      <table class="table table-striped table-hover"> \
          <thead> \
            <tr> \
              <th ng-repeat="col in datosCol">{{col.name}}</th> \
              <th></th> \
            </tr> \
          </thead> \
            <tbody> \
                <tr ng-show="nuevosElementos"> \
                  <td ng-repeat="col in datosCol"><input class="form-control" ng-disabled="editando"  ng-model="nuevo[col.var]"  \\></td> \
                <td><button ng-disabled="editando" class="btn" ng-click="guardarNuevo()"><span class="glyphicon glyphicon-floppy-saved"></span></button></td></tr> \
                <tr ng-repeat="dat in datos" style=" height:51px"> \
                    <td ng-hide="dat.editando" ng-repeat="col in datosCol">{{dat[col.var]}}</td> \
                    <td ng-show="dat.editando" ng-repeat="col in datosCol"><input class="form-control" ng-model="dat[col.var]"  \\></td> \
                    <td> \
                      <div ng-hide="editando && !dat.editando" style="display:inline"> \
                        <button ng-hide="dat.editando" ng-repeat="b in buttons" class="btn" ng-click="b.fn(dat)" title="b.title" ng-bind-html="html(b.content)"></button> \
                        <button ng-show="!dat.editando && editable" class="btn" ng-click="editar(dat)"><span class="glyphicon glyphicon-pencil"></span></button> \
                      </div>\
                      <div ng-show="dat.editando" style="display:inline"> \
                        <button class="btn" ng-click="guardar(dat)"><span class="glyphicon glyphicon-floppy-saved"></span></button> \
                        <button class="btn" ng-click="cancelar(dat)"><span class="glyphicon glyphicon-remove"></span></button> \
                      </div> \
                    </td> \
                </tr> \
            </tbody> \
      </table> \
    </div>'
  };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
angular.module("app").directive('agJornal',['Jornal', function(Jornal) {
 return {
   restrict: 'E',
   transclude: true,
   scope: {
     jornales: '=agJornales',
     dia: '=agDia',
     orden: '=agOrden',
     temporada: '=agTemporada',
     idTrabajador: '=agIdTrabajador',
     idCliente: '=agIdCliente',
     idFinca: '=agIdFinca'
   },
   link: function(scope, element, attrs) {
     var colors=['', '#FF4747', '#51FF47'];
     var jornales=scope.jornales[scope.dia];
     var backupJornal={};

     scope.color=colors[0];
     scope.jornal=jornales[scope.idTrabajador];
     //scope.puestos=angular.copy(scope.temporada.puestos);
     scope.puestos=scope.temporada.puestos;
     scope.editando=false;
     //Si no existe previamente se creara uno nuevo
     var nuevoJornal=scope.jornal===undefined;
     //
     scope.$watch(
       function(){return scope.jornales[scope.dia][scope.idTrabajador]!==undefined; },
        function(newValue, oldValue) {
          //console.log(8888888);
          if ( newValue !== oldValue && newValue && nuevoJornal) {
            nuevoJornal=false;
            scope.jornal=jornales[scope.idTrabajador];
          }
        }
      );

     scope.iniciarEdicion=function(){
       //Si el jornal no se ha creado previamente
       if(nuevoJornal){
         scope.jornal=new Jornal();
         scope.jornal.empleado=scope.idTrabajador;
         scope.jornal.temporada=scope.temporada._id;
         scope.jornal.cliente=scope.idCliente;
         scope.jornal.finca=scope.idFinca;
         scope.jornal.fecha=scope.dia;
         console.log("jornal nuevo"+JSON.stringify(scope.jornal));
       }
       scope.backup=angular.copy(scope.jornal);
       scope.editando=true;
     }

     scope.cancelarEdicion=function(){
       angular.copy(scope.backup, scope.jornal);

       scope.editando=false;
     }

     scope.borrarJornal= function(){
       scope.jornal.$delete({_id:scope.jornal._id},
         function(e){
           console.log(JSON.stringify(e));
           if(!nuevoJornal && e.ok)
            delete scope.jornales[scope.trabajador];
           scope.editando=false;
           scope.color=colors[2];
         },
         function(e){
           scope.color=colors[1];
           alert(e.msg);
         }
       );
     }

     scope.guardarJornal=function(){

       if(scope.jornal.horas===undefined || scope.jornal.horas===0){
         if(nuevoJornal){
           scope.editando=false;
         }
         //Si no es nuevo se considera que con horas==0 se borra
         else{
           scope.borrarJornal();
         }
         return;
       }
       console.log("guardando jornal"+JSON.stringify(scope.jornal));
       scope.jornal.$save(
         function(e){
           scope.jornal=scope.jornales[scope.trabajador]=e;
           scope.editando=false;
           scope.color=colors[2];
           nuevoJornal=false;
         },
         function(e){
           scope.color=colors[1];
           alert(e.msg);
         }
       );
     };
     //La variable scope.orden se usa para realizar determinadas acciones
     scope.$watch(
       'orden',
        function(newValue, oldValue) {
          //console.log(8888888);
          if ( newValue !== oldValue ) {
            switch (newValue) {
              case 'editar':
                scope.iniciarEdicion();
                break;
              case 'guardar':
                scope.guardarJornal();
                break;
              case 'cancelar':
                scope.cancelarEdicion();
            }
          }
        }
      );

   },
   template:
   '<div style="background-color:{{color}}"> \
     <input ng-disabled="!editando" class="form-control" ng-model="jornal.horas" type="number"> <br>\
     <select ng-disabled="!editando" class="form-control" ng-model="jornal.puesto" ng-options="p.propio+p.nombre+\' \'+p.coste_hora+\'€/h\' for p in puestos track by p.nombre+p.coste_hora"> \
     </select> \
   </div>'
 };
}]);

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
