app.controller('myCtrlMapa', function ($scope, ChatWebex, WebexTeams) {


    $scope.localizacion = function () {

        var latitud = 4.67181;
        var longitud = -74.1552271;
        // alert(latitud + ' ' + longitud)

        //Generamos el mapa que muestre y cual será el punto central
        var map = new google.maps.Map(document.getElementById('Mapa'), {
            center: {
                lat: latitud,
                lng: longitud
            },
            zoom: 14
        });

        //Generamos el marcadores para señalar una posición
        var markerMiPosicion = new google.maps.Marker({
            position: {
                lat: latitud,
                lng: longitud
            },
            title: "Ubicación usario operador"
        });


        // Mostramos los marcadores en el mapa.
        markerMiPosicion.setMap(map);
    }

    $scope.inicio = function () {
        // En caso de no poder geolocalizar hay que tener un mensaje de error (o acción)
        function error() {
            alert('No se puede obtener tu ubicación actual')
            // un error a valorar es que el usuario no permite la geoloc, code:1
        }
        if (navigator.geolocation) {
            //Caso SI soporta geolocalización. Ejecuto la API y llamo a mis funciones.
            navigator.geolocation.getCurrentPosition($scope.localizacion, error);
        } else {
            //Caso NO soporta geolocalización
            alert('Navegador NO soporta geolocalización');
        }
    }



    $scope.y = function () {
        alert('Opción en desarrollo')
    }


    $scope.x = function () {
        alert('Opción en desarrollo')
    }








});