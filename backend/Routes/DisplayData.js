const express = require('express');
const routerDisplay = express.Router();

routerDisplay.post('/foodData',(req,res)=>{
    try {
        res.send([global.food_item,global.foodCatagory2])
    } catch (error) {
        console.error(error.message);
    res.send("server error")    }
})

module.exports = routerDisplay;