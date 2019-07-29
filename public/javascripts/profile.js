$(document).ready(function() {

    $("#signout").click(function() {

        $.get("/signout").done(function() { window.location.href = "../"; })

    });

});