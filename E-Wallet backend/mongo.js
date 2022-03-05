
const{MongoClient} = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);

module.exports = {
    db : null,
    money_data : null,
    loginData : null,
    async connect(){
        await client.connect()
        console.log("connected to -" , process.env.MONGODB_URL);
        this.db = client.db(process.env.MONGODB_NAME);
        console.log("selected dataBase-" , process.env.MONGODB_NAME)

        this.money_data = this.db.collection("money_data")
        this.loginData = this.db.collection("loginData")
    }
}