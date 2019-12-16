var app = angular.module('myApp', [
    'ngFileUpload',
    'ngStorage',
    'duScroll',
    'btford.socket-io'
]).value('duScrollOffset', 60);
document.getElementById("pagina").style.visibility = "hidden";
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);


app.controller('myCtrl', function($scope, WebexTeams, servicesMultimedia, $filter, $location,
    $timeout, $interval, $window, $localStorage, ServicesToken, $timeout, $http, configSocket) {
    var recorder; // globally accessible
    let webex; // globally accessible


    $scope.$storage = $localStorage.$default({
        time: 0,
        sesion: null
    });

    // user: null
    // timer callback
    var timerToken = function() {
        $scope.time = $localStorage.time;
        // $scope.$storage.time = 0;
        $scope.$storage.time += 1000;
        $timeout(timerToken, 1000);
        var timeLimite = 60000 * 60;
        if ($scope.$storage.time === timeLimite) {
            // alert('tiempo');
            $scope.$storage.time = 0;
            $scope.connectiontwo();
        }
        // console.log($localStorage.time);
    }
    $timeout(timerToken, 1000);

    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-bottom-left"
    };

    $scope.test = function(nameFile, type) {
        swal.fire({
            title: 'Seguro que quieres eliminar esto?',
            text: "Esta acción ya no se podrá deshacer, Así que piénsalo bien.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro'
        }).then((result) => {
            if (result.value) {
                var deleteFile = {
                    type: type,
                    name: nameFile,
                    inspeccion: $scope.cliente.NUMERO_INSPECCION
                };

                let ip = WebexTeams.Ip();
                ip.then(function successCallback(response) {
                    deleteFile = servicesMultimedia.deleteFile(deleteFile, response.data.ipServices);
                    deleteFile.then(function successCallback(file) {
                        Swal.fire(
                            'Eliminado!',
                            'Su archivo ha sido eliminado.',
                            'success'
                        )
                        $scope.cargarMultimediaVideos($scope.cliente.NUMERO_INSPECCION);
                        $scope.cargarMultimediaImages($scope.cliente.NUMERO_INSPECCION);
                    }, function errorCallback(error) {
                        console.log(error);
                        toastr.error("Ups!, hemos encontrado un problema", "Sistema Zona Franca");

                    });

                }, function errorCallback(error) {
                    console.log(error);
                });

            }
        })
    }

    var canvas = document.getElementById('canvas');

    document.getElementById(`remote-view-video`).addEventListener('loadedmetadata', function() {
        var video = document.getElementById(`remote-view-video`);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }, false);
    $scope.username = "User name";
    $scope.avatar = "../images/user.png";
    $scope.imagesScreenshot = [];
    $scope.videosInspeccion = [];
    $scope.btnAprobacion = false;
    $scope.btnTerminarInspeccion = true;
    $scope.btnChat = false;
    $scope.btnLlamarHide = false;



    $scope.connection = function() {
        if ($location.search().token == null) {
            // alert('url no valida');
            $scope.connectiontwo();
        } else {
            let ip = WebexTeams.Ip();
            ip.then(function successCallback(response) {
                let validateToken = ServicesToken.validateToken($location.search().token, response.data.ipServices);
                validateToken.then(function successCallback(token) {
                    console.log(token.data.user);
                    // $scope.$storage.user = token.data.user
                    let autorizacionWay = WebexTeams.autorizacionWay(token.data.user, response.data.ipServices);
                    autorizacionWay.then(function successCallback(userwebex) {
                        $scope.$storage.sesion = userwebex.data.sesion;
                        $scope.connectiontwo();
                    }, function errorCallback(error) {
                        console.log(error);
                    });

                }, function errorCallback(error) {
                    // alert("La sesión corta termino");
                    console.log(error);
                    $scope.connectiontwo();
                });
            }, function errorCallback(error) {
                console.log(error);
            });



        }
    }

    $scope.connectiontwo = function() {

        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            let validateToken = ServicesToken.validateToken($localStorage.sesion, response.data.ipServices);
            validateToken.then(function successCallback(token) {

                    document.getElementById("loader2").style.visibility = "hidden";
                    document.getElementById("pagina").style.visibility = "visible";
                    console.log(token.data.user);
                    $scope.id_usuariozf = token.data.user.recordset.ID_USUARIOZF;
                    $scope.username = token.data.user.recordset.NOMBRE_USUARIOZF;
                    $scope.gmailWebex = token.data.user.recordset.USUARIOWEBEX;
                    var socket = configSocket.socket($scope.gmailWebex, response.data.ipServices)
                    socket.on('actaAprobada', function(resp) {
                        $scope.btnAprobacion = true;
                        $scope.btnTerminarInspeccion = false;
                        $scope.btnChat = true;
                        $scope.btnLlamar = true;
                        toastr.success(resp.asunto, "Sistema Zona Franca");
                    });

                    if (token.data.user.avatar) {
                        $scope.avatar = token.data.user.avatar;
                    }
                    $scope.access_token = token.data.user.access_token;

                    var user = {
                        id: token.data.user.recordset.ID_USUARIOV,
                        usuarioZF: token.data.user.recordset.ID_USUARIOZF
                    }



                    let asignarInspeccion = WebexTeams.asignarInspeccion(user, response.data.ipServices);
                    asignarInspeccion.then(function successCallback(inspeccion) {

                        if (inspeccion.data != null) {
                            console.log(inspeccion.data);
                            $scope.cliente = inspeccion.data;
                            $scope.connect($scope.access_token);
                            $scope.initChat();

                            $scope.cargarMultimediaImages($scope.cliente.NUMERO_INSPECCION);
                            $scope.cargarMultimediaVideos($scope.cliente.NUMERO_INSPECCION);

                            $scope.acta()

                        } else {
                            toastr.error("Ups!, No existe inspecciones por el momento", "Sistema Zona Franca");
                        }

                    }, function errorCallback(error) {
                        console.log(error);
                    });

                },
                function errorCallback(error) {
                    $window.localStorage.clear();
                    toastr.error("Ups!, término de la sesión ", "Sistema Zona Franca");
                    $http({
                        method: 'GET',
                        url: '/assets/config.json'
                    }).then(function(response) {
                        $window.location.href = response.data.ipApplication + '/views/login.html'
                        console.log(error);
                    });

                });

        }, function errorCallback(error) {
            console.log(error);
        });
    }


    $scope.cargarMultimediaImages = function(inspeccion) {
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            $scope.multimediaUrl = response.data.ipServices + "/multimedia/" + inspeccion;
            var screenInspeccion = servicesMultimedia.loadScreen(inspeccion, response.data.ipServices);
            screenInspeccion.then(function successCallback(dataScreen) {
                $scope.imagesScreenshot = dataScreen.data.sort(function(a, b) { return b.num - a.num });
            }, function errorCallback(error) {
                console.log(error);
            });

        }, function errorCallback(error) {
            console.log(error);
        });

    }
    $scope.cargarMultimediaVideos = function(inspeccion) {
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            var videosUser = servicesMultimedia.loadVideos(inspeccion, response.data.ipServices);
            videosUser.then(function successCallback(dataVideo) {
                $scope.videosInspeccion = dataVideo.data.sort(function(a, b) { return b.num - a.num });
            }, function errorCallback(error) {
                console.log(error);
            });

        }, function errorCallback(error) {
            console.log(error);
        });

    }

    $scope.btnllamar = function() {
        var myAudio = document.getElementById("myAudio");
        myAudio.play();
        // document.getElementById("loader").style.display = "block";
        // document.getElementById("llamando").style.display = "block";
        // document.getElementById("remote-view-video").poster = "";

        document.getElementById(`iconColgar`).style.visibility = "visible";
        const call = spark.phone.dial($scope.cliente.USUARIO_WEBEXCONTACTO);
        $scope.bindCallEvents(call);
    }

    $scope.bindCallEvents = function(call) {


        call.on(`error`, (err) => {
            console.error(err);
            alert(err);
        });

        call.once(`remoteMediaStream:change`, () => {

            document.getElementById(`remote-view-video`).srcObject = call.remoteMediaStream;
            document.getElementById(`remote-view-video`).onloadedmetadata = function() {

                // var sendFile = function() {
                //     var promise = new Promise(function(resolve, reject) {
                //         var myAudio = document.getElementById("myAudio");
                //         myAudio.pause();
                //         document.getElementById("loader").style.display = "none";
                //         document.getElementById("llamando").style.display = "none";
                //         document.getElementById("remote-view-video").poster = "../images/video.jpg";
                //         resolve(true)
                //     });
                //     return promise;
                // };
                // sendFile();

                $scope.startTimerWithTimeout()
                recorder = RecordRTC(call.remoteMediaStream, {
                    type: 'video',
                });
                recorder.startRecording();
            };
        });

        call.on(`connected`, () => {
            document.getElementById('iconScreen').setAttribute("style", "visibility: visible;");
            document.getElementById('btnLlamar').setAttribute("style", "visibility: hidden;");
            document.getElementById(`iconColgar`).style.visibility = "visible";
            toastr.success("Videollamada establecida", "Sistema Zona Franca");
            var myAudio = document.getElementById("myAudio");
            myAudio.pause();
            // document.getElementById("loader").style.display = "none";
            // document.getElementById("llamando").style.display = "none";

        });
        call.on(`disconnected`, () => {
            document.getElementById('iconScreen').setAttribute("style", "visibility: hidden;");
            document.getElementById(`iconColgar`).style.visibility = "hidden";
            document.getElementById('btnLlamar').setAttribute("style", "visibility: visible;");

            $scope.pauseTimerWithTimeout();
            if (recorder != null && recorder != undefined) {
                recorder.stopRecording(stopRecordingCallback());
            }
            call.cleanup()
            call = undefined;
            toastr.success("Videollamada terminada", "Sistema Zona Franca");
        });


        function stopRecordingCallback() {
            var saveBlob = function() {
                var promise = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        var blob = recorder.getBlob();
                        resolve(blob);
                    }, 2000);
                });
                return promise;
            };
            var codingFile = function(blob) {
                var promise = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        var file = new File([blob], ('video' + '.webm'), {
                            type: 'video/webm'
                        });
                        resolve(file);
                    }, 2000);
                });
                return promise;
            };

            var sendFile = function(file) {
                var promise = new Promise(function(resolve, reject) {
                    let ip = WebexTeams.Ip();
                    ip.then(function successCallback(response) {
                        var video2 = servicesMultimedia.saveVideo($scope.cliente.NUMERO_INSPECCION, file, response.data.ipServices);
                        video2.then(function(response) {
                            toastr.success(response.data, "Sistema Zona Franca");
                            resolve(true)
                        });
                    }, function errorCallback(error) {
                        console.log(error);
                    });

                });
                return promise;
            };
            var destroyRecorder = function() {
                var promise = new Promise(function(resolve, reject) {
                    recorder.destroy();
                    recorder = null;
                    resolve(true);
                });
                return promise;
            };
            var updateVideos = function() {
                var promise = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        $scope.cargarMultimediaVideos($scope.cliente.NUMERO_INSPECCION);
                        resolve(true);
                    }, 3000);
                });
                return promise;
            };
            saveBlob()
                .then(codingFile)
                .then(sendFile)
                .then(destroyRecorder)
                .then(updateVideos);

            document.getElementById(`remote-view-video`).src = null;
            document.getElementById(`remote-view-video`).srcObject = null;
            document.getElementById(`remote-view-video`).srcObject = undefined;

        }

        $scope.dataURItoBlob = function(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
        }

        function watermarkedDataURL(canvas, text) {
            // var tempCanvas = document.createElement('canvas');
            var tempCanvas = document.getElementById('canvas2');
            var tempCtx = tempCanvas.getContext('2d');
            // tempCanvas.clearRect(0, 0, canvas.width, canvas.height);
            var cw, ch;
            cw = tempCanvas.width = canvas.width;
            ch = tempCanvas.height = canvas.height;
            tempCtx.drawImage(canvas, 0, 0);
            tempCtx.font = "23px Calibri";
            var textWidth = tempCtx.measureText(text).width;
            tempCtx.globalAlpha = .80;
            tempCtx.fillStyle = '#ffc107'
            tempCtx.fillText(text, cw - textWidth - 10, ch - 20);
            tempCtx.fillStyle = '#00632f'
            tempCtx.fillText(text, cw - textWidth - 10 + 2, ch - 20 + 2);
            // just testing by adding tempCanvas to document
            document.body.appendChild(tempCanvas);
            return (tempCanvas.toDataURL());
        }

        function fechaServer() {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var h = today.getHours();
            var min = today.getMinutes();
            today = dd + "/" + mm + "/" + yyyy + " " + h + ":" + min;
            return (today.toString());
        }



        $scope.screenshot = function() {
            let ip = WebexTeams.Ip();
            ip.then(function successCallback(response) {
                // var dataURL = canvas.toDataURL()
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                var video = document.getElementById(`remote-view-video`);
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                var fecha = fechaServer();
                var dataURL = watermarkedDataURL(canvas, fecha);
                var blobImage = $scope.dataURItoBlob(dataURL);
                var fileImage = new File([blobImage], "fileName.jpeg", {
                    type: "'image/jpeg'"
                });
                var fileImage = servicesMultimedia.saveScreenshot($scope.cliente.NUMERO_INSPECCION, fileImage, response.data.ipServices);
                fileImage.then(function(resp) {
                    if (resp.data = true) {
                        toastr.success("ScreenShot save!", "Sistema Zona Franca");
                        $scope.cargarMultimediaImages($scope.cliente.NUMERO_INSPECCION);
                    }
                }, function(resp) {
                    toastr.error("Ups!, hemos encontrado un problema", "Sistema Zona Franca");
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });

            }, function errorCallback(error) {
                console.log(error);
            });

        }

        // document.getElementById("llamando").style.display = "block";
        // document.getElementById("loader").style.display = "block";
        // var myAudio = document.getElementById("myAudio");
        // myAudio.play();
        // document.getElementById("iconColgar").style.visibility = "visible";


        document.getElementById(`btnColgar`).addEventListener(`click`, () => {

            swal.fire({
                title: 'Seguro que quieres terminar la videollamada?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {

                    var myAudio = document.getElementById("myAudio");
                    myAudio.pause();
                    // document.getElementById("loader").style.display = "none";
                    // document.getElementById("llamando").style.display = "none";
                    // document.getElementById("remote-view-video").poster = "../images/video.jpg";

                    call.hangup();
                    document.getElementById(`iconColgar`).style.visibility = "hidden";
                    // console.log('Objeto call');
                    // console.log(call);
                    // console.log('Objeto status');
                    // console.log(call.status);
                    // call.acknowledge();
                    // call.answer();
                    // call.decline();
                    // call.leave();
                    // call.reject();
                    // call.hangup();
                    // call.cleanup()
                    // call.reject();
                    // call.leave();
                }
            })

        });

    }


    $scope.connect = function(access_token) {
        spark = ciscospark.init({
            credentials: {
                access_token: access_token
            }
        });
        spark.once(`ready`, function() {
            spark.phone.register()
                .catch((err) => {
                    console.error(err);
                    alert(err);
                    throw err;
                });
            toastr.success("Hola, bienvenido al sistema ya puedes iniciar video llamadas", "Sistema Zona Franca");
        });
        $scope.authorize();
    }


    $scope.authorize = function() {
        webex = window.webex = Webex.init({
            credentials: {
                access_token: $scope.access_token
            }
        });

        if (webex.canAuthorize) {
            return Promise.resolve(webex.canAuthorize);
        }
        return Promise.reject(webex.canAuthorize);
    }

    $scope.acta = function() {
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            let actaInspeccion = WebexTeams.cosultaActaInspeccion($scope.cliente.NUMERO_INSPECCION, response.data.ipServices);
            actaInspeccion.then(function successCallback(inspeccion) {
                if (inspeccion.data.ID_ESTADOACTA != 1) {
                    if (inspeccion.data.ID_USUARIOZF) {
                        $scope.formActa(inspeccion.data);
                        toastr.success("Esperando aprobación del operador", "Sistema Zona Franca");
                    }
                } else {
                    $scope.btnAprobacion = true;
                    $scope.btnChat = true;
                    $scope.btnLlamar = true;
                    $scope.btnTerminarInspeccion = false;
                    toastr.success("El acta ya fue aprobada por el operador", "Sistema Zona Franca");
                    $scope.formActa(inspeccion.data);
                }

            }, function errorCallback(error) {
                console.log(error);
            });

        }, function errorCallback(error) {
            console.log(error);
        });
    }

    //timer with timeout
    $scope.timerWithTimeout = 00;
    $scope.startTimerWithTimeout = function() {
        $scope.timerWithTimeout = 00;
        if ($scope.myTimeout) {
            $timeout.cancel($scope.myTimeout);
        }
        $scope.onTimeout = function() {
            $scope.timerWithTimeout++;
            $scope.myTimeout = $timeout($scope.onTimeout, 1000);
        }
        $scope.myTimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.pauseTimerWithTimeout = function() {
        $timeout.cancel($scope.myTimeout);
    }
})