app.controller('myCtrlObservaciones', function ($scope, ChatWebex, WebexTeams) {

    $scope.sendObservation = function () {
        var menssage = {
            toPersonEmail: $scope.gmailWebex,
            inspeccion: $scope.cliente.NUMERO_INSPECCION,
            text: $scope.myMessageObservation,
        }
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            var observation = ChatWebex.sendMessageObservation(menssage, response.data.ipServices);
            observation.then(function successCallback(observation) {
                if (observation.data == true) {
                    toastr.success("Se agregó una observación a la inspección", "Sistema Zona Franca");
                } else {
                    toastr.error("Ups!, hemos encontrado un problema", "Sistema Zona Franca");
                }
                $scope.myMessageObservation = ' '
                $scope.loadObservations();
            }, function errorCallback(error) {
                console.log(error);
            });
        }, function errorCallback(error) {
            console.log(error);
        });


    }
    $scope.sendMessageIntroObservation = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.sendObservation();
    }
    $scope.loadObservations = function () {
        $scope.mnsobservations = [];
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            var observation = ChatWebex.loadObservations($scope.cliente.NUMERO_INSPECCION, response.data.ipServices);
            observation.then(function successCallback(observations) {
                $scope.mnsobservations = observations.data;
            },
                function errorCallback(error) {
                    console.log(error);
                });
        }, function errorCallback(error) {
            console.log(error);
        });
    }

    $scope.sendLocation = function () {
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {

            var user = {
                token: $scope.access_token,
                inspeccion: $scope.cliente.NUMERO_INSPECCION,
                toPersonEmail: $scope.cliente.USUARIO_WEBEXCONTACTO,
                id_usuariozf: $scope.id_usuariozf,
                gmailUsuariozf: $scope.gmailWebex
            }

            let enviarUbicacion = WebexTeams.enviarUbicacion(user, response.data.ipServices);
            enviarUbicacion.then(function successCallback(inspeccion) {

                if (inspeccion.data != null) {
                    console.log(inspeccion.data);
                    toastr.success(inspeccion.data, "Sistema Zona Franca");
                } else {
                    toastr.error("Ups!, problemas con la ubicación", "Sistema Zona Franca");
                }

            }, function errorCallback(error) {
                console.log(error);
            });
        }, function errorCallback(error) {
            console.log(error);
        });

    }


    $scope.observations = function () {
        $scope.loadObservations();
    }
    $scope.location = function () {
        $scope.sendLocation();
    }
});