"use strict";
var express = require('express');
const app = express();
var port = process.env.port || 1337;
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

require("./route")(app);

app.listen(port, function () {
    console.log("API listening on port " + port);
});