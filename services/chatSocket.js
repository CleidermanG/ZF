app.factory('configSocket', function($rootScope) {

    var randomObject = {};
    randomObject.generate = function(gmailWebex) {
        var socket = io.connect('http://192.168.1.4:8000', {
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