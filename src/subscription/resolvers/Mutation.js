import uuidv4 from 'uuid/v4';


// Enum 
// 1. It is the special type that defines the constants
// 2. This type can than be used as the type for field (similar to scaler and custom object types)
// 3. Values for the field must be one of the constants for the type 

// User role - standart, editor, admin

// type User { 
// role : UserRole!
// }


// laptop.isOn - true / false
// laptop.powerStatus - on - off - sleep


const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(user => user.email === args.data.email);

        if (emailTaken) {
            throw new Error('Email Taken.')
        }
        // const { name, email, age } = args;
        // const user = { id: uuidv4(), name, email, age }
        const user = { id: uuidv4(), ...args.data }
        db.users.push(user)
        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);

        if (userIndex === -1) {
            throw new Error('User not found!.')
        }

        const deletedUsers = db.users.splice(userIndex, 1);
        db.posts = db.posts.filter(post => {
            const match = post.author === args.id;
            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match;
        });
        db.comments = db.comments.filter(comment => comment.author !== args.id)

        return deletedUsers[0];
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find(user => user.id === id);
        if (!user) {
            throw new Error('User not found!')
        }
        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email);

            if (emailTaken) {
                throw new Error('Email Taken.')
            }
            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age != 'undefined') {
            user.age = data.age;
        }
        return user;
    },
    createPost(parent, args, { pubsub, db }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);

        if (!userExists) {
            throw new Error('User not found!')
        }

        const post = { id: uuidv4(), ...args.data }
        db.posts.push(post)

        if (args.data.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "CREATED",
                    data: post
                }
            })
        }

        return post;
    },
    deletePost(parent, args, { pubsub, db }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);

        if (postIndex === -1) {
            throw new Error('Post not found!.')
        }

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const post = db.posts.find(user => user.id === id);
        const originalPost = { ...post };
        let updated = false // THIS IS NEW

        if (!post) {
            throw new Error('Post not found!')
        }
        if (typeof data.title === 'string') {
            post.title = data.title;
            updated = true // THIS IS NEW
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
            updated = true // THIS IS NEW
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: originalPost // old data because we don't want to leak the updated fields when delete (un publish)
                    }
                })
            } else if (!originalPost.published && post.published) {
                // created
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            } else if (post.published && updated) {
                // updated
                pubsub.publish('post', {
                    post: {
                        mutation: "UPDATED",
                        data: post
                    }
                })
            }
            // if old is true and new is true then no need to call update
        } else if (updated) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            })
        }
        return post;
    },
    createComment(parent, args, { pubsub, db }, info) {

        const userExists = db.users.some(user => user.id === args.data.author);
        const postExists = db.posts.some(post => post.id === args.data.post && post.published);

        if (!userExists || !postExists) {
            throw new Error('Unable to find a user and post!')
        }

        const comment = { id: uuidv4(), ...args.data }

        db.comments.push(comment)

        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: "CREATED", data: comment
            }
        });

        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error('Comment not found!.')
        }
        const [deletedComment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: "DELETED", data: deletedComment
            }
        });

        return deletedComment;
    },
    updateComment(parent, args, { pubsub, db }, info) {
        const { id, data } = args;
        const comment = db.comments.find(user => user.id === id);

        if (!comment) {
            throw new Error('Comment not found!')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: "UPDATED", data: comment
            }
        });
        return comment;
    }
}

export { Mutation as default }