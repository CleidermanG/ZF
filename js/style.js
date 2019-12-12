$(document).ready(function () {
    $("#btn-der").click(function (e) {
        e.preventDefault();

        $("#sidebar-wrapper").toggleClass("toggle-right");
        $("#page-content-wrapper").toggleClass("toggle-right");
    });
    $("#btn-izq").click(function (e) {
        e.preventDefault();

        $("#left-sidebar-wrapper").toggleClass("toggle-left");
        $("#page-content-wrapper").toggleClass("toggle-left");
    });
    $("#modificar-tab").click(function (e) {
        e.preventDefault();

        if ($("#sidebar-wrapper").attr("class")) {

            $("message-input").toggleClass("toggle-right");
            $("#sidebar-wrapper").toggleClass("toggle-right");
            $("#page-content-wrapper").toggleClass("toggle-right");
        }

    });
    $("#chat-tab").click(function (e) {
        e.preventDefault();
        if ($("#sidebar-wrapper").attr("class")) {
            $("#sidebar-wrapper").toggleClass("toggle-right");
            $("#page-content-wrapper").toggleClass("toggle-right");
        }

    });
    $("#check-tab").click(function (e) {
        e.preventDefault();
        if ($("#sidebar-wrapper").attr("class")) {
            $("#sidebar-wrapper").toggleClass("toggle-right");
            $("#page-content-wrapper").toggleClass("toggle-right");
        }

    });
    $("#observacion-tab").click(function (e) {
        e.preventDefault();
        if ($("#sidebar-wrapper").attr("class")) {
            $("#sidebar-wrapper").toggleClass("toggle-right");
            $("#page-content-wrapper").toggleClass("toggle-right");
        }
    });
});