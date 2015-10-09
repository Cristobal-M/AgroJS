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
      constructor: '=agConstructor'

    },
    link: function(scope, element, attrs) {
      scope.backup={};
      scope.nuevo={};
      scope.editando=false;
      scope.editable=(scope.editable===undefined)? false : scope.editable;
      scope.nuevos=(scope.constructor===undefined)? false : true;
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
        scope.save(nuevoElemento, true);
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
                    <td ng-hide="editando && dat.editando" style="visibility:{{(editando)?\'hidden\':\'\' }}"><button class="btn" ng-click="editar(dat)"><span class="glyphicon glyphicon-pencil"></span></button></td> \
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
