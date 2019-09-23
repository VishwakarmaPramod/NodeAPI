"use strict";
var sql = require("mssql");
var config = require("../Connection/connect");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var configJWT = require('../config');
var apn = require('apn');
// var FCM = require('fcm-push');
// var fcm = new FCM(serverkey);
var options = {
    token: {
        key: "C:/Users/pragatij/Desktop/Diligent/AuthKey_MTYCJ7Q2S6.p8",
        keyId: "MTYCJ7Q2S6",
        teamId: "73V4PX9SKF"
    },
    production: false
};

var apnProvider = new apn.Provider(options);
var note = new apn.Notification();

exports.login = function (req, res) {
    if (req.body.Email == null || req.body.Email == undefined || req.body.Password == null || req.body.Password == undefined || req.body.Email.trim() == "" && req.body.Password.trim() == "") {
        res.send(JSON.stringify({ statusCode: 100, msg: "Empty values Message", data: "" }));
    }
    else {
        sql.connect(config, function (err) {
            if (err) {
                res.send(JSON.stringify({ statusCode: 100, msg: "Error Message", data: err }));
            }
            var query = "exec spLogin @Email='" + req.body.Email.trim() + "', @Password='" + req.body.Password.trim() + "';";
            var request = new sql.Request();
            request.query(query, function (err, response) {
                if (err) {
                    sql.close();
                    res.send(JSON.stringify({ statusCode: 100, msg: "Error Message", data: err }));
                }
                else {
                    sql.close();
                    if (response.recordset[0].IsBlock) {
                        res.send(JSON.stringify({ statusCode: 200, msg: "User blocked", data: "" }));
                    }
                    else if (!response.recordset[0].IsActive) {
                        res.send(JSON.stringify({ statusCode: 200, msg: "User not active", data: "" }));
                    }
                    else if (!response.recordset[0].IsApproved) {
                        res.send(JSON.stringify({ statusCode: 200, msg: "User is not approved", data: "" }));
                    }
                    else if (response.recordset[0].Password != req.body.Password.trim()) {
                        res.send(JSON.stringify({ statusCode: 200, msg: "Password not match", data: response.recordset[0] }));
                    }
                    else {
                        var hashedPassword = bcrypt.hashSync(req.body.Password, 8);
                        //console.log(hashedPassword);
                        const payload = {
                            userObject: response.recordset[0]
                        };
                        var token = jwt.sign(payload, configJWT.secret, {
                            expiresIn: 86400
                        });
                        //console.log(token);
                        res.send(JSON.stringify({ statusCode: 200, msg: "Login successfully", data: response.recordset[0], Token: token }));
                    }
                }

                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.badge = 3;
                note.sound = "ping.aiff";
                note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
                note.payload = { 'messageFrom': 'John Appleseed' };
                note.topic = "com.diligentsvc.teamdiligent";
                let deviceToken = "e814c34a6847dafe97d065bac5e4c02fdcfe17f576d01e64069e126efc2c46db"

                apnProvider.send(note, deviceToken).then((result) => {
                    console.log(result);
                });


                // var message =
                // {
                //     to: 'e814c34a6847dafe97d065bac5e4c02fdcfe17f576d01e64069e126efc2c46db',
                //     collapse_key: 'Demo',

                //     notification:
                //     {

                //         body:' is live',
                //         PresenterId: 1,
                //         userId: 1,
                //         contentType: "Live",
                //         click_action: 'OPEN_VIEW_LIVE_ACTIVITY'
                //     },
                //     data: {

                //         userId: 1,
                //         PresenterId: 1,
                //         contentType: "Live",
                //         click_action: 'OPEN_VIEW_LIVE_ACTIVITY'
                //     },
                // };

                // fcm.send(message, function (err, response) {
                //     if (err) {
                //         console.log(err);
                //         console.log("Something has gone wrong !");
                //     } else {
                //         console.log("Successfully sent with resposne :", response);
                //     }
                // });


            });
        });
    }
}