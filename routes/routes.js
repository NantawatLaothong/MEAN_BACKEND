const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const {hashSync, compareSync} = require('bcrypt');
var jwt = require('jsonwebtoken');

// test route
router.get('/', async(req, res)=>{
    res.send('user');
})

// to register
router.post('/register', async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({
            email,
            username,
            password: hashSync(req.body.password, 10)
        });
        // const registeredUser = await User.register(user, password);
        // await registeredUser.save();
        const registeredUser = await user.save()
        res.send({
            success: true,
            message: 'user created successfully',
            // user: user
        });
    } catch(err){
        console.log(err);
        res.send({
            success: false,
            message: 'something went wrong',
            error: err
        })
    }
})

router.post('/login', async(req, res)=>{
    const user = await User.findOne({username: req.body.username})
    // no user found 
    if(!user){
        return res.status(401).send({
            success: false,
            message: "Could not find the user"
        })
    }
    // found the user hashed body password and compare it to user.password 
    if(!compareSync(req.body.password, user.password)){
        return res.status(401).send({
            success: false,
            message: "Incorrect password"
        })
    }
    const payload = {
        username: user.username,
        id: user._id
    }
    // create a token once the user is verified
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1d'});
    console.log(payload);
    return res.status(200).send({
        success: true,
        message: `logged in as ${user.username} successfully`,
        token: "Bearer " + token,
    });
})

module.exports = router; 
