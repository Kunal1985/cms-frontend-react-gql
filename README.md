# CMS-React-GraphQL
Frontend-CMS application developed using React-GraphQL.

## Pre-Requisites
Node JS  
React JS  

## Installation
### Install Basic NPM Packages from package.json
`npm install`

## Configurations
### GraphQL Server
Check index.js and configure GraphQL server path accordingly.  
`const httpLink = new HttpLink({ uri: 'http://localhost:8080/graphql', credentials: 'include' })`

### Node Server (Frontend)
Port Number can be configured/updated in the package.json

## Running the Application
### Start the Node Server
`npm start`  

### Accessing the application
http://localhost:5000 >> Index URL

# License
MIT
