const { request } = require('express');
const express = require('express');
const router = express.Router();
const User = require('./models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', getUser, (req, res) => {
    res.send(res.user);
})

router.post('/', getUser, async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/:id', getUser, async (req, res) => {
    if (req.body.username){
        res.user.username = req.body.username;
    }
    if(req.body.email){
        res.user.email = req.body.email;
    }
    if(req.body.password){
        res.user.password = req.body.password;
    }
    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser)
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

module.exports = router;