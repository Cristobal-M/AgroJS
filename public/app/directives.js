 angular.module("app").directive('agTablaDatos', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      datosCol: '=agCol',
      datos: '=ngModel',
      save: '=agOnSave',
      editable: '@agEditable',
      //Constructor para un nuevo elemento
      constructor: '=agConstructor',
      //Botones mostrados al final de cada fila, {fn: <funcion a ejecutar con ng-click funcion(elemento)>, title: <titulo>, content:<contenido del tag button>}
      buttons: '=agButtons'
    },
    link: function(scope, element, attrs) {
      scope.backup={};
      scope.nuevo={};
      scope.editando=false;
      scope.editable=(scope.editable===undefined)? false : scope.editable;
      if(scope.constructor!==undefined){
        scope.nuevos=true;
        scope.nuevo=new scope.constructor();
      }
      //Cuando cambien los datos se resetea
      /*
      scope.$watch('datos', function() {
        scope.editando=false;
      });
      */
      //Si esta dentro de un modal se resetea la edicion si se cierra, es mas eficiente que lo anterior
      $(element).closest('div.modal').on("hidden.bs.modal", function(e) {scope.editando=false;});
      scope.editar=function(e){
        scope.backup=angular.copy(e);
        e.editando=true;
        scope.editando=true;
      }
      scope.cancelar=function(e){
        delete e.editando;
        scope.editando=false;
        angular.copy(scope.backup,e);
      }
      scope.guardar=function(e){
        delete e.editando;
        scope.editando=false;
        scope.save(e);
        console.log("callback save");
      }

      scope.guardarNuevo=function(){
        var nuevoElemento=new scope.constructor(scope.nuevo);
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
              <th style="width:120px"></th> \
            </tr> \
          </thead> \
            <tbody> \
                <tr ng-show="nuevos"> \
                  <td ng-repeat="col in datosCol"><input class="form-control" ng-disabled="editando"  ng-model="nuevo[col.var]"  \\></td> \
                <td><button ng-disabled="editando" class="btn" ng-click="guardarNuevo()"><span class="glyphicon glyphicon-floppy-saved"></span></button></td></tr> \
                <tr ng-repeat="dat in datos"> \
                    <td ng-hide="dat.editando" ng-repeat="col in datosCol">{{dat[col.var]}}</td> \
                    <td ng-show="dat.editando" ng-repeat="col in datosCol"><input class="form-control" ng-model="dat[col.var]"  \\></td> \
                    <td ng-hide="editando && dat.editando" style="visibility:{{(editando)?\'hidden\':\'\' }}"> \
                      <button ng-hide="dat.editando || !buttons" ng-repeat="b in buttons" class="btn" ng-click="b.fn(dat)" title="b.title" ng-bind-html="html(b.content)"></button> \
                      <button class="btn" ng-click="editar(dat)"><span class="glyphicon glyphicon-pencil"></span></button> \
                    </td> \
                    <td ng-show="dat.editando"> \
                      <button class="btn" ng-click="guardar(dat)"><span class="glyphicon glyphicon-floppy-saved"></span></button> \
                      <button class="btn" ng-click="cancelar(dat)"><span class="glyphicon glyphicon-remove"></span></button> \
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
     orden: '=agOrden',
     trabajador: '=agTrabajador',
     temporada: '=agTemporada',
     cliente: '=agCliente',
     finca: '=agFinca'
   },
   link: function(scope, element, attrs) {
     var colors=['', '#FF4747', '#51FF47'];
     scope.color=colors[0];
     scope.backup={};
     scope.jornal=scope.jornales[scope.trabajador];
     scope.nuevo=(scope.jornal!==undefined)? false : true;
     console.log(scope.trabajador);
     scope.iniciarEdicion=function(){
       if(scope.nuevo){
         scope.jornal=new Jornal();
         scope.jornal.empleado=scope.trabajador;
         scope.jornal.temporada=scope.temporada._id;
         scope.jornal.cliente=scope.cliente;
         scope.jornal.finca=scope.finca;
         console.log("jornal nuevo"+JSON.stringify(scope.jornal));
       }
       scope.backup=angular.copy(scope.jornal);
       scope.editando=true;
     }

     scope.cancelarEdicion=function(){
       angular.copy(scope.backup, scope.jornal);
       scope.editando=true;
     }
     scope.guardarJornal=function(){
       console.log("guardando jornal"+JSON.stringify(scope.jornal));
       scope.jornal.$save(
         function(e){
           if(scope.nuevo)
            scope.jornales[scope.trabajador]=e;
           scope.editando=false;
           scope.color=colors[2];
         },
         function(e){
           scope.color=colors[1];
           alert(e.msg);
         }
       );
     };
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
   '<div style="background-color:{{color}}"> {{orden}}\
     <input ng-model="jornal.horas" type="number"> \
     <select ng-model="jornal.puesto" multiple> \
        <option ng-repeat="puesto in temporada.puestos" value="{{puesto}}">{{puesto.nombre+" "+puesto.coste_hora}}</option> \
     </select> \
   </div>'
 };
}]);
