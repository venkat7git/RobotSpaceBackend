const client = require("../connection/db")

let userDb = null;
async function run() {
    try{
        const database = client.db('user_management')
        userDb = database.collection('users')
        
        console.log("user connected")
    }catch(e){
        console.log(e)
    }
}

run()

module.exports = userDb