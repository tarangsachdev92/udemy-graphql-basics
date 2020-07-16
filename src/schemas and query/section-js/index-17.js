import { GraphQLServer } from 'graphql-yoga'

// Scaler types: String, Boolean, Int, Float, ID
// Non Scaler types: Object and Array

// Demo user data 
const users = [{
    id: '1',
    name: 'Tarang',
    email: 'tarangsachdev@gmail.com',
    age: 27
}, {
    id: '2',
    name: 'kishan',
    email: 'kishan@gmail.com',
}, {
    id: '3',
    name: 'keyur',
    email: 'keyur@gmail.com',
    age: 26
}]

const posts = [{
    id: '1',
    title: 'GraphQl 101',
    body: 'this is how to use graphql...',
    published: true
}, {
    id: '2',
    title: 'NodeJs 101',
    body: 'critical node js',
    published: true
}, {
    id: '3',
    title: 'React Js 103',
    body: '',
    published: false
}]

// Type definition(schema)
const typeDefs = `

    type Query {
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        post : Post!
        me: User!
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
        users(parent, args, ctx, info) {
            const { query } = args;
            if (!query) {
                return users;
            }
            return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
        },
        posts(parant, args, ctx, info) {
            const { query } = args;
            if (!query) {
                return posts;
            }
            return posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
                return isTitleMatch || isBodyMatch;
            });
        }
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
  users(query:"k") {
    id
    name
    email
    age
  }
}

query {
  users {
    id
    name
    email
    age
    posts{
      id
      title
      body
      published
    }
  }
}

*/