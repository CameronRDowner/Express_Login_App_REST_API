const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    const username = req.body.username
    const user = { username: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.status(201).json({ accessToken: accessToken });
})

module.exports = router;