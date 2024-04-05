const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/checkAuthMiddleWare')
router.get('/test', (req, res) => {
    res.send('Auth routes is working fine ...');

});

// Here the sign up api will go 
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const emailExits = await User.findOne({ email }) //  Checking for the existence of the user 
        if (emailExits) {
            return res.status(409).json({ message: "Email Already Exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashPass
        })
        await newUser.save();
        return res.status(200).json({
            message: "Sign Up Successfully"
        })

    } catch (error) {
        return res.status(505).json({ message: error.message })
    }

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid Credentials' })
        }
        const authToken = jwt.sign({ user: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' })
        await user.save();
        res.cookie('token', authToken, { httpOnly: true })
        res.status(200).json({
            token,
            message: "User logged in successfully"
        });
    } catch (error) {
        return res.status(509).json({ message: error.message })

    }
})

module.exports = router;