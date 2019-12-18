app.controller('myCtrlActa', function ($scope, WebexTeams) {
    document.getElementById("other").required = false;
    $scope.cual = true;
    $scope.change = function () {
        $scope.cual = false;
        document.getElementById("other").required = true;
    }
    $scope.changeTwo = function () {
        $scope.cual = true;
        document.getElementById("other").required = false;
    }

    $scope.formActa = function (actaInspeccion) {
        console.log(actaInspeccion);
        document.getElementById("NUMEROS_DOCUMENTOS").value = actaInspeccion.NUMEROS_DOCUMENTOS;
        document.getElementById("NUMEROS_FORMULARIOS").value = actaInspeccion.NUMEROS_FORMULARIOS;
        document.getElementById("NUMERO_BULTOS").value = actaInspeccion.NUMERO_BULTOS;
        document.getElementById("PESO").value = actaInspeccion.PESO;
        document.getElementById("DESCRIPCION").value = actaInspeccion.DESCRIPCION;
        document.getElementById("OBSERVACIONES").value = actaInspeccion.OBSERVACIONES;
        document.getElementById("other").value = actaInspeccion.DESCRIPCION_OTROS;

        if (actaInspeccion.INGRESO == 1) {
            document.getElementById("operaciones1").checked = true;
        } else if (actaInspeccion.SALIDAS == 1) {
            document.getElementById("operaciones2").checked = true;
        } else if (actaInspeccion.INSPECCION_FISICA == 1) {
            document.getElementById("operaciones3").checked = true;
        }

        if (actaInspeccion.BUENO == 1) {
            document.getElementById("customCheck1").checked = true;
        } else if (actaInspeccion.REGULAR == 1) {
            document.getElementById("customCheck1").checked = true;
        } else if (actaInspeccion.MALO == 1) {
            document.getElementById("customCheck1").checked = true;
        }

        if (actaInspeccion.DEX == 1) {
            document.getElementById("naturaleza1").checked = true;
        } else if (actaInspeccion.GUIA == 1) {
            document.getElementById("naturaleza2").checked = true;
        } else if (actaInspeccion.DI == 1) {
            document.getElementById("naturaleza3").checked = true;
        } else if (actaInspeccion.OTROS == 1) {
            $scope.cual = false;
            document.getElementById("naturaleza4").checked = true;
            document.getElementById("other").value = actaInspeccion.DESCRIPCION_OTROS;
        }
    }

    $scope.aprobacion = function () {
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            let actaInspeccion = WebexTeams.cosultaActaInspeccion($scope.cliente.NUMERO_INSPECCION, response.data.ipServices);
            actaInspeccion.then(function successCallback(inspeccion) {
                console.log(inspeccion.data.ID_USUARIOZF);
                if (inspeccion.data.ID_USUARIOZF == '(null)' || inspeccion.data.ID_USUARIOZF == null) {
                    $scope.AddActaInspeccion();
                } else {
                    $scope.formActa(inspeccion.data);
                    $scope.enviarActa();
                }
            }, function errorCallback(error) {
                console.log(error);
            });

        }, function errorCallback(error) {
            console.log(error);
        });
    }
    $scope.enviarActa = function () {
        var user = {
            token: $scope.access_token,
            toPersonEmail: $scope.cliente.USUARIO_WEBEXCONTACTO,
            inspeccion: $scope.cliente.NUMERO_INSPECCION
        }
        let ip = WebexTeams.Ip();
        ip.then(function successCallback(response) {
            let enviarActa = WebexTeams.enviarAprovacion(user, response.data.ipServices);
            enviarActa.then(function successCallback(response) {
                if (response.data) {
                    toastr.success(response.data, "Sistema Zona Franca");
                } else {
                    toastr.error("Problemas al enviar el acta", "Sistema Zona Franca");
                }
            }, function errorCallback(error) {
                console.log(error);
            });
        }, function errorCallback(error) {
            console.log(error);
        });

    }

    $scope.AddActaInspeccion = function () {

        if ($scope.operacion && $scope.naturaleza && $scope.valoracion &&
            $scope.numDocument && $scope.numForms && $scope.numBultos && $scope.weight) {
            var other = document.getElementById("other").required;
            if (other && $scope.other == null) { } else {
                var data = {}

                data.numero_inspeccion = $scope.cliente.NUMERO_INSPECCION;
                data.fecha = $scope.cliente.FECHA_HORAINSPECCION;
                data.id_usuariozf = $scope.id_usuariozf;
                if ($scope.operacion == 'Ingreso') {
                    data.ingreso = 1;
                    data.salidas = null;
                    data.inspeccion_fisica = null;
                } else if ($scope.operacion == 'Salidataa') {
                    data.ingreso = null;
                    data.salidas = 1;
                    data.inspeccion_fisica = null;
                } else if ($scope.operacion == 'Insp. física') {
                    data.ingreso = null;
                    data.salidas = null;
                    data.inspeccion_fisica = 1;
                }
                data.numeros_documentos = $scope.numDocument;
                if ($scope.naturaleza == 'DEX') {
                    data.dex = 1;
                    data.guia = null;
                    data.di = null;
                    data.otros = null;
                    data.descripcion_otros = null;
                } else if ($scope.naturaleza == 'GUIA') {
                    data.dex = null;
                    data.guia = 1;
                    data.di = null;
                    data.otros = null;
                    data.descripcion_otros = null;
                } else if ($scope.naturaleza == 'DI') {
                    data.dex = null;
                    data.guia = null;
                    data.di = 1;
                    data.otros = null;
                    data.descripcion_otros = null;
                } else if ($scope.naturaleza == 'Otros') {
                    data.dex = null;
                    data.guia = null;
                    data.di = null;
                    data.otros = 1;
                    data.descripcion_otros = $scope.other;
                }
                data.numeros_formularios = $scope.numForms;
                data.numero_bultos = $scope.numBultos;
                data.peso = $scope.weight;
                data.descripcion = $scope.description;
                if ($scope.valoracion == 'Bueno') {
                    data.bueno = 1;
                    data.regular = null;
                    data.malo = null;
                } else if ($scope.valoracion == 'Regular') {
                    data.bueno = null;
                    data.regular = 1;
                    data.malo = null;
                } else if ($scope.valoracion == 'Malo') {
                    data.bueno = null;
                    data.regular = null;
                    data.malo = 1;
                }
                data.cedula_usuariooperador = $scope.cliente.CEDULA_CONTACTO;
                data.nombre_usuariooperador = $scope.cliente.NOMBRE_CONTACTO;
                data.usuario_webexcontacto = $scope.cliente.USUARIO_WEBEXCONTACTO;

                data.nombre_usuariozf = $scope.username;
                data.cedula_usuariozf = $scope.cedula_usuariozf.trim();
                data.usuariowebexzf = $scope.gmailWebex;



                data.id_estadoacta = null;
                data.fecha_horaaprobacion = null;
                data.observaciones = $scope.observaciones;

                let ip = WebexTeams.Ip();
                ip.then(function successCallback(response) {
                    let actaInspeccion = WebexTeams.actaInspeccion(data, response.data.ipServices);
                    actaInspeccion.then(function successCallback(inspeccion) {
                        if (inspeccion.data == 1) {
                            $scope.enviarActa();
                            toastr.success("El acta se guardó correctamente", "Sistema Zona Franca");
                        } else {
                            toastr.error("Error con la base de datos", "Sistema Zona Franca");
                        }

                    }, function errorCallback(error) {
                        console.log(error);
                    });
                }, function errorCallback(error) {
                    console.log(error);
                });


            }
        }
    }

    function fechaServer() {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        var fecha = date + '/' + month + '/' + year;
        return fecha
    }


    // $scope.myFunction = function() {
    //     var elem = document.getElementById("test");
    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //     } else if (elem.mozRequestFullScreen) { /* Firefox */
    //         elem.mozRequestFullScreen();
    //     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    //         elem.webkitRequestFullscreen();
    //     } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //         elem.msRequestFullscreen();
    //     }
    // }


});