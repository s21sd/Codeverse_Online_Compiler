const express = require('express');
var compiler = require('compilex');
var options = { stats: true };
compiler.init(options);
const Code = require('../models/Code');
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
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 1000 } };
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data);
                    //data.error = error message 
                    //data.output = output value
                });
                //res is the response object
            }
            else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 1000 } };
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

module.exports = router;
