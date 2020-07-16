import { GraphQLServer } from 'graphql-yoga'

// Scaler types: String, Boolean, Int, Float, ID
// Non Scaler types: Object and Array

// Type definition(schema)
const typeDefs = `
    type Query {
        grades: [Int!]!
        addArray(numbers:[Float!]!): Float!
    }
`

// Resolvers
const resolvers = {
    Query: {
        grades(parent, args, ctx, info) {
            return [99, 80, 92]
        },
        addArray(parent, args, ctx, info) {
            if (args.numbers.length === 0) {
                return 0
            }

            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            })
        },

    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('server is up and running')
})
