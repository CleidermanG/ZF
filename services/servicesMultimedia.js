app.service('servicesMultimedia', function($http, Upload, $sce, $localStorage) {

    this.saveVideo = function(inspeccion, file, url) {
        return Upload.upload({
            url: url + '/api/video',
            data: {
                inspeccion: inspeccion,
                file: file
            }
        });
    };
    this.saveScreenshot = function(inspeccion, file, url) {
        return Upload.upload({
            url: url + '/api/image',
            data: {
                inspeccion: inspeccion,
                file: file
            }
        });
    };
    this.loadScreen = function(inspeccion, url) {
        return $http({
            method: 'GET',
            url: url + '/api/image',
            header: { 'Content-Type': 'application/json; charset-utf-8' },
            params: { inspeccion: inspeccion }
        });
    };


    this.loadVideos = function(inspeccion, url) {
        return $http({
            method: 'GET',
            url: url + '/api/videos',
            header: { 'Content-Type': 'application/json; charset-utf-8' },
            params: { inspeccion: inspeccion }
        });
    };

    this.deleteFile = function(file, url) {
        return $http.post(url + '/api/eliminar', JSON.stringify(file));
    };
});