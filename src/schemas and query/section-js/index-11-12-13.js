import { GraphQLServer } from 'graphql-yoga'

// Scaler types: String, Boolean, Int, Float, ID
// Non Scaler types: Object and Array

// Type definition(schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
        id:ID!
        age:Int!
        employed: Boolean!
        gpa: Float
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock : Boolean!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

`
// Resolvers
const resolvers = {
    Query: {
        hello() { return `This is my first query!` },
        name() { return `Tarang Sachdev` },
        location() { return `Jamnagar` },
        bio() { return `I am a software developer` },
        id() { return `abc123` },
        name() { return 'Tarang Sachdev' },
        age() { return 27 },
        employed() { return true },
        // gpa() { return null },
        gpa() { return 7.14 },
        title() { return `The war of art` },
        price() { return 12.99 },
        releaseYear() { return 2017 },
        rating() { return 5 },
        inStock() { return true }
    }


}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('server is up and running')
})

// query to test

/*
query{
    hello
    bio
    location
    name
    id
    employed
    age
    gpa
  }

  
*/

