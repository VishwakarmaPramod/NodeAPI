"use strict";
var userService = require('./Controller/user');
var loginService = require('./Controller/login');
var configJWT = require('./config');
var jwt = require('jsonwebtoken');
var uploadImageService=require('./Controller/uploadImage');
var multer = require('multer');

const routes = function (app) {

    var Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./Images");
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({
        storage: Storage
    });

    //without token check API
    app.post("/login", loginService.login);
    app.post("/api/upload-image", uploadImageService.uploadImageBase);
    //check token value
    app.use(function (req, res, next) {
        var token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.' });
        }
        jwt.verify(token, configJWT.secret, function (err, decoded) {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            else {
                req.decode = decoded;
                next();//move to next API
            }
        });
    });

    //Token check
    app.get("/api/user-list", userService.userList);
    

};
module.exports = routes;