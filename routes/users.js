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

router.get('/:id', (req, res) => {
    res.send(res.user.);
})

router.post('/', async (req, res) => {
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

router.patch('/', (req, res) => {

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