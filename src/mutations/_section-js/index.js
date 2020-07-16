import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4';
// import { v4 } from 'uuid'

// Scaler types: String, Boolean, Int, Float, ID
// Non Scaler types: Object and Array

// Demo user data 
let users = [{
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

let posts = [{
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

let comments = [{
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

// type Mutation {
//     createUser(name: String!, email: String!, age:Int): User!
//     createPost(title: String!, body: String, published: Boolean!, author: ID!): Post!
//     createComment(text: String!, author: ID!, post: ID!): Comment!
// }

// Type definition(schema)
const typeDefs = `

    type Query {
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        comments(query:String): [Comment!]!
        post : Post!
        me: User!
    }

    type Mutation {
        createUser(data: createUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: createPostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: createCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input createUserInput {
        name: String!
        email: String!
        age:Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    input createPostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    input createCommentInput{
        text: String! 
        author: ID! 
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email);

            if (emailTaken) {
                throw new Error('Email Taken.')
            }
            // const { name, email, age } = args;
            // const user = { id: uuidv4(), name, email, age }
            const user = { id: uuidv4(), ...args.data }
            users.push(user)
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id);

            if (userIndex === -1) {
                throw new Error('User not found!.')
            }

            const deletedUsers = users.splice(userIndex, 1);
            posts = posts.filter(post => {
                const match = post.author === args.id;
                if (match) {
                    comments = comments.filter(comment => comment.post !== post.id)
                }
                return !match;
            });
            comments = comments.filter(comment => comment.author !== args.id)

            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);

            if (!userExists) {
                throw new Error('User not found!')
            }

            const post = { id: uuidv4(), ...args.data }
            posts.push(post)
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id);

            if (postIndex === -1) {
                throw new Error('Post not found!.')
            }

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter(comment => comment.post !== args.id)

            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {

            const userExists = users.some(user => user.id === args.data.author);
            const postExists = posts.some(post => post.id === args.data.post && post.published);

            if (!userExists || !postExists) {
                throw new Error('Unable to find a user and post!')
            }

            const comment = { id: uuidv4(), ...args.data }

            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error('Comment not found!.')
            }
            const deletedComments = comments.splice(commentIndex, 1);
            return deletedComments[0];
        },
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('server is up and running')
})
