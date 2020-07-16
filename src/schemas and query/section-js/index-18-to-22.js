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
    id: '10',
    title: 'GraphQl 101',
    body: 'this is how to use graphql...',
    published: true,
    author: '1',
}, {
    id: '11',
    title: 'NodeJs 101',
    body: 'critical node js',
    published: true,
    author: '1'

}, {
    id: '12',
    title: 'React Js 103',
    body: 'very advance react js',
    published: false,
    author: '3'
}]

const comments = [{
    id: '101',
    text: 'Hey is this right?',
    author: '3',
    post: '10'
}, {
    id: '102',
    text: 'awsome article',
    author: '1',
    post: '10'
}, {
    id: '103',
    text: 'it is the best article in the world',
    author: '2',
    post: '11'
}, {
    id: '104',
    text: 'thanks for that greate post',
    author: '1',
    post: '11'
}]

// Type definition(schema)
const typeDefs = `

    type Query {
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        comments(query:String): [Comment!]!
        post : Post!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: 'abc123',
                name: 'Tarang',
                email: 'tarangsachdev@gmaail.com'
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
        posts(parent, args, ctx, info) {
            const { query } = args;
            if (!query) {
                return posts;
            }

        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id);
        },
    },
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('server is up and running')
})


/*

query {
  comments{
    id text
  }
}

query{
  comments{
    text
    author{
      name
    }
  }
  users{
    name
    comments{
      id text
    }
  }
}

query{
  comments{
    text
    author{
      name
    }
    post{
      title
    }
  }
}

query {
    posts {
      id
      title
      body
      published
      author{
         name 
      }
      comments{
        text id
        author{
          name
        }
      }
    }
  }

*/

  