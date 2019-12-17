app.service('Agente', function($http) {
    this.consutarAgentes = function(url) {
        return $http.post(url + '/api/agentes');
    };
    this.cambiarEstadoAgente = function(url, data) {
        return $http.post(url + '/api/cambiarEstadoAgente', JSON.stringify(data));
    };
    this.Ip = function() {
        return $http({
            method: 'GET',
            url: '/assets/config.json'
        });
    };
});