const {MongoClient,ServerApiVersion} = require("mongodb");
const dotenv = require('dotenv')

dotenv.config()



const client = new MongoClient(process.env.MONGO_URI,{
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    }
  })


module.exports = client;