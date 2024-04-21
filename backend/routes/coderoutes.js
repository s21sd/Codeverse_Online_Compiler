const express = require('express');
var compiler = require('compilex');
var options = { stats: true };
compiler.init(options);
const Code = require('../models/Code');
const authenticateToken = require('../middlewares/checkAuthMiddleWare');
const User = require('../models/User');
const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Code Routes routes is working fine ...');
});

router.post('/compile', (req, res) => {
    try {
        const { code, input, language } = req.body;
        console.log(code, language, input);
        if (!language || !code) {
            return res.status(509).json({ message: "Code and language is required!" })
        }
        // Handling the cpp and c language
        if (language === 'cpp' || language === 'c') {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 100000 } };
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data);
                    //data.error = error message 
                    //data.output = output value
                });
                //res is the response object
            }
            else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 100000 } };
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }

        // Handing the java language
        if (language === 'java') {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compileJava(envData, code, function (data) {
                    res.send(data);
                });
            }
            else {
                var envData = { OS: "windows" };
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }

        // Handling the python language

        if (language === 'python') {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compilePython(envData, code, function (data) {
                    console.log(data);
                    res.send(data);
                });
            }
            else {
                var envData = { OS: "windows" };
                var envData = { OS: "linux" };
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        }
        compiler.flushSync();

    } catch (error) {
        return res.status(503).json({ message: error.message })
    }

});

router.post('/savecode', authenticateToken, async (req, res) => {
    const { code } = req.body;

    if (!code || !language) {
        return res.status(509).send({
            message: "Please Write some code"
        })
    }
    const user = await User.findOne(req._id)
    console.log(user)
    if (!user) {
        return res.status(404).send({ message: "User not found!" })
    }
    // after finding the user Now I want to save the code for the specific user
    try {
        const newCode = new Code({
            user: user._id,
            code: code.code,
            language: code.language
        });
        await newCode.save();
        return res.status(200).send({
            message: "Code Saved Successfully"
        })

    } catch (error) {
        return res.status(404).send({ message: "Error in saving the code", error })
    }

    // console.log(existingUser)
})
router.post('/mycodes', authenticateToken, async (req, res) => {
    const userId = req._id;
    
    try {
        const user1 = await User.findById(userId).populate({
            path: "code",
            options: { sort: { createdAt: -1 } }
        })
      
        if (!user1) {
            return res.status(404).send({
                message: "User Not Found"
            })
        }

        return res.status(200).send({
            code: user1.code,
            language: user1.language
        });

    } catch (error) {
        return res.status(404).send({
            message: "Error in Getting my codes"
        })
    }
})
router.post("/getallcode", async (req, res) => {
    try {
        const allCodes = await Code.find().sort({ createdAt: -1 });
        return res.status(200).send(allCodes);
    } catch (error) {
        return res.status(404).send({ message: "Error in the fetching the codes" })
    }


})

module.exports = router;
