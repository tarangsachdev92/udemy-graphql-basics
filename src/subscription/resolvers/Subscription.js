const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;
            setInterval(() => {
                count++;
                pubsub.publish('count', { count });
            }, 1000);
            return pubsub.asyncIterator('count'); // channel name
        }
    },
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find(post => post.id === postId && post.published);
            if (!post) {
                throw new Error('Post not found!.')
            }
            // pubsub.publish('comment', { comment });
            return pubsub.asyncIterator(`comment ${postId}`); // comment 42 // channel name
        }
    },
    post: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            return pubsub.asyncIterator(`post`);// channel name
        }
    }
}

export { Subscription as default }


// subscription {
//     count
//   }