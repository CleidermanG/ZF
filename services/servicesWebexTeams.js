app.service('WebexTeams', function($http) {

    this.Ip = function() {
        return $http({
            method: 'GET',
            url: '/assets/config.json'
        });
    };

    this.User = function(access_token) {
        return $http({
            method: 'GET',
            url: 'https://api.ciscospark.com/v1/people/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
    };

    this.autorizacionWay = function(data, url) {
        return $http.post(url + '/api/autorizacion', JSON.stringify(data));
    };

    this.autorizacionWay2 = function(data, url) {
        return $http.post(url + '/api/validarcuenta', JSON.stringify(data));
    };

    this.asignarInspeccion = function(data, url) {
        return $http.post(url + '/api/asignarInspeccion', data);
    };
    this.enviarAprovacion = function(data, url) {
        return $http.post(url + '/api/enviarAprobacion', data);
    };

    // this.terminarInspeccion = function(inspeccion, id_usuariozf, url) {
    //     var userwebex = {
    //         id: id_usuariozf,
    //         numInspeccion: inspeccion
    //     };
    //     return $http.post(url + '/api/terminarInspeccion', JSON.stringify(userwebex));
    // };

    this.actaInspeccion = function(actaInspeccion, url) {
        return $http.post(url + '/api/guardarActaInspeccion', JSON.stringify(actaInspeccion));
    };

    this.cosultaActaInspeccion = function(inspeccion, url) {

        return $http({
            method: 'GET',
            url: url + '/api/consultarActaInspeccion',
            header: { 'Content-Type': 'application/json; charset-utf-8' },
            params: { numero_inspeccion: inspeccion }
        });
    };

    this.generarToken = function(data, url) {
        return $http.post(url + '/api/tokenZF', JSON.stringify(data));
    };


});