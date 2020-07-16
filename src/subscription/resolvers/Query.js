const Query = {
    users(parent, args, { db }, info) {
        const { query } = args;
        if (!query) {
            return db.users;
        }
        return db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    },
    posts(parent, args, { db }, info) {
        const { query } = args;
        if (!query) {
            return db.posts;
        }
        return db.posts.filter(post => {
            const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
            return isTitleMatch || isBodyMatch;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    },
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
    }
}

export { Query as default }