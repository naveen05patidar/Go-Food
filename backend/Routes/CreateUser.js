const express = require ('express');
const router = express.Router();
const User = require('./../models/User.js'); 
const { body, validationResult }=require('express-validator');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');

 const jswSecret = "MynameisNaveenPatidarDewasMP1$#"

router.post('/createuser',[
    body('email','Incorrect Email').isEmail(),
    body('name').isLength({min:5}),
    body('password','Incorrect Password').isLength({min:5})
    ] , async (req,res)=>{
    console.log('req: ', req.body);

const salt = await bcrypt.genSalt(10);
let secPassword = await bcrypt.hash(req.body.password,salt)



try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({errors:errors.array()});
    }
    await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPassword,
        location:req.body.location,
    }).then(res.json({success:true}))
} catch (error) {
    console.log(error);
    res.json({success:false})

}
})

router.post('/loginuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }).withMessage('Incorrect Password')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
  
    const email = req.body.email;
    try {
      const userdata = await User.findOne({ email });
      if (!userdata) {
        return res.status(400).json({ errors: "Incorrect Credential" });
      }
      const pwdCompare = await bcrypt.compare(req.body.password,userdata.password)
      if (!pwdCompare) {
        return res.status(400).json({ errors: "Incorrect Credential" });
      }
      const data = {
        user:{
            id:userdata.id
        } 
      }
      const authToken = jwt.sign(data,jswSecret)
      return res.status(200).json({ success: true,authToken:authToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
  

module.exports = router;



