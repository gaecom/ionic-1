/**
 * Created by Administrator on 4/6/14.
 */

var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);

var fs = require('fs');
var url = require("url");
var path = require('path');
var mime = require('mime');


/*app.get("/", function (req,res){
    res.sendfile(__dirname + "/index.html");
});*/


app.get("/ping", function (req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.end();
})

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

server.listen(8088);






