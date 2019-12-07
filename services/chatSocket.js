app.factory('configSocket', function($rootScope) {

    var randomObject = {};
    randomObject.socket = function(gmailWebex, urlServerSocket) {
        var socket = io.connect(urlServerSocket, {
            forceNew: true,
            query: {
                "correoElectronico": gmailWebex,
                "tipo": "Inspector"
            }
        });
        // alert(gmailWebex);

        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };

    };
    return randomObject;


});