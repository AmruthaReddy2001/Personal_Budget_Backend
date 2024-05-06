const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const {uuid} = require("uuidv4");
const {expressjwt: exjwt} = require('express-jwt');

const model = require("../Model/userModel");
const secretKey = "My Secret Key";
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try{
        const user = req.body;
        user._id = uuid.v4;
        const duplicateUser = await model.findOne({username: user.username});
        if(duplicateUser){
            res.status(400).json({"error": "Username already in use!"});
            return;
        }

        const userEntry = new model(user);
        const entry = await userEntry.save();
        let token = jwt.sign({_id: entry._id, username: user.username}, secretKey,{expiresIn: '60s'});
        var decoded_token = jwt_decode.jwtDecode(token);
        res.status(200).json({'status': 'success', 'exp': decoded_token.exp, token, "username": user.username});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/login', async (req, res, next) => {
    try{
        const curUser = req.body;
        model.findOne({username: curUser.username})
        .then(user => {
            if(!user){
                res.status(400).json({message: 'Invalid Username'})
            } else{
                user.comparePassword(curUser.password)
                .then(result => {
                    if(result){
                        let token = jwt.sign({_id: user._id, username: user.username}, secretKey,{expiresIn: '60s'});
                        var decoded_token = jwt_decode.jwtDecode(token);
                        res.status(200).json({'status': 'success', 'exp': decoded_token.exp, token, "username": curUser.username});
                    } else{
                        res.status(400).json({message: 'Invalid Password'})
                    }
                })
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

module.exports = router;