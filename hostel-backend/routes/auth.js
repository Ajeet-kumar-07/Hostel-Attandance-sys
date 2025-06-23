const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = 'helloajeet123';

//register for new user(remove later);
// //middleware
// const verifyToken = (req,res,next) => {
//     const auth = req.headers.authorization;
//     if(!auth) return res.status(401).json({error:'No token'});

//     try{
//       const decoded = jwt.verify(auth.split(' ')[1],JWT_SECRET);
//       req.user = decoded;
//       next();
//     }catch(err){
//       res.status(403).json({error: 'Invalid token'});
//     }   
//   };

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ error: 'User already exists' });
      
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//login 

router.post('/login' , async (req , res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user) return res.status(401).json({
        error : 'Invalid credentials'
    });

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) return res.status(401).json({error: 'Wrong password'});

    const token = jwt.sign({id: user.id}, JWT_SECRET,{expiresIn:'1d'});

    res.json({token,user: {username}});

});


module.exports = router;


