const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./db');
const authroutes = require('./routes/authroutes')
const coderoutes = require('./routes/coderoutes')
const app = express();
const server = http.createServer(app)
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
const PORT = 5000;

app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Api is running...');
});
app.use('/auth', authroutes)
app.use('/code', coderoutes)


app.listen(PORT, () => {
    console.log(`Server is running on the port  ${PORT}`)
})