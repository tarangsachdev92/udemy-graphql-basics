import { GraphQLServer } from 'graphql-yoga'

// Scaler types: String, Boolean, Int, Float, ID
// Non Scaler types: Object and Array

// Type definition(schema)
const typeDefs = `

    type Query {
        me: User!
        post : Post!
        greeting(name: String, position: String): String!
        add(a: Float!,b: Float!): Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: 'abc123',
                name: 'TArang',
                email: 'tarangsachdev@gmaail.com'
                // age:22
            }
        },

        post() {
            return {
                id: 'postabc123',
                title: 'First Post',
                body: 'This is the body of the post q23',
                published: false
            }
        },
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello, ${args.name}! You are my favoriate ${args.position}`
            } else {
                return 'Hello!'
            }
        },
        add(parent, args, ctx, info) {
            return args.a + args.b;
        },
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('server is up and running')
})


/*
query {
  me {
    id
    name
    email
    age
  }
   post{id,title,body,published}
}

query {
  greeting(name: "Tarang",position:"Teacher"),
  add(a:1,b:2)
}

*/
