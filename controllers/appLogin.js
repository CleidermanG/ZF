var app = angular.module('myApp', ['ngStorage']);
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('myCtrlLogin', function ($scope, $window, $localStorage, $location, $http, ServicesToken, WebexTeams) {
    document.getElementById("loader").style.visibility = "hidden";
    if ($location.search().token == null) {
        alert('url no valida');
    } else {
        $http({
            method: 'GET',
            url: '/assets/config.json'
        }).then(function (response) {
            document.getElementById("loader").style.visibility = "visible";
            let validateToken = ServicesToken.validateToken($location.search().token, response.data.ipServices);
            validateToken.then(function successCallback(token) {
                let autorizacionWay = WebexTeams.autorizacionWay2(token.data.user, response.data.ipServices);
                autorizacionWay.then(function successCallback(userwebex) {
                    if (userwebex.data != null) {
                        var redirect = function () {
                            var promise = new Promise(function (resolve, reject) {
                                document.getElementById("loader").style.visibility = "hidden";
                                $window.location.href = response.data.ipApplication + '/views/index.html?token=' + token.data.token;
                            });
                            return promise;
                        };
                        redirect()
                    } else {
                        alert('Usuario o contraseña incorrecta')
                        $window.location.href = 'https://google.com'
                    }
                }, function errorCallback(error) {
                    console.log(error);
                    alert("Usuario sin cuenta de webex");
                    $window.location.href = 'https://google.com'
                });

            }, function errorCallback(error) {
                alert("Token no valido");
                $window.location.href = 'https://google.com'
                console.log(error);
            });
        });
    }

})