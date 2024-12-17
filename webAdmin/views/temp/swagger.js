const swaggerAutogen = require('swagger-autogen')()
const doc = {
    securityDefinitions: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header', // can be 'header', 'query' or 'cookie'
          name: 'Authorization', // name of the header, query parameter or cookie
          scheme: "bearer",
          description: 'Bearer token'
        }
      },
    security: [ { apiKeyAuth: [] } ],
    info: {
        version: "1.0.0",
        title: "WebAdmin API",
        description: "<b>Description!!</b>."
    },
    host: "localhost:5000",

    definitions: {
        LogIn: {
            $userNameORemail: "admin@noroff.no",
            $password: "P@ssword2023",
        },
    }
    
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
require('./bin/www');
});