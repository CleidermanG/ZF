$(document).ready(function () {
    $("#btn-der").click(function (e) {
        e.preventDefault();
        console.log($("#main-nav").attr('class'));

        // $("#left-nav").toggleClass("toggle");
        $("#main-nav").toggleClass("toggle-right");
        $("#right-nav").toggleClass("toggle");
    });
    $("#btn-izq").click(function (e) {
        e.preventDefault();
        console.log($("#main-nav").attr('class'));

        // $("#left-nav").toggleClass("toggle");
        $("#main-nav").toggleClass("toggle-left");
        $("#left-nav").toggleClass("toggle");
    });
});