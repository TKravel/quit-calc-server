# Quit smoking calculator

Quit smoking calculator is a fullstack MERN application used to set goals to help you quit smoking by visualizing savings.

## Client code

Server code can be found at https://github.com/TKravel/quit-calc-client

## Installation

### Client installation

From the root level of the working directory run

```bash
npm install
```
To start the client run
```bash
npm start
```

### Server installation

In a second terminal opened to the server code run the following to start the server
```bash
node index.js
```

## Requirements

Parent helper connects to MongoDb Atlas. Free shared accounts can be created at https://www.mongodb.com/cloud/atlas.

## In quit-calc-server

Create a .env file which will require the following enviroment variables
```javascript
DBUSER="Your Mongo Atlas clusters username"
DBPASS="The users password"
DBNAME="The database name"
JWT_SECRET="A unique secret for signing and decoding JWT's"
```

## Demo
A working demo can be found at https://condescending-boyd-227f42.netlify.app/
