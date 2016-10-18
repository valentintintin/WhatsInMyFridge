var dblite = require('dblite'), db = dblite('db.db', '-header');

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
	db.query("SELECT p.* FROM Products p", function(err, rows) {
		res.json(rows);
	});
});

app.get('/api/product/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	db.query("SELECT p.* FROM Products p WHERE p.code = ?", [req.params.code], function (err, rows) {
		res.json(rows);
	});
});

app.post('/api/product', function(req, res) {
    var p = req.body;
    db.query("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", [p.code, p.name, p.image]);
});

app.put('/api/product/:code', function(req, res) {
    var p = req.body;
    db.query("UPDATE Products SET name = ?, image = ? WHERE code = ?", [p.name, p.image, req.params.code]);
});

app.delete('/api/product/:code', function(req, res) {
    var p = req.body;
    db.query("DELETE FROM Products WHERE code = ?", [req.params.code]);
});





app.get('/api/fridge', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code", function (err, rows) {
		res.json(rows);
	});
});

app.get('/api/fridge/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code WHERE p.code = ?", [req.params.code], function (err, rows) {
		res.json(rows);
	});
});

app.post('/api/fridge', function(req, res) {
    var p = req.body;
	console.log(p);
	db.query("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", [p.code, p.name, p.image]);
	db.query("INSERT INTO Fridge VALUES(?, ?)", [p.code, p.qty]);
});

app.put('/api/fridge/:code', function(req, res) {
    var p = req.body;
	db.query("UPDATE Products SET name = ?, image = ? WHERE code = ?", [p.name, p.image, req.params.code]);
	db.query("UPDATE Fridge SET qty = ? WHERE code = ?", [p.qty, req.params.code]);
});

app.delete('/api/fridge/:code', function(req, res) {
    var p = req.body;
    db.query("DELETE FROM Fridge WHERE code = ?", [req.params.code]);
});





app.get('/api/market', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	db.query("SELECT p.*, f.qty FROM Products p JOIN Market f on p.code = f.code", function (err, rows) {
		res.json(rows);
	});
});

app.get('/api/market/:code', function(req, res){
    res.setHeader('Content-Type', 'application/json');    
	db.query("SELECT p.*, f.qty FROM Products p JOIN Market f on p.code = f.code WHERE p.code = ?", [req.params.code], function (err, rows) {
		res.json(rows);
	});
});

app.post('/api/market', function(req, res) {
    var p = req.body;    
	db.query("INSERT OR IGNORE INTO Products VALUES(?, ?, ?)", [p.code, p.name, p.image]);
	db.query("INSERT INTO Market VALUES(?, ?)", p.code, p.qty);
});

app.put('/api/market/:code', function(req, res) {
    var p = req.body;
	db.query("UPDATE Products SET name = ?, image = ? WHERE code = ?", [p.name, p.image, req.params.code]);
	db.query("UPDATE Market SET qty = ? WHERE code = ?", [p.qty, req.params.code]);
});

app.delete('/api/market/:code', function(req, res) {
    var p = req.body;
	db.query("DELETE FROM Market WHERE code = ?", [req.params.code]);
});



app.listen(3000);

console.log("Started !");