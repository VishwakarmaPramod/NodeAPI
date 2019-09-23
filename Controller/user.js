"use strict";
var sql = require("mssql");
var config = require("../Connection/connect");

exports.userList = function (req, res) {
    sql.connect(config, function (err) {
        if (err) {
            sql.close();
            res.send(JSON.stringify({ statusCode: 100, msg: "Error Message", data: err }));
        }
        var request = new sql.Request();
        request.query('select * from tblUser', function (err, recordset) {
            if (err) {
                sql.close();
                res.send(JSON.stringify({ statusCode: 100, msg: "Error Message", data: err }));
            }
            else {
                sql.close();
                res.send(JSON.stringify({ statusCode: 200, msg: "Message", data: recordset }));
            }
        });
    });
}