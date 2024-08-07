const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const secrets = require('./secrets.json');

function discord(...umsg) {
    var msg = umsg.join(' ');
    axios.post(secrets.webhook, {
        content: msg
    }).then(() => {
        console.log('Message sent to Discord');
    }).catch((error) => {
        console.error('Error sending message to Discord:', error);
    });
}

app.get('/logo',(req,res)=>{
    res.sendFile(__dirname + '/mlogo.png');
});

var ips = {};

app.get('/mosquito/track',(req,res)=>{
    if (req.query.complaint == undefined || req.query.complaint == '' || req.query.complaint == null) {
        res.status(400).send('Missing complaint');
        return;
    } 
    if (req.query.logfile == undefined || req.query.logfile == '' || req.query.logfile == null) {
        res.status(400).send('Missing logfile');
        return;
    }
    discord('Received bug report! ' + (req.query.complaint), req.query.logfile);
    res.status(200).send();
});

app.get('/index.css',(req,res)=>{
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/index.css');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Opened Mosquito instance!`);
});