var app = angular.module('myAppAdmin', []);
app.controller('myCtrlAdmin', function($scope, Agente) {

    $scope.agentes = [];

    $scope.cambiarEstado = function(NOMBRE_USUARIOZF) {
        var cambiarEstadoAgente = Agente.cambiarEstadoAgente(NOMBRE_USUARIOZF);
        cambiarEstadoAgente.then(function successCallback(agente) {
                $scope.agentes = [];
                $scope.connection();
            },
            function errorCallback(error) {
                console.log(error);
            });
    }

    $scope.connection = function() {
        var consutarAgente = Agente.consutarAgentes();
        consutarAgente.then(function successCallback(agentes) {
                if (agentes.data != null) {
                    $scope.agentes = agentes.data;
                    for (let i = 0; i < $scope.agentes.length; i++) {
                        if ($scope.agentes[i].ID_ESTADOAGENTE == 1) {
                            $scope.agentes[i].ID_ESTADOAGENTE = true
                            $scope.agentes[i].estado = "Habilitado"
                        } else {
                            $scope.agentes[i].ID_ESTADOAGENTE = false
                            $scope.agentes[i].estado = "Deshabilitado"
                        }
                    }
                } else {
                    alert("No existe Agentes");
                }
            },
            function errorCallback(error) {
                console.log(error);
            });
    }
});