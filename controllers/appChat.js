app.controller('myCtrlChat', function ($scope, ChatWebex, WebexTeams, $timeout) {


    $scope.sendMenssage = function () {
        var menssage = {
            toPersonEmail: $scope.cliente.USUARIO_WEBEXCONTACTO,
            text: $scope.myMessage,
        }
        
        var blockURL = menssage.text.includes("aprobacion?token");
        if (!blockURL) {
            webex.messages.create(menssage)
                .then(() => {
                    $scope.myMessage = '';
                })
                .catch((err) => {
                    console.error(`error listening to messages: ${err}`);
                });
        } else {
            $scope.myMessage = '';
        }

    }
    $scope.sendMessageIntro = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.sendMenssage();
    }
    $scope.messageFromMe = function (mensaje) {
        if (mensaje.email == $scope.cliente.USUARIO_WEBEXCONTACTO)
            return 'sent';
        else
            return 'replies'
    }

    $scope.initChat = function () {

        $scope.mensajes = [];
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            var users = ChatWebex.user($scope.cliente.NUMERO_INSPECCION, response.data.ipServices);
            users.then(function (mns) {
                $scope.mensajes = mns.data;
            }, function (mns) {
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


                        let ip = WebexTeams.Ip();
                        ip.then(function successCallback(response) {
                            var blockURL = message.data.text.includes("?token");
                            if (!blockURL) {
                                if (message.data.personEmail == $scope.cliente.USUARIO_WEBEXCONTACTO ||
                                    message.data.personEmail == $scope.gmailWebex) {
                                    $scope.mensajes.push($scope.data);
                                    ChatWebex.sendMessage($scope.data, response.data.ipServices);
                                }
                            }
                        }, function errorCallback(error) {
                            console.log(error);
                        });
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
});

