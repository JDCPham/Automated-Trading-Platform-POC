var fs                  =   require('fs');

/* Reads a file asynchronously and executes callback. */
function read(path) { return JSON.parse(fs.readFileSync(path)); }

function write(path, data) {

    fs.writeFile(path, data, function(err) {

    });

}

function malcolmTimestampExists(array, timestamp) {

    var exists = false;

    array.responses.forEach(function(item) {
        
        let timestampA = item.current_position.updatedAt;
        let timestampB = timestamp;

        if (timestampA === timestampB) exists = true;

    });

    return exists;

}


function userExists(array, username) {

    var exists = false;

    array.users.forEach(function(item) {
        
        let userA = item.username;
        let userB = username;

        if (userA === userB) exists = true;

    });

    return exists;

}




module.exports = {

    read: read,
    write: write,
    malcolmTimestampExists: malcolmTimestampExists,
    userExists: userExists

}