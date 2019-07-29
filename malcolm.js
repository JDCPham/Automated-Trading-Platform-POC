/* Module Imports */
var cron                =   require('node-cron');
var request             =   require('request');
var requestPromise      =   require('request-promise');
var path                =   require('path');
var fs                  =   require('fs');
var config              =   require('./config.js');
var json                =   require('./json.js');
var action              =   require('./action.js');

/* Scheduled Function */
cron.schedule("*/15 * * * * *", function() {

    // 1. Prepare POST method to retrieve token for Malcolm.
    var MalcolmAuthenticationOptions = config.MalcolmAuthenticationOptions;

    // 2. Prepare GET method to retrieve data from Malcolm. Requires token to be added later.
    var MalcolmDataOptions = config.MalcolmDataOptions();

    // 3. Make POST request to get token for Malcolm.
    requestPromise(MalcolmAuthenticationOptions).then(function(MalcolmAuthenticationResponse) {
        
        // 3.1 Set Token in Malcolm Data Options Object.
        MalcolmDataOptions.headers.Authorization = MalcolmAuthenticationResponse.AuthenticationResult.IdToken;
        
        // 4. Make GET request to retrieve data from Malcolm.
        return requestPromise(MalcolmDataOptions);

    }).then(function(MalcolmDataResponse) {

        // 5. Parse and filter data from Malcolm.
        MalcolmDataResponse = JSON.parse(JSON.parse(MalcolmDataResponse).body);

        // 6. Read and store Malcolm.JSON file.
        var malcolm = json.read('./data/malcolm.json');

        // 7. Check if data exists (timestamp check).
        var exists = json.malcolmTimestampExists(malcolm, MalcolmDataResponse.current_position.updatedAt);

        if (!exists) {

            // 8. Write data if necessary.
            malcolm.responses.push(MalcolmDataResponse);

            // 9. Write to file if necessary.
            json.write('./data/malcolm.json', JSON.stringify(malcolm, null, 3));

        }

        action.test(malcolm);
    
    });

});




