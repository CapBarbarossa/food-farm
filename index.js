// Dependencies
const http = require('http');
const url = require('url');
const fs = require('fs');

// Get all JSON data once at the beginning of the program.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Init server
const server = http.createServer((request, response) => {
    //Getting the url of the request
    console.log(request.url);

    //In order to implement routing, we'll use an if-else statement
    const pathName = request.url;

    if(pathName === '/overview' || pathName === '/') {
        response.end('This is the Overview');

    } else if (pathName === '/product') {
        response.end('This is a product');

    } else if (pathName === '/api') {
        response.writeHead(200, {'Content-type' : 'application/json'});
        response.end(data);
        
    } else {
        response.writeHead(404);
        response.end('404 Page not found');
    }

});

//Server is listening for changes
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});