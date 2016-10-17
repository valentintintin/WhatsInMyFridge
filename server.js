var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json())

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.get('/api/product', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.all("SELECT p.*, f.qty FROM Products", function (err, rows) {
            res.json(rows);
        });
    });
});

app.get('/api/product/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.get("SELECT p.*, f.qty FROM Products WHERE p.code = " + req.params.code, function (err, rows) {
            res.json(rows);
        });
    });
});

app.post('/api/product', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", p.code, p.name, p.image);
    });
});

app.put('/api/product/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("UPDATE Products SET name = ?, image = ? WHERE code = ?", p.name, p.image, req.params.code);
    });
});

app.delete('/api/product/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("DELETE FROM Products WHERE code = ?", req.params.code);
    });
});





app.get('/api/fridge', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.all("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code", function (err, rows) {
            res.json(rows);
        });
    });
});

app.get('/api/fridge/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.get("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code WHERE p.code = " + req.params.code, function (err, rows) {
            res.json(rows);
        });
    });
});

app.post('/api/fridge', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", p.code, p.name, p.image);
        db.run("INSERT INTO Fridge VALUES(?, ?)", p.code, p.qty);
    });
});

app.put('/api/fridge/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("UPDATE Products SET name = ?, image = ? WHERE code = ?", p.name, p.image, req.params.code);
        db.run("UPDATE Fridge SET qty = ? WHERE code = ?", p.qty, req.params.code);
    });
});

app.delete('/api/fridge/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("DELETE FROM Fridge WHERE code = ?", req.params.code);
    });
});





app.get('/api/market', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.all("SELECT p.*, f.qty FROM Products p JOIN Market f on p.code = f.code", function (err, rows) {
            res.json(rows);
        });
    });
});

app.get('/api/market/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.serialize(function() {
        db.get("SELECT p.*, f.qty FROM Products p JOIN Market f on p.code = f.code WHERE p.code = " + req.params.code, function (err, rows) {
            res.json(rows);
        });
    });
});

app.post('/api/market', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", p.code, p.name, p.image);
        db.run("INSERT INTO Market VALUES(?, ?)", p.code, p.qty);
    });
});

app.put('/api/market/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("UPDATE Products SET name = ?, image = ? WHERE code = ?", p.name, p.image, req.params.code);
        db.run("UPDATE Market SET qty = ? WHERE code = ?", p.qty, req.params.code);
    });
});

app.delete('/api/market/:code', function(req, res) {
    var p = req.body;
    db.serialize(function() {
        db.run("DELETE FROM Market WHERE code = ?", req.params.code);
    });
});



app.listen(3000);