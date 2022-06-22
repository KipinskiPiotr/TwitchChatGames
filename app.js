var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index/index.html'));
});

app.get('/fourinarow', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/fourinarow/fourinarow.html'));
});

app.listen(3000);
