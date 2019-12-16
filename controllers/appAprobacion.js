var app = angular.module('myApp', ['ngStorage', 'btford.socket-io']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('myCtrl', function($scope, ActaInspeccion, $location, $window, $timeout, $localStorage, configSocket) {
    $scope.ocultarTabla = true;
    $window.localStorage.clear();
    $scope.$storage = $localStorage.$default({
        time: 0
    });


    let ip = ActaInspeccion.Ip();
    ip.then(function successCallback(response) {
        // var timeLimite = 60000 * response.data.tokenExpirationCount;

        var timeLimite = 60000 * 3;
        var timerToken = function() {
            $scope.time = $localStorage.time;
            $scope.$storage.time += 1000;
            $timeout(timerToken, 1000);
            if ($scope.$storage.time === timeLimite) {
                $scope.$storage.time = 0;
                setTimeout(() => {}, 1000);
                $scope.init();
            }
            // console.log($localStorage.time);
        }
        $timeout(timerToken, 1000);

    }, function errorCallback(error) {
        console.log(error);
    });

    $scope.formActa = function(actaInspeccion) {
        if (actaInspeccion.INGRESO == 1) {
            $scope.areaOperacion1 = "X"
        } else if (actaInspeccion.SALIDAS == 1) {
            $scope.areaOperacion2 = "X"
        } else if (actaInspeccion.INSPECCION_FISICA == 1) {
            $scope.areaOperacion2 = "X"
        }


        if (actaInspeccion.BUENO == 1) {
            $scope.estadoBultos1 = "X";
        } else if (actaInspeccion.REGULAR == 1) {
            $scope.estadoBultos2 = "X";
        } else if (actaInspeccion.MALO == 1) {
            $scope.estadoBultos3 = "X";
        }


        if (actaInspeccion.DEX == 1) {
            $scope.naturaleza1 = "X"
        } else if (actaInspeccion.GUIA == 1) {
            $scope.naturaleza2 = "X"
        } else if (actaInspeccion.DI == 1) {
            $scope.naturaleza3 = "X"
        } else if (actaInspeccion.OTROS == 1) {
            $scope.naturaleza4 = "X"
            $scope.naturaleza5 = actaInspeccion.DESCRIPCION_OTROS;
        }
        $scope.nombreUsuarioOperador = actaInspeccion.NOMBRE_USUARIOOPERADOR;
        $scope.ccUsuarioOperador = actaInspeccion.CEDULA_USUARIOOPERADOR;

        $scope.nombreUsuarioZF = actaInspeccion.NOMBRE_USUARIOZF;
        $scope.ccUsuarioZF = actaInspeccion.CEDULA_USUARIOZF;

        $scope.numerosDoctumentos = actaInspeccion.NUMEROS_DOCUMENTOS;
        $scope.numeros_formularios = actaInspeccion.NUMEROS_FORMULARIOS;
        $scope.numero_bultos = actaInspeccion.NUMERO_BULTOS;
        $scope.peso = actaInspeccion.PESO;
        $scope.descripcion = actaInspeccion.DESCRIPCION;
        $scope.observaciones = actaInspeccion.OBSERVACIONES;
        $scope.otros = actaInspeccion.DESCRIPCION_OTROS;
        $scope.fecha = actaInspeccion.FECHA;

        $scope.usuario_webexcontacto = actaInspeccion.USUARIO_WEBEXCONTACTO;
        $scope.usuariowebexzf = actaInspeccion.USUARIOWEBEXZF

        $scope.aprobacion = function() {

            var data = {
                numero_inspeccion: actaInspeccion.NUMERO_INSPECCION,
                id_usuariozf: actaInspeccion.ID_USUARIOZF
            };
            let ip = ActaInspeccion.Ip();
            ip.then(function successCallback(response) {

                let actaInspeccion = ActaInspeccion.aprobacion(data, response.data.ipServices);
                actaInspeccion.then(function successCallback(acta) {
                    var socket = configSocket.socket($scope.usuario_webexcontacto, response.data.ipServices);
                    var mns = {
                        "correoElectronico": $scope.usuariowebexzf,
                    }
                    if (acta.data == '1') {
                        mns.asunto = "Acta aprobada por el operador.";
                        socket.emit("actaAprobada", mns);
                        $window.location.href = response.data.ipApplication + '/actaAprobada';
                    } else {
                        mns.asunto = "Error en la base de datos.";
                        socket.emit("actaAprobada", mns);
                    }


                }, function errorCallback(error) {
                    console.log(error);
                });
            }, function errorCallback(error) {
                console.log(error);
            });


        }

    }
    $scope.init = function() {
        if ($location.search().token == null) {
            alert('url no valida');
        } else {
            let ip = ActaInspeccion.Ip();
            ip.then(function successCallback(response) {
                let validateToken = ActaInspeccion.validateToken($location.search().token, response.data.ipServices);
                validateToken.then(function successCallback(token) {
                    document.getElementById("loader").style.display = "none";

                    let actaInspeccion = ActaInspeccion.cosultaActaInspeccion(token.data.user.inspeccion, response.data.ipServices);
                    actaInspeccion.then(function successCallback(acta) {
                        console.log(acta);


                        if (acta.data.ID_ESTADOACTA != 1) {
                            $scope.ocultarTabla = false;
                            var data = {
                                usuarioZF: acta.data.ID_USUARIOZF
                            }
                            let usuarioZF = ActaInspeccion.consultarUsuarioZF(data, response.data.ipServices);
                            usuarioZF.then(function successCallback(user) {

                                acta.data.NOMBRE_USUARIOZF = user.data.NOMBRE_USUARIOZF;
                                acta.data.CEDULA_USUARIOZF = user.data.CEDULA_AGENTE;
                                acta.data.USUARIOWEBEXZF = user.data.USUARIOWEBEX;


                                $scope.formActa(acta.data);

                            }, function errorCallback(error) {
                                console.log(error);
                            });
                        } else {
                            $window.location.href = response.data.ipApplication + '/actaAprobada';
                        }


                    }, function errorCallback(error) {
                        console.log(error);
                    });

                }, function errorCallback(error) {
                    $window.localStorage.clear();
                    $window.location.href = response.data.ipApplication + '/default';
                    console.log(error);
                });
            }, function errorCallback(error) {
                console.log(error);
            });
        }
    }
})