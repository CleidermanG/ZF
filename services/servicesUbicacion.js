app.service('Ubicacion', function($http) {
    
    this.Ip = function() {
        return $http({
            method: 'GET',
            url: '/assets/config.json'
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

});