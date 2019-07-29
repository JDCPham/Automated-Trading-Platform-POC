const AmazonCognitoIdentity =   require('amazon-cognito-identity-js');

/* Cognito configuration */
var CognitoPoolData = {    

    UserPoolId      :   "ap-southeast-1_IaTshcu4G",  
    ClientId        :   "1l5t85kff961rmpvtijmheu44p" 

};

var UserPool = new AmazonCognitoIdentity.CognitoUserPool(CognitoPoolData);



/* Returns token for Malcolm */
var MalcolmAuthenticationOptions = {

    method          :   `POST`,
    url             :   `https://cognito-idp.us-east-2.amazonaws.com/`,
    headers         :   {
        'Content-Type'      :   'application/x-amz-json-1.1',
        'X-Amz-Target'      :   'AWSCognitoIdentityProviderService.InitiateAuth'
    },

    json            :   true,
    body            :   {

        "AuthParameters" : {
            "USERNAME"      :   "james.li+awsCognitoTest@finatext.com",
            "PASSWORD"      :   "Perm123!"
        },

        "AuthFlow"      :   "USER_PASSWORD_AUTH",
        "ClientId"      :   "45h4lmvcf84qk7olnd8ev8th57",
        "UserPoolId"    :   "us-east-2_vJcxD38wb"
    }

}



/* Returns data from Malcolm */
function MalcolmDataOptions(token) {

    return {

        url             :   `https://nc0sstu5vj.execute-api.us-east-2.amazonaws.com/prod/ssitradestrat/`,
        headers         :   {

            'Authorization' : token

        }

    };


}



/* Returns Balance of a given Demo ID */
function STARBalanceOptions(demoID) {
    
    return {

        url: `https://mapiuat010.sfs-uat.com/api/ClientAccount/${demoID}/Resources`,
        
        headers: {

          'X-API-Version': 'v001',
          'Authorization': 'ApiKey FqWN7Xyq/5zbNwm9oAFHCDb/+qBxFSr2GPKeSVzORgEDUTd2PxnOpOlu+/PQM8Lb'
        
        },

    };

}




/* Gets Token for PAPI */
function PAPITokenOptions(username, password) {
    return { 
        method: 'POST',
        url: 'https://papiuat010.sfs-uat.com/api/Authentication',
        headers: { 
            'Postman-Token': '5b2503de-82c2-4284-9ae6-8645039aa051',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'X-API-Version': 'v001'
        },
        body: {
            AccountOperatorKey: '1',
            Username: username,
            Password: password 
        },
        
        json: true
    }
}


/* Gets List of Open Trades from PAPI */
function PAPITradeOptions(token, demoID) {
    return {
        method: 'GET',
        url: 'https://papiuat010.sfs-uat.com/api/Trades',
        headers: {
            'cache-control': 'no-cache',
            'X-API-ProductType': 'SpotFX',
            Authorization: 'Broker ' + token,
            'Content-Type': 'application/json',
            'X-API-Version': 'v001',
            'X-API-TradingAccountKey': demoID 
        }
    };
}


module.exports = {

    // Cognito
    UserPool: UserPool,
    CognitoPoolData: CognitoPoolData,

    // Malcolm
    MalcolmAuthenticationOptions: MalcolmAuthenticationOptions,
    MalcolmDataOptions: MalcolmDataOptions,

    // STAR
    STARBalanceOptions: STARBalanceOptions,

    // PAPI
    PAPITokenOptions: PAPITokenOptions,
    PAPITradeOptions: PAPITradeOptions

}