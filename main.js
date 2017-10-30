var redis = require('redis')
var multer = require('multer')
var express = require('express')
var fs = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
client.lpush("toggle", "1");
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    client.lpush("recent_sites", req.url, function(err, value) {
        if (err) throw err;
    })
    client.ltrim("recent_sites", 0, 4);
    next();
});


app.post('/upload', [multer({
    dest: './uploads/'
}), function(req, res) {

    if (req.files.image) {
        fs.readFile(req.files.image.path, function(err, data) {
            if (err) throw err;
            var img = new Buffer(data).toString('base64');
            client.lpush("cats", img);
        });
        res.send("Image Saved");
    }

    res.status(204).end()
}]);

app.get('/meow', function(err, res) {
    client.lpop("cats", function(err, imagedata) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h1>\n<img src='data:my_pic.jpg;base64," + imagedata + "'/>");
        res.end();
    })
})

app.get('/toggleCacheFeature', function(req, res) {
    client.lindex("toggle", "0", function(err, value) {
        if (value == "0") {
            client.lpop("toggle");
            client.ltrim("toggle", 0, 0);
            client.lpush("toggle", "1");
            res.send("Caching Turned On");
        } else {
            client.lpop("toggle");
            client.ltrim("toggle", 0, 0);
            client.lpush("toggle", "0");
            res.send("Caching Turned Off");
        }

    });


})


app.get('/set', function(req, res) {
    // console.log(req.route.path);
    client.setex("key", 10, "this message will self-destruct in 10 seconds", function(err, value) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("Key with value: \"this message will self-destruct in 10 seconds\" has been created.");
        res.end();
    });
})

app.get('/catfact/:num', function(req, res) {
    res.writeHead(200, {
        'content-type': 'text/html'
    });
    client.lindex("toggle", 0, function(err, value) {
        if (value == "1") {
            res.write("Caching on - ");
            client.get("catfact" + req.params.num, function(err, value) {
                if (value != null) {
                    param = "Cat Fact No".concat(req.params.num);
                    param = param.concat(" ");
                    res.write(param.concat(value));
                    client.ttl("catfact" + req.params.num, function(err, value) {
                        param = "You can retrieve the key for ".concat(value.toString())
                        res.write(param.concat(" ms more."));
                    });
                } else {
                    get_line("catfacts.txt", req.params.num.split(":")[1], function(err, line) {
                        if (line === "File end reached without finding line; Give proper line number") {

                            res.write(line);
                        } else {
                            client.setex("catfact" + req.params.num, 10, line);
                            param = "Cat Fact No".concat(req.params.num);
                            param = param.concat(" ");
                            res.write("<br>Retrieving From File Directly;</br>");
                            res.write(param.concat(line));
                            client.ttl("catfact" + req.params.num, function(err, value) {
                                param = "You can retrieve the key for ".concat(value.toString())
                                res.write(param.concat(" ms more."));
                            });
                        }

                    });
                }
            });

        } else {
            res.write("Caching off - <br>Retrieving From File Directly;</br>");
            get_line("catfacts.txt", req.params.num.split(":")[1], function(err, line) {
                if (err) throw err;
                param = "Cat Fact No".concat(req.params.num);
                param = param.concat(" ");

                res.write(param.concat(line));
            });

        }
    });
})

app.get('/get', function(req, res) {
    client.get("key", function(err, value) {
        res.send(value);
    });
})

app.get('/recent', function(req, res) {
    {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h1>Visited Sites</h1><br /><ol>");
        client.lrange("recent_sites", 0, -1, function(err, val) {
            for (var a = 0; a < val.length; a++) {
                //result = "<li>" + res[a] + "</li><br />";
                res.write("<li>" + val[a] + "</li><br />");
            }
            res.write("</ol>");
            res.end();
        })
    }
})

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
    if (+line_no > lines.length) {
        //throw new Error('File end reached without finding line');
        lines = "File end reached without finding line; Give proper line number";
        callback(null, lines);
    } else {
        callback(null, lines[+line_no]);
    }

}

app.get('/test', function(req, res) {
    {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h3>test</h3>");
        res.end();
    }
})

// HTTP SERVER
var server = app.listen(3000, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})

exports
