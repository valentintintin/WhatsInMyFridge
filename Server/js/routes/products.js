var db = require('../server.js').db;

exports.findAll = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT * FROM Products", function(err, rows) {
        res.json(rows);
    });
};

exports.findByCode = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT * FROM Products p WHERE p.code = ?", [req.params.id], function(err, rows) {
        res.json(rows);
    });
};

exports.insert = function(req, res) {
    var p = req.body;
    db.query("INSERT OR IGNORE INTO Products VALUES(:code, :name, :image)", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.update = function(req, res) {
    var p = req.body;
    db.query("UPDATE Products SET name = :name, image = :image WHERE code = :code", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.delete = function(req, res) {
    var product = req.body;
    db.query("DELETE FROM Products WHERE code = ?", [req.params.id], function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};