const { ApolloServer } = require('apollo-server');

const resolvers = require('./src/resolvers');
const schema    = require('./src/gqlSchema');

const server = new ApolloServer({ schema, resolvers });

server.listen()
      .then( info =>  console.log('server ready at ' + info.url));
