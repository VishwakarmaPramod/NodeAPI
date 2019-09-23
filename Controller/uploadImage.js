"use strict";
var sql = require("mssql");
var config = require("../Connection/connect");
var base64 = require('file-base64');
var base64ToImage = require('base64-to-image');
var tryparse = require('tryparse');

exports.uploadImageBase = function (req, res) {    

    //try to convert value in int
    if(tryparse.int(req.body.ServiceOrderId)>0){
        console.log("ok");
    }else{
        console.log("error");
    }

    //upload image in a folder using base64 of a file/image
    // var fs = require("fs");
    // var bitmap = new Buffer(req.body.ImageBase, 'base64');
    // fs.writeFile('./Images/' + req.body.ImageName, bitmap);
    // res.send(JSON.stringify({ statusCode: 200, msg: "Done", data: "" }));
}