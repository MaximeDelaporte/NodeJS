const express = require('express')
const app = express()
var mysql = require('mysql')
var cors = require('cors')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser')
var randtoken = require('rand-token')
var moment = require('moment')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/public/js', express.static(path.join(__dirname,'/template/assets/js')));
app.use('/public/css', express.static(path.join(__dirname,'/template/assets/css')));
 var a = io.of('/a')
 var b = io.of('/b')
a.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('action',function(message){
        a.emit('event', message.user + " : " + message.message);
    })
});
b.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('action',function(message){
        b.emit('event', message.user + " : " + message.message);
    })
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/template/index.html');
});

http.listen(3000, () => console.log('Example app listening on port 3000!'))
        