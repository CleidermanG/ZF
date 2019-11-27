app.service('ChatWebex', function($http) {
    this.user = function(inspeccion, url) {
        return $http({
            method: 'GET',
            url: url + '/api/chatmessages',
            params: { inspeccion: inspeccion },
            headers: { 'Accept': 'application/json' }
        });
    };
    this.sendMessage = function(data, url) {
        $http.post(url + '/api/chat', JSON.stringify(data));
    };
    this.usersAvatar = function(access_token, email) {
        return $http({
            method: 'GET',
            url: 'https://api.ciscospark.com/v1/people?email=' + email,
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
    };
    this.sendMessageObservation = function(data, url) {
        return $http.post(url + '/api/observation', JSON.stringify(data));
    };
    this.loadObservations = function(inspeccion, url) {
        return $http({
            method: 'GET',
            url: url + '/api/observations',
            header: { 'Content-Type': 'application/json; charset-utf-8' },
            params: { inspeccion: inspeccion }
        });
    };
});