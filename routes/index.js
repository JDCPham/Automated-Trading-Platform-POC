/* Module Imports */
var express       =   require('express');
var router        =   express.Router();
var fs            =   require('fs')
var path          =   require('path');
var config        =   require('../config.js');
var ACI           =   require('amazon-cognito-identity-js');
var requestPromise=   require('request-promise');
var json          =   require('../json.js');
global.fetch      =   require('node-fetch');

/* Custom variables */
var cognitoUser;

/* Static File Imports */
var static        =   require('../static');


/* GET Malcolm Data File. */
router.get('/malcolm', function(req, res, next) {

  return json.read('../malcolm.json');

});


/* GET Dashboard. */
router.get('/dashboard', function(req, res, next) {

  res.render('dashboard', { 

    metadata    :   static.metadata,
    scripts     :   static.scripts,
    stylesheets :   static.stylesheets,
    prepath     :   '',
    subtitle    :   'Dashboard'

  });

});

/* GET Dashboard. */
router.get('/dashboard2', function(req, res, next) {

  res.render('dashboard2', { 

    metadata    :   static.metadata,
    scripts     :   static.scripts,
    stylesheets :   static.stylesheets,
    prepath     :   '',
    subtitle    :   'Dashboard'

  });

});

/* POST Login and Authentication */
router.post('/login', function(req, res, next) {

  let username = req.body.username;
  let password = req.body.password;

  var authenticationDetails = new ACI.AuthenticationDetails({ Username : username, Password : password });

  var userData = { Username: username, Pool: config.UserPool };

  cognitoUser = new ACI.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {

    onSuccess: function (result) {

      cognitoUser.getUserAttributes(function(err, attributes) {
      
        res.json({

          'status'        : "authenticated",
          'attributes'    : attributes,
          'access_token'  : result.getAccessToken().getJwtToken(),
          'id_token'      : result.getIdToken().getJwtToken(),
          'refresh_token' : result.getRefreshToken().getToken()

        });

      });

    },

    onFailure: function(err) {

      res.json({

        'status'  : "denied",
        'err'     : err.message

      });
    }

  });
  
});


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { 

    metadata    :   static.metadata,
    scripts     :   static.scripts,
    stylesheets :   static.stylesheets,
    prepath     :   '',
    subtitle    :   'Home'

  });

});


/* GET signout. */
router.get('/signout', function(req, res, next) {

  if (cognitoUser != undefined) cognitoUser.signOut();
  res.send();

});



/* GET profile page. */
router.get('/profile', function(req, res, next) { loadProfile(req, res); });


/* POST profile page. */
router.post('/profile', function(req, res, next) { loadProfile(req, res); });



function loadProfile(req, res) {

  let demoUsername = req.body.demoUsername;
  let demoID = req.body.demoID;
  let randomPassword = req.body.randomPassword;
  let email = req.body.email;
  let exists = false;

  var users = json.read('./data/users.json');
  var log = json.read('./data/log.json');
  var malcolm = json.read('./data/malcolm.json');

  users.users.forEach(function(user) { 

    if (user.userID == demoID) {
      exists = true;
      return; 
    }

  });

  if (cognitoUser === undefined || cognitoUser === null) {

    error(res);
    return;

  }

  // Check User Session
  cognitoUser.getSession(function(err, session) {

    if (err) {

      error(res);
      return;

    }

    if (!session.isValid()) {

      error(res);
      return;

    }

    if (!exists) {

      users.users.push({
        "email": email,
        "username": demoUsername,
        "randomPassword": randomPassword,
        "userID": parseInt(demoID)
      });

      log[demoID] = [];
  
      json.write('./data/users.json', JSON.stringify(users, null, 3));
      json.write('./data/log.json', JSON.stringify(log, null, 3));
  
    }

    // Get Balance of given user ID.
    var STARBalanceOptions = config.STARBalanceOptions(demoID);

    var STARBalance;

    // Make GET request to get balance of user.
    requestPromise(STARBalanceOptions).then(function(STARBalanceResponse) {

      STARBalance = JSON.parse(STARBalanceResponse).Content.AvailableBalance;

      var PAPITokenOptions = config.PAPITokenOptions(demoUsername, randomPassword);

      return requestPromise(PAPITokenOptions);

    }).then(function(PAPITokenResponse) {

      var PAPITradeOptions = config.PAPITradeOptions(PAPITokenResponse.Content.Authentication.Token, demoID);

      return requestPromise(PAPITradeOptions);

    }).then(function(PAPITradeResponse) {

      tradesOpen = JSON.parse(PAPITradeResponse);

      res.render('profile', { 

        metadata    :   static.metadata,
        scripts     :   static.scripts,
        stylesheets :   static.stylesheets,
        demoUsername:   demoUsername,
        demoID      :   demoID,
        randomPassword: randomPassword,
        email       :   email,
        trades      :   tradesOpen,
        balance     :   STARBalance,
        prepath     :   '',
        malcolm     :   malcolm.responses.reverse(),
        log         :   log[demoID].reverse(),
        subtitle    :   'Profile'
    
      });

    });

  });
  

}





function error(res) {

  res.render('redirect', { 

    react       :   static.react,
    metadata    :   static.metadata,
    scripts     :   static.scripts,
    stylesheets :   static.stylesheets,
    assets      :   static.assets,
    prepath     :   '',
    subtitle    :   'Error'

  });

}

module.exports = router;
