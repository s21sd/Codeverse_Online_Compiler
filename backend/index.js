const express = require('express');
const cors = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./db');
const authroutes = require('./routes/authroutes')
const app = express();
const server = http.createServer()
const PORT = 5000;

app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Api is running...');
});
app.use('/auth', authroutes)


app.listen(PORT, () => {
    console.log(`Server is running on the port  ${PORT}`)
})