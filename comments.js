// Create web server 

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests
var server = http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;
  console.log("Request for " + path + " received.");

  // Get the form for posting comments
  if (path == "/") {
    fs.readFile("post.html", function(err, data) {
      if (err) {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.end("404 Not Found");
      } else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(data);
      }
    });
  }

  // Post the comment
  if (path == "/post") {
    var postData = "";
    request.on('data', function(data) {
      postData += data;
    });
    request.on('end', function() {
      var postQuery = querystring.parse(postData);
      var postText = postQuery.text;
      var postName = postQuery.name;
      var postEmail = postQuery.email;
      var postDate = new Date();
      var postTime = postDate.getTime();
      var postDateTime = postDate.toDateString() + " " + postDate.toTimeString();
      fs.appendFile("comments.txt", postTime + ";" + postName + ";" + postEmail + ";" + postText + "\n", function(err) {
        if (err) {
          response.writeHead(404, {"Content-Type": "text/html"});
          response.end("404 Not Found");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.end(postDateTime + "<br>" + postName + "<br>" + postEmail + "<br>" + postText);
        }
      });
    });
  }

  // Get the list of comments
  if (path == "/list") {
      fs.readFile("comments.txt", function(err, data) {
      });
    }
});