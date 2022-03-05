const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../mongo")

const service = {
    async register (req , res){
        try{
            const data = await db.loginData.findOne({email: req.body.email})
            if(data){
                return res.send("email already registered")
            }else{
                const salt = await bcrypt.genSalt()
                req.body.password = await bcrypt.hash(req.body.password , salt)
                await db.loginData.insertOne({...req.body})
                res.send({message : "Registered successfully"})
            }
        }catch(error){
            console.log(error)
        }
    },

    async login (req , res){
        try{
            const user = await db.loginData.findOne({email: req.body.email})
            if (!user){
                return res.send({message : "enter valid email id"})
            }
            else{
                const isValid = await bcrypt.compare(req.body.password , user.password)
                if(isValid){
                    const authToken = jwt.sign({user_id : user._id , email: user.email} , "admin123" ,{expiresIn :"24h"})
                    // console.log(authToken)
                    return res.send({authToken , message: "Logged In Successfully" , name : user.name,
                email: user.email , id : user._id})
                }else{
                    res.send({message : "wrong password"})
                }
             }
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = service;