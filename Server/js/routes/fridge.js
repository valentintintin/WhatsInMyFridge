var db = require('../server.js').db;

exports.findAll = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.id = f.id", function(err, rows) {
        res.json(rows);
    });
};

exports.findByCode = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    db.query("SELECT p.*, f.qty FROM Products p JOIN Fridge f on p.id = f.id WHERE p.id = ?", [req.params.id], function(err, rows) {
        res.json(rows);
    });
};

exports.insert = function(req, res) {
    var p = req.body;
    db.query("INSERT INTO Fridge VALUES(:id, :qty)", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.update = function(req, res) {
    var p = req.body;
    db.query("UPDATE Fridge SET qty = :qty WHERE id = :id", p, function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};

exports.delete = function(req, res) {
    db.query("DELETE FROM Fridge WHERE code = ?", [req.params.id], function(err, rows) {
        if (err) {
            res.send(false);
            console.log(err);
        } else res.send(true);
    });
};