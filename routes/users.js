const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcryptjs');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', authenticateToken, getUser, (req, res) => {
    res.send(res.user);
})

router.post('/', authenticateToken, async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/:id', authenticateToken, getUser, async (req, res) => {
    if (req.body.username){
        res.user.username = req.body.username;
    }
    if(req.body.email){
        res.user.email = req.body.email;
    }
    if(req.body.passwordHash){
        res.user.passwordHash = req.body.passwordHash;
    }
    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser)
    }
    catch (error) {
        res.status(400).json({ message: error.message})
    }
})

router.delete('/:id', authenticateToken, getUser, async (req, res) => {
    try{
        User.deleteOne({ userName : { $eq: res.user.userName} })
    }
    catch (error) {
        res.status(400).json({ message: error.message})
    }
})

async function getUser(req, res, next){
    let user
    try{
        user = await User.findById(req.params.id);
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    }
    catch (error){
        return res.status(500).json({ message: error.message })
    }

    res.user = user;
    next()
}


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error){
            return res.sendStatus(403);
        }
        req.user = user;
        next()
    })
}
module.exports = router;