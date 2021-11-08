const { ApolloServer } = require('apollo-server');

const resolvers = require('./src/resolvers');
const schema    = require('./src/gqlSchema');

// 'typeDefs and resolvers' are the key names that Apollo needs
const server = new ApolloServer({ 
        cors: {
                origin: '*',
                credentials: true
        },
        typeDefs:  schema, 
        resolvers: resolvers });

server.listen()
      .then( info => console.log('server ready at ' + info.url));
