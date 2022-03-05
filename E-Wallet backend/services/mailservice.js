
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const db = require("../mongo")


const mail = {
    
    async mailer (value){
        crypto.randomBytes(32 ,async(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const emailToken = buffer.toString("hex")
            const userEmail = await db.loginData.findOne({email : value.email})
            if(userEmail){
               db.loginData.updateOne({email : value.email},{$set:{verifyToken : emailToken }})
               //mail id from where the mail will be send to the user
               let transporter = nodemailer.createTransport({
                   service:"gmail",
                   auth:{
                       user:"surajpatil131297@gmail.com",
                       pass: "8605587104"
                   }
               });
               //body to be present in the mail
               let mailOptions ={
                   from : "surajpatil131297@gmail.com",
                   to:value.email,
                   subject : "reset your password",
                   html : `
                   <p>click the <a href="http://localhost:3000/verifyEmail/${emailToken}">link</a> to verify account</p>
                   <p>valid for 24 hrs only</p>
                   `
    
               };

               //sending back response to check mail to the user
               transporter.sendMail(mailOptions , function(error , info){
                   if(error){
                       console.log(error);
                   }else{
                       console.log("email sent :" + info.response)
                       res.send({message :"check your mail"})
                   }
               });
            }else{
                res.send({message : "Enter valid mail"})
            }
        })
    }
}

module.exports = mail