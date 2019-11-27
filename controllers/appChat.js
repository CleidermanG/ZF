app.controller('myCtrlChat', function($scope, ChatWebex, WebexTeams, $timeout) {

    function updateScroll() {
        var element = document.getElementById("autoscroll");
        console.log(element.scrollHeight);
        element.scrollTop = element.scrollHeight;
    }

    $scope.sendMenssage = function() {
        var menssage = {
            toPersonEmail: $scope.cliente.USUARIO_WEBEXCONTACTO,
            text: $scope.myMessage,
        }
        webex.messages.create(menssage)
            .then(() => {
                $scope.myMessage = '';
            })
            .catch((err) => {
                console.error(`error listening to messages: ${err}`);
            });
    }
    $scope.sendMessageIntro = function(keyEvent) {
        if (keyEvent.which === 13)
            $scope.sendMenssage();
    }
    $scope.messageFromMe = function(mensaje) {
            if (mensaje.email == $scope.cliente.USUARIO_WEBEXCONTACTO)
                return 'sent';
            else
                return 'replies'
        }
        // setInterval(updateScroll, 1000);

    $scope.initChat = function() {

        $scope.mensajes = [];
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            var users = ChatWebex.user($scope.cliente.NUMERO_INSPECCION, response.data.ipServices);
            users.then(function(mns) {
                $scope.mensajes = mns.data;
                var count = Object.keys($scope.mensajes).length;

                for (var i = 0; i < count; i++) {
                    $scope.mensajes[i]["id"] = i;
                }
            }, function(mns) {
                alert('Error al cargar los mensajes');
            });

        }, function errorCallback(error) {
            console.log(error);
        });


        $scope.authorize().then(() => {
            webex.messages.listen()
                .then(() => {
                    toastr.success("Super!, ya puedes iniciar el chat", "Sistema Zona Franca");

                    // console.log('listening to message events');
                    webex.messages.on('created', (message) => {
                        console.log('message created event:');
                        // console.log(message.data.text);
                        $scope.data = {
                            personId: message.actorId,
                            email: message.data.personEmail,
                            mensaje: message.data.text,
                            fecha: message.data.created,
                            inspeccion: $scope.cliente.NUMERO_INSPECCION
                        };
                        // var str = "Visit W3Schools!";
                        // var n = str.search("W");
                        // console.log(n);

                        if (message.data.personEmail == $scope.cliente.USUARIO_WEBEXCONTACTO ||
                            message.data.personEmail == $scope.gmailWebex) {
                            $scope.mensajes.push($scope.data);
                            let ip = WebexTeams.Ip();
                            ip.then(function successCallback(response) {
                                ChatWebex.sendMessage($scope.data, response.data.ipServices);
                            }, function errorCallback(error) {
                                console.log(error);
                            });
                        }
                    });
                    webex.messages.on('deleted', (message) => {
                        console.log('message deleted event:');
                        console.log(message);
                    });
                })
                .catch((err) => {
                    console.error(`error listening to messages: ${err}`);
                });
        });
    }
}).directive("keepScroll", function() {

    return {

        controller: function($scope) {
            var element = 0;

            this.setElement = function(el) {
                element = el;
            }

            this.addItem = function(item) {
                // console.log("Adding item", item, item.clientHeight);
                element.scrollTop = (element.scrollTop + item.clientHeight + 1); //1px for margin
            };

        },

        link: function(scope, el, attr, ctrl) {

            ctrl.setElement(el[0]);

        }

    };

})

.directive("scrollItem", function() {


    return {
        require: "^keepScroll",
        link: function(scope, el, att, scrCtrl) {
            scrCtrl.addItem(el[0]);
        }
    }
})