$(document).ready(function () {
    $("#btn-der").click(function (e) {
        e.preventDefault();
        console.log('der');
        
        $("#sidebar-wrapper").toggleClass("toggle-right");
        $("#page-content-wrapper").toggleClass("toggle-right");
    });
    $("#btn-izq").click(function (e) {
        e.preventDefault();
        console.log('izq');

        $("#left-sidebar-wrapper").toggleClass("toggle-left");
        $("#page-content-wrapper").toggleClass("toggle-left");
    });
});