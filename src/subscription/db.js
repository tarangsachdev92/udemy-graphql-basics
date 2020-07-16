
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


const db = {
    users, comments, posts
}

// export default db;
export { db as default };