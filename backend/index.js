const express = require('express')
const app = express()
const port = 5000
const mongodb = require('./db.js')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./Routes/CreateUser.js')
const routerDisplay = require("./Routes/DisplayData.js")


mongoose.Promise = global.Promise;
(async () => {
  try {
    await mongoose.connect(mongodb.DB, { useNewUrlParser: true });
    console.log('Database is connected');

    const fetched_Data = mongoose.connection.db.collection("food_item");
    const data = await fetched_Data.find({}).toArray( function(err,data){
      if(err)return err;
      else{
        return console.log(data);;
      }
    })

    const foodCategory =  mongoose.connection.db.collection("foodCatagory");
    const data2 = await foodCategory.find({}).toArray( function(err,data){
      if(err)return err;
      else{
        return console.log(data);;
      }
    })
    global.food_item = data;
    global.foodCatagory2 = data2;
  } catch (err) {
    console.log('Cannot connect to the database: ' + err);
  }
})();


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',router);
app.use('/api',routerDisplay);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})