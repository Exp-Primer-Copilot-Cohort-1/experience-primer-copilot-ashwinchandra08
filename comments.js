// Create a web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');

const comments = [];

const server = http.createServer((req, res) => {
  // Parse the URL
  const urlObj = url.parse(req.url, true);
  console.log(urlObj);

  // Get the path name
  const pathName = urlObj.pathname;

  // If the request is for the home page
  if (pathName === '/') {
    // Read the home page file
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (pathName === '/comments') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else if (req.method === 'POST') {
      let postData = '';
      req.on('data', (chunk) => {
        postData += chunk;
      });
      req.on('end', () => {
        const comment = queryString.parse(postData);
        comments.push(comment);
        res.end('Comment added');
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});