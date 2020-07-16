import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/subscription/schema.graphql', // relative to the root application folder(where the pacakge.json there) 
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        Comment,
        User
    },
    context: {
        db, pubsub
    }
})

server.start(() => {
    console.log('server is up and running')
})