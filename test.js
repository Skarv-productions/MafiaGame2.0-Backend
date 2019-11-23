const checkIfGameIDExistInDB = new Promise((resolve, reject) => {
    ddb.get(paramsGetItem, (err, data) => {
        if(data.Item) {
            resolve (true)
        } else {
            resolve (false)
        }
    })
})

console.log(checkIfGameIDExistInDB);