/**
 * Created by Duncan on 4/2/2017.
 */

var config = require("./config.json");
var http = require('http');
var fs   = require('fs');
var path = require('path');
var ext = /[\w\d_-]+\.([\w\d]+)$/;

var parser = require("src/parser");
var STree = require("src/SemanticTree");
console.log(new STree(parser.toPostfix("(2 + y) * (21 + <op>(1, 2, x))")).toString());

http.createServer(function(req, res){
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } else if (ext.test(req.url)) {
        var p = path.join(config.projectPath, req.url);
        // console.log("Handling request for " + req.url + "!");
        fs.exists(p, function(exists){
            if (exists) {
                res.writeHead(200, {});
                fs.createReadStream(p).pipe(res);
            } else {
                res.writeHead(404, {});
                fs.createReadStream('error.html').pipe(res);
            }
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/json'});
        console.log("receiving a request of " + req.url);
        req.on("data", function(data){
            var str = JSON.stringify(new STree(parser.toPostfix(String(data))).toString());
            console.log(str);
            res.write(str);
            res.end();
        });
    }
}).listen(8080);


