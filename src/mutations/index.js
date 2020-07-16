import { GraphQLServer } from 'graphql-yoga'
import db from './db';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const server = new GraphQLServer({
    typeDefs: './src/mutations/schema.graphql', // relative to the root application folder(where the pacakge.json there) 
    resolvers: {
        Query,
        Mutation,
        Post,
        Comment,
        User
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('server is up and running')
})