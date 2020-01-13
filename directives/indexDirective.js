app.directive('indexDirective', function() {
    return {
        templateUrl: function() {
            return '../views/empresa.html';
        }
    };
});

app.directive('indexDirectiveChat', function() {
    return {
        templateUrl: function() {
            return '../views/chat.html';
        },
        controller: "myCtrlChat"
    };

});

app.directive('indexDirectiveObservaciones', function() {
    return {
        templateUrl: function() {
            return '../views/observaciones.html';
        },
        controller: "myCtrlObservaciones"
    };

});

app.directive('indexDirectiveActa', function() {
    return {
        templateUrl: function() {
            return '../views/acta.html';
        },
        controller: "myCtrlActa"
    };

});

app.directive('indexDirectiveMapa', function() {
    return {
        templateUrl: function() {
            return '../views/test.html';
        },
        controller: "myCtrlMapa"
    };

});