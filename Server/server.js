var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var dblite = require('dblite');
exports.db = dblite('db.db', '-header');

var product = require('./routes/products.js');
var fridge = require('./routes/fridge.js');
var market = require('./routes/market.js');

console.log("Wait...");

// Decode JSON
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

app.get('/api/product', product.findAll);
app.get('/api/product/:code', product.findByCode);
app.post('/api/product', product.insert);
app.put('/api/product/:code', product.update);
app.delete('/api/product/:code', product.delete);

app.get('/api/fridge', fridge.findAll);
app.get('/api/fridge/:code', fridge.findByCode);
app.post('/api/fridge', fridge.insert);
app.put('/api/fridge/:code', fridge.update);
app.delete('/api/fridge/:code', fridge.delete);

app.get('/api/market', market.findAll);
app.get('/api/market/:code', market.findByCode);
app.post('/api/market', market.insert);
app.put('/api/market/:code', market.update);
app.delete('/api/market/:code', market.delete);

var port = 3000;
if (process.argv[2] != undefined) port = process.argv[2];

app.listen(port);

console.log("Started on " + port + " !");
