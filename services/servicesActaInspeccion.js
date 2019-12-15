app.service('ActaInspeccion', function($http) {

    this.consultarUsuarioZF = function(data, url) {
        return $http.post(url + '/api/consultarUsuarioZF', JSON.stringify(data));
    };

    this.aprobacion = function(data, url) {
        return $http.post(url + '/api/terminarAprobacion', JSON.stringify(data));
    };

    this.cosultaActaInspeccion = function(inspeccion, url) {
        return $http({
            method: 'GET',
            url: url + '/api/consultarActaInspeccion',
            header: { 'Content-Type': 'application/json; charset-utf-8' },
            params: { numero_inspeccion: inspeccion }
        });
    };
    this.validateToken = function(token, url) {
        return $http({
            method: 'GET',
            url: url + '/api/secure',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    };
    this.Ip = function() {
        return $http({
            method: 'GET',
            url: '/assets/config.json'
        });
    };
});