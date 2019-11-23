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

    const createNewGameInDB = new Promise((resolve, reject) => {
        ddb.put(paramsPutItem, (err, data) => {});
    });

    const checkIfGameIDExistInDB = new Promise((resolve, reject) => {
        ddb.get(paramsGetItem, (err, data) => {
            if(data.Item) {
                reject()
            } else {
                resolve()
            }
        })
    })
    
    const postNewGame = async() => {
        try {
            await checkIfGameIDExistInDB();
            await createNewGameInDB();
            return {statusCode: 201}
        } catch (err) {
            return {statusCode: 400, error: err}
        }
    }

    

    
    
};