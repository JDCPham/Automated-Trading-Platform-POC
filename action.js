var cron                =   require('node-cron');
var request             =   require('request');
var requestPromise      =   require('request-promise');
var path                =   require('path');
var fs                  =   require('fs');
var config              =   require('./config.js');
var json                =   require('./json.js');

function test(malcolm) {
  
    // 1. Read and store users.json file
    var users = json.read('./data/users.json');

    // 2. For each user, do the following
    users.users.forEach(function(user){

        console.log("Updated user " + user.userID); 

        var tradesOpen;
        var balance;
        var buy;

        // 3. Prepare GET method to retrieve token for PAPI.
        var PAPITokenOptions = config.PAPITokenOptions(user.username, user.randomPassword);

        // 4. Get PAPI Token
        requestPromise(PAPITokenOptions).then(function(PAPITokenResponse) {     
        
            var PAPITradeOptions = config.PAPITradeOptions(PAPITokenResponse.Content.Authentication.Token, user.userID);

            return requestPromise(PAPITradeOptions);

        // 5. Current Open Trades 
        }).then(function(PAPITradeResponse) {

            tradesOpen = JSON.parse(PAPITradeResponse).length;
            buy = true;
            
            // Get Balance of given user ID.
            var STARBalanceOptions = config.STARBalanceOptions(user.userID);

            // Make GET request to get balance of user.
            return requestPromise(STARBalanceOptions);

        }).then(function(STARBalanceResponse) {
            
            balance = JSON.parse(STARBalanceResponse).Content.AvailableBalance;

            // Read action log for user
            var log = json.read('./data/log.json')[user.userID];
           
            // Check if latest action has been taken
            if (log.length >= 1) {
      
                var lastSignalFromMalcolm = malcolm.responses[malcolm.responses.length - 1].current_position.updatedAt;
                var lastActionForUser = log[log.length - 1].updatedAt;
                if (lastSignalFromMalcolm === lastActionForUser) {} 
                else executeAction(malcolm.responses[malcolm.responses.length - 1].current_position, balance, tradesOpen, buy, user.userID);

            } else {
           
                executeAction(malcolm.responses[malcolm.responses.length - 1].current_position, balance, tradesOpen, buy, user.userID);
            }

        }).catch(function(err) {
            console.log("*An error occured.")
            console.log(err);
        })


    });

}


function executeAction(signal, balance, tradesOpen, buy, userID) {

    var signalPosition = signal.tradeStatus;
    var logPacket;

    if (signalPosition === "No position") {

        if (tradesOpen >= 1) {

            logPacket = {
                "updatedAt": signal.updatedAt,
                "title": "Closed open BTC/USD trade.",
                "description": "No Position signal from Malcolm indicates trades should close if not already.",
                "currency": "BTC/USD",
                "tradeStatus": "No position",
                "openTrades": tradesOpen,
                "balance": balance
            }

        } else {

            logPacket = {
                "updatedAt": signal.updatedAt,
                "title": "No Action",
                "description": "No signals indicated from Malcolm.",
                "currency": "BTC/USD",
                "tradeStatus": "No position",
                "openTrades": tradesOpen,
                "balance": balance
            }

        }

    } else if (signalPosition === "Trade opened") {

        if (tradesOpen <= 0) {

            if (signal.longShort === "short") {

                logPacket = {
                    "updatedAt": signal.updatedAt,
                    "title": "Opened Sell BTC/USD trade.",
                    "description": "Entry Price: " + signal.entryPrice + ", set stoploss to " + signal.stopLevel,
                    "currency": "BTC/USD",
                    "tradeStatus": "Trade opened",
                    "openTrades": tradesOpen,
                    "balance": balance
                }

            } else {

                logPacket = {
                    "updatedAt": signal.updatedAt,
                    "title": "Opened Buy BTC/USD trade.",
                    "description": "Entry Price: " + signal.entryPrice + ", set stoploss to " + signal.stopLevel,
                    "currency": "BTC/USD",
                    "tradeStatus": "Trade opened",
                    "openTrades": tradesOpen,
                    "balance": balance
                }

            }

        } else {

            logPacket = {
                "updatedAt": signal.updatedAt,
                "title": "Closed previous trade and opened new BTC/USD trade",
                "description": "Logic here not clear, ignore.",
                "currency": "BTC/USD",
                "tradeStatus": "Trade opened",
                "openTrades": tradesOpen,
                "balance": balance
            }

        }

    } else if (signalPosition === "hold") {

        if (tradesOpen >= 1) {

            logPacket = {
                "updatedAt": signal.updatedAt,
                "title": "Changed stoploss on current open BTC/USD trade.",
                "description": "Stoploss now set at " + signal.stopLevel,
                "currency": "BTC/USD",
                "tradeStatus": "hold",
                "openTrades": tradesOpen,
                "balance": balance
            }

        } else {

            logPacket = {
                "updatedAt": signal.updatedAt,
                "title": "Stoploss trigger detected on STAR server.",
                "description": "No action will be taken until next Open Trade signal",
                "currency": "BTC/USD",
                "tradeStatus": "hold",
                "openTrades": tradesOpen,
                "balance": balance
            }

        }

    } else {

        logPacket = {
            "updatedAt": signal.updatedAt,
            "title": "Unrecognised case",
            "description": "Unrecognised case",
            "currency": "BTC/USD",
            "tradeStatus": "Unknown",
            "openTrades": tradesOpen,
            "balance": balance
        }

    }

    var log = json.read('./data/log.json');
    log[userID].push(logPacket);

    if (log != null) json.write('./data/log.json', JSON.stringify(log, null, 3));
}

module.exports = {
    test: test
}