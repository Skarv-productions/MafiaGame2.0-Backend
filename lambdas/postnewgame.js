const AWS = require("aws-sdk")
AWS.config.update({region: "eu-west-1"})

exports.handler = (event) => {
    const ddb = new AWS.DynamoDB.DocumentClient();
    console.log("This is the gameID recieved from client: ",event.code)
    
    const paramsGetItem = {
        "Key": {
            "gameID": event.code
        },
        "TableName": "games"
    }
    const paramsPutItem = {
        "Item": {
            "gameID": event.code,
            "playerList": [
                    event.playerList[0]
                ]
        },
        "TableName": "games"
    }
    
    function createNewGameInDB (){
        ddb.put(paramsPutItem, (err, data) => {
            if(err !== null) {
                console.log("There was an error, couldn't create new game", err)
            }
        });
    };

    const checkIfGameIDExistInDB = new Promise((resolve, reject) => {
        ddb.get(paramsGetItem, (err, data) => {
            if(data.Item) {
                resolve (true)
            } else {
                resolve (false)
            }
        })
    })
    
    return checkIfGameIDExistInDB
        .then(result => {
         if(result) {
            console.log("Not going to create a new game")
            return {statusCode: 400}
            
        } else {
            console.log("Going to create a new game")
            createNewGameInDB()
            return {statusCode: 201}
        }  
        }).then((statusCode) => {
            return statusCode
        })
    

    
    
};