const express = require('express');
const helmet = require('helmet')

const server = express();

server.use(express.json())
server.use(helmet())

const Router = require(`./users/userRouter`)
server.use(`/api/users`, Router)



server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(logger)

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method}, ${req.originalUrl}, ${new Date().toISOString()}`);
  next()
}

module.exports = server;
