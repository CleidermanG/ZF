app.service('ServicesToken', function($http) {
    this.autorizacionWay = function(data, url) {
        return $http.post(url + '/api/autorizacion', JSON.stringify(data));
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
    this.token = function(user, url) {
        console.log(user);
        return $http.post(url + '/api/token', JSON.stringify(user));
    };
});