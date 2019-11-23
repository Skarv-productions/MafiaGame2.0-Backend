const AWS = require("aws-sdk")
AWS.config.update({region: "eu-west-1"})

exports.handler = async (event) => {
    const ddb = new AWS.DynamoDB.DocumentClient();
    console.log("This is the gameID recieved from client: ",event.code)

    var playerList = [];

    const paramsGetItem = {
        "Key": {
            "gameID": event.code
        },
        "TableName": "games"
    }
    const paramsPutItem = {
        "Item": {
            "gameID": event.code,
            "playerList": playerList
        },
        "TableName": "games"
    }

    const checkIfGameIDExistInDB = new Promise((resolve, reject) => {
        ddb.get(paramsGetItem, (err, data) => {
            if(!data.Item) {
                resolve(null)
            } else {
                console.log("This is data from ddb.get", data);
                
                resolve(data)
            }
        })
    })

    function addPlayerToPlayerList () {
         ddb.put(paramsPutItem, (err, data) => {
        })
    };

    return checkIfGameIDExistInDB
        .then(response => {
            if (response == null) {
                return {statusCode: 208, err: "Game doesn't exist."}
            } else {
                const playerAlreadyExists = response.Item.playerList.find(player => player.name.toUpperCase() == event.name.toUpperCase());
                if (playerAlreadyExists) {
                    console.log("Inside PlayerAlreadyExists true")
                    return {statusCode:208, err: "Playername already exists."}
                } else {
                    console.log("Inside PlayerAlreadyExists false")
                    paramsPutItem.Item.playerList = response.Item.playerList.map(p => p)
                    paramsPutItem.Item.playerList.push({name: event.name, admin: false, alive: true})
                    console.log("This is the playerlist: ", paramsPutItem.Item.playerList);
                }
            }
        })
        .then(evStatusCode => {
            if (evStatusCode) {
                return evStatusCode
            } else {
                console.log("Going to run addPlayerToPlayerList")
                addPlayerToPlayerList();
                return {statusCode: 201, playerList: paramsPutItem.Item.playerList }
            }
        })


    // getItem om gameID finns, om den finns ta alla namn i playerList och gå vidare, annars throw errorstatus tillbaka i response
    // Titta om namn event.name finns i playerList, om inte putItem nya playern i playerList samt skicka tillbaka hela playerList. Annars skicka name error status
};
