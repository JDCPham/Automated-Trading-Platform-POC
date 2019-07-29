$(document).ready(function() {


    $(".plus").click(function() {
        var f = parseInt(/\d+/.exec($(".value").text())[0]);
        $(".value").text("£" + (f + 10));     
    })

    $(".minus").click(function() {
        var f = parseInt(/\d+/.exec($(".value").text())[0]);
        $(".value").text("£" + (f - 10));     
    })

});