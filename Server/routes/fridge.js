var db = require('../server.js').db;

exports.findAll = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code", function(err, rows) {
        res.json(rows);
    });
};

exports.findByCode = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.code = f.code WHERE p.code = ?", [req.params.code], function(err, rows) {
        res.json(rows);
    });
};

exports.insert = function(req, res) {
    var p = req.body;
    db.query("INSERT INTO Fridge VALUES(:code, :qty)", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.update = function(req, res) {
    var p = req.body;
    db.query("UPDATE Fridge SET qty = :qty WHERE code = :code", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.delete = function(req, res) {
    db.query("DELETE FROM Fridge WHERE code = ?", [req.params.code], function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};