const { ObjectId } = require("bson");
const db = require("../mongo");

const services = {
    
//get initial data
  async money_data(req, res) {
    try {
      const response = await db.money_data.find({userId:req.user.user_id}).toArray();
      // console.log(response)
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },

//add a data to database tracking all your daily incomes and expenditure
  async data(req, res) {

    // convertin the date in dd/mm/yyyy form
    let today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth() + 1); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    try {
      const response = await db.money_data.findOne({date:req.body.date , userId:req.user.user_id})
      if(response){
        res.send(response)
      }else if(req.body.date === today){
        const { insertedId: _id } = await db.money_data.insertOne({...req.body , userId:req.user.user_id});
        res.status(200).send({ ...req.body, _id , userId:req.user.user_id });
        // console.log(new Date())
      }else{
        res.send({ ...req.body})
        // console.log(today)
      }
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },


//add money into your daily income  
  async update_income(req, res) {
    try {
      const response = await db.money_data.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { income: req.body.income } },
        { returnDocument: "after" }
      );
      res.status(200).send(response.value);
      // console.log(response.value);
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },



//add your daily expenditure
  async add_exp(req, res) {
    try {
      const response = await db.money_data.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $push: { expenditure: { ...req.body, _id: new ObjectId() } } },
        { returnDocument: "after" }
      );
      res.status(200).send(response.value);
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },


// edit you expenditure for a day whenever needed
//first get the day for which you want to change the expenditure 
//with help of _id and by using resp. expenditure id update the data
  async update_exp(req, res) {
    try {
      const response = await db.money_data.findOneAndUpdate(
        {
          _id: ObjectId(req.params.id),
          "expenditure._id": ObjectId(req.params.exp_id),
        },
        {
          $set: {
            "expenditure.$.title": req.body.title,
            "expenditure.$.amount": req.body.amount,
          },
        },
        { returnDocument: "after" }
      );
      res.status(200).send(response.value);
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },

  
//delete a expenditure from the data
//delete any expenditure from your wallet by using its id and $pull
  async remove(req, res) {
    try {
      const response = await db.money_data.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $pull: { expenditure: { _id: ObjectId(req.params.exp_id) } } },
        { returnDocument: "after" }
      );
      res.send(response.value);
      // console.log(response.value)
    } catch (err) {
      res.status(500).send("something went wrong");
    }
  },
};

module.exports = services;
