//import 'http', 'url' and 'fs'
const http = require('http');
  url = require('url');
  fs = require('fs');

//createServer callback function request will parse incoming requests from the url
http.createServer((request, response) => {
  let addr = request.url;
  let q = url.parse(addr, true);
  filePath = '';

//this will log recent requests made to the server
fs.appendFile('log.txt', 'URL:' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

//this will check if the url includes 'documentation'
  if (q.pathname.includes('documentation')) {
    filePath = (_dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  fs. readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();

  });

}).listen(8080);
console.log('My first Node test server is running on Port 8080.');
