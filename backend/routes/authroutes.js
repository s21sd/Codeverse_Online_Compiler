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
        return res.status(505).json({ message: "Error in the sign up" })
    }

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email }); // check for user existence
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid Credential" })
        }
        console.log(existingUser.password)
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        existingUser.token = token;
        await existingUser.save();
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({
            token,
            message: "User logged in successfully"
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/checkLogin', checkAuth, async (req, res) => {
    res.status(200).json({ message: "User is logged in" }, res.ok);
})

module.exports = router;