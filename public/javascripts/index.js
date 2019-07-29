$(document).ready(function() {

    // Set Click Event Handler for Submit Button
    $("#formSubmit").click(function() {

        $("#formMessage").text("Loading, please wait.");

        // Get Username
        let username = $("#formUsername").val();
        let password = $("#formPassword").val();

        // Validate Fields
        if (username === "" && password === "") { 

            $("#formMessage").text("Enter a username and password.");
            $('#formUsername').css({'border': '1px solid red', 'background-color': '#ffedf1'});
            $('#formPassword').css({'border': '1px solid red', 'background-color': '#ffedf1'});
            return;

        }

        if (username === "") { 

            $("#formMessage").text("Enter a username.");
            $('#formUsername').css({'border': '1px solid red', 'background-color': '#ffedf1'});
            $('#formPassword').css({'border': '1px solid black', 'background-color': '#fff'});
            return;

        }

        if (password === "") { 

            $("#formMessage").text("Enter a password.");
            $('#formUsername').css({'border': '1px solid black', 'background-color': '#fff'});
            $('#formPassword').css({'border': '1px solid red', 'background-color': '#ffedf1'});
            return;

        }

        // Post Request
        $.post("/login", { username: username, password: password }, function(data) {

            if (data.status === "authenticated") {

                var randomPassword;
                var demoUsername;
                var demoID;
                var email;

                data.attributes.forEach(function(item) {

                    if (item.Name === "custom:rand_password") randomPassword = item.Value;
                    else if (item.Name === "custom:demo_username") demoUsername = item.Value;
                    else if (item.Name === "custom:demo_account_id") demoID = item.Value;
                    else if (item.Name === "email") email = item.Value;

                });

                $.redirect('./profile', {

                    'demoUsername': demoUsername,
                    'demoID': demoID,
                    'randomPassword': randomPassword,
                    'email': email,
                    'accessToken': data.access_token,
                    'idToken': data.id_token,
                    'refreshToken': data.refresh_token

                });
                
            } else {

                $("#formMessage").text(data.err);

            }

        });



    });

    
});