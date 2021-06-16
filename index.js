// Dependencies
const http = require('http');
const url = require('url');
const fs = require('fs');

// Define All Placeholders from HTML
const PRODUCT_NAME = /{%PRODUCT_NAME%}/g;
const IMAGE = /{%IMAGE%}/g;
const QUANTITY = /{%QUANTITY%}/g;
const PRICE = /{%PRICE%}/g;
const COUNTRY = /{%COUNTRY%}/g;
const BENIFET = /{%BENIFET%}/g;
const DESCRIPTION = /{%DESCRIPTION%}/g;
const ID = /{%ID%}/g;
const NOT_ORGANIC = /{%NOT_ORGANIC%}/g;
const NOT_ORGANIC_CLASS = 'not-organic';

const PLACEHOLDER = /{%PRODUCT_CARDS%}/g;

// Getting all templates at the beginning
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempProducts = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

// Get all JSON data once at the beginning of the program.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Init server
const server = http.createServer((request, response) => {
    // Getting the url of the request
    console.log(request.url);

    // In order to implement routing, we'll use an if-else statement
    const pathName = request.url;
    
    // We use ES6 destructuring to create 2 variables all at once, using the results from url.parse(); it will assign query to its variable and pathname to its variable.
    const { query, pathname } = url.parse(request.url, true);

    // Overview Page
    if(pathname === '/overview' || pathname === '/') {

        // Displaying the main content of the page
        response.writeHead(200, {'content-type' : 'text/html'});

        /**
         * We're using the @map method in order to create a new array of html elements and the using the @join method to turn it into a string to become a true html string.
         */
        const cardsHtml = dataObj.map(element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace(PLACEHOLDER, cardsHtml);

        response.end(output);

    // Product Page
    } else if (pathname === '/product') {

        // Displaying the main content of the page
        response.writeHead(200, {'content-type' : 'text/html'});

        // Getting the product in question based on the id inside the objects array.
        const product = dataObj[query.id];

        // Building output html
        let output = replaceTemplate(tempProducts, product);

        response.end(output);

    // API
    } else if (pathname === '/api') {
        response.writeHead(200, {'Content-type' : 'application/json'});
        response.end(data);
        
    // Not Found
    } else {
        response.writeHead(404);
        response.end('404 Page not found');
    }

});

// Server is listening for changes
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

// Replace template method to populate the cards, and display the products.
const replaceTemplate = (temp, product) => {
    let output = temp.replace(PRODUCT_NAME, product.productName);
    output = output.replace(IMAGE, product.image);
    output = output.replace(PRICE, product.price);
    output = output.replace(COUNTRY, product.from);
    output = output.replace(BENIFET, product.nutrients);
    output = output.replace(QUANTITY, product.quantity);
    output = output.replace(DESCRIPTION, product.description);
    output = output.replace(ID, product.id);

    if(!product.organic) {
        output = output.replace(NOT_ORGANIC, NOT_ORGANIC_CLASS);
    }

    return output;
}