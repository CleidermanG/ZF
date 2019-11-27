app.service('Agente', function($http) {
    this.consutarAgentes = function() {
        return $http.post(url + '/api/agentes');
    };
    this.cambiarEstadoAgente = function(id_usuariozf) {
        var userwebex = {
            id: id_usuariozf,
        };
        return $http.post(url + '/api/cambiarEstadoAgente', JSON.stringify(userwebex));
    };
});