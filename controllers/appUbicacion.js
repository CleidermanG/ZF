var app = angular.module('myApp', ['ngStorage', 'btford.socket-io']);
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('myCtrl', function ($scope, Ubicacion, $location, $window, $timeout, $localStorage, configSocket) {
    document.getElementById("loader").style.display = "block";

    $window.localStorage.clear();
    $scope.$storage = $localStorage.$default({
        time: 0
    });
    $scope.ocultarTabla = true;


    let ip = Ubicacion.Ip();
    ip.then(function successCallback(response) {
        // var timeLimite = 60000 * response.data.tokenExpirationCount;
        var timeLimite = 60000 * 3;
        var timerToken = function () {
            $scope.time = $localStorage.time;
            $scope.$storage.time += 1000;
            $timeout(timerToken, 1000);
            if ($scope.$storage.time === timeLimite) {
                $scope.$storage.time = 0;
                setTimeout(() => { }, 1000);
                $scope.init();
            }
            // console.log($localStorage.time);
        }
        $timeout(timerToken, 1000);

    }, function errorCallback(error) {
        console.log(error);
    });

    $scope.formActa = function (data) {

        console.log(data);

        $scope.usuario_webexcontacto = data.toPersonEmail;
        $scope.usuariowebexzf = data.gmailUsuariozf;

        let ip = Ubicacion.Ip();
        ip.then(function successCallback(response) {
            var socket = configSocket.socket($scope.usuario_webexcontacto, response.data.ipServices);
            var x = document.getElementById("demo");

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
            
            function showPosition(position) {
                var mns = {
                    "correoElectronico": $scope.usuariowebexzf,
                    "asunto": "Ubicación enviada por el operador.",
                    "Latitude": position.coords.latitude,
                    "Longitude": position.coords.longitude
                }
                 
              
                socket.emit("ubicacion", mns);
                setTimeout(() => {
                    $window.close()
                }, 4000);
                
            }

        }, function errorCallback(error) {
            console.log(error);
        });
    }

    $scope.init = function () {
        if ($location.search().token == null) {
            alert('url no valida');
            document.getElementById("loader").style.display = "none";
        } else {
            let ip = Ubicacion.Ip();
            ip.then(function successCallback(response) {

                let validateToken = Ubicacion.validateToken($location.search().token, response.data.ipServices);
                validateToken.then(function successCallback(token) {
                    console.log(token.data.user);
                    if (token.data.user) {
                        document.getElementById("loader").style.display = "none";
                        $scope.ocultarTabla = false;
                        $scope.formActa(token.data.user);
                    } else {
                        $window.location.href = response.data.ipApplication + '/actaAprobada';
                    }

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