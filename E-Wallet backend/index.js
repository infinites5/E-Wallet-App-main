
require("dotenv").config();
const express = require("express");

const app = express();
const db = require ("./mongo")
const services = require ("./services/money_data_service")
const cors = require ("cors")
const jwt = require("jsonwebtoken");
const loginService = require ("./services/loginService")
const forgetService = require("./services/forgetPass")

async function connection(){

    //connect to database
    await db.connect();

    //allow cors to everyone
    app.use(cors());

    //convert your json data into browser understandable json data
    app.use(express.json())

    // login data
    app.post("/user/register" , loginService.register)

    app.post("/user/login" , loginService.login)

    // forget password

    app.put("/reset" ,forgetService.reset )

    app.put("/updatePassword" , forgetService.updatePassword )



    // authorization middleware
    app.use((req , res , next)=>{
        const token = req.headers ["auth-token"];
       
        if(token){
            try{
                req.user = jwt.verify(token , "admin123")
               
                next()
            }catch(error){
                res.sendStatus(500);
            }   
        }else{
            res.sendStatus(401)
        }

    })
    


    //all the methods with necessary routes
    app.get("/money_data" , services.money_data)

    // gettin the data
    app.post("/data" , services.data);

    // updating income of a particular user 
    app.put("/update_income/:id" , services.update_income)

    //adding expenditure to a particular user
    app.put("/add_exp/:id" , services.add_exp)

    // updating the expenditure
    app.put("/update_exp/:id/:exp_id" , services.update_exp)

    // deleting a particular expenditure
    app.put("/remove/:id/:exp_id", services.remove)
    
    //running the application
    app.listen(process.env.port , ()=>{
        console.log(`suraj your server is connected to ${process.env.port}`)
    })
}
connection();










