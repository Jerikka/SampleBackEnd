const { 
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
} = require('./index');

async function dropTables() {

    try {
        console.log("Starting to drop tables ...");

    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
    `)

    console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables :(");
        throw error;
    }
}

async function createTables() {
    try {

        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );

            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            )
        `);

        console.log("Finished building tables :) ")
    } catch (error) {
        console.log("Error building tables.. :( ")
        throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...!"); 

        const lilybloom = await createUser({ username: 'lilybloom', password: 'theFlowerShop', name:"Lily Bloom", location: "Boston"});
        const eliBiz = await createUser({ username: 'eliBiz', password: 'floating12!', name:"Biz", location: "Australia"});
        const augustusWaters = await createUser({ username: 'augustusWaters', password: 'HazelGrace12!', name: "Augustus Waters", location:"Indianapolis"})
        
        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error; 
    }
}

async function createInitialPosts() {
    try {
        const [lilybloom, eliBiz, augustusWaters] = await getAllUsers();

        console.log("Starting to create posts...")

        await createPost({
            authorId: lilybloom.id,
            title: "First Post",
            content: "This is my first post, happy to be here. Please check out my flower shop for bloggers in the Indianapolis area!"
        });

        await createPost({
            authorId: eliBiz.id,
            title: "Sharing My Story",
            content: "This blog will be about the story of me understanding my mental illness. I hope that I can share and someone doesn't have to experience what I went through to understand themselves."
        });

        await createPost({
            authorId: augustusWaters.id,
            title: "Smoking Kills, Cancer Does To",
            content: "This unfortunately will be my first & last post. I am starting to get extremely weak and I know that's never a good thing. To my love, if you ever see this, know that you were the best thing that ever happened to me, okay? Your Gus.."
        });

        console.log("Finished creating posts")
    } catch (error) {
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers")
        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on post[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "Domestic Awareness",
            content: "For anyone experiencing abuse (regardless of what type) from someone that claims that they love you, know that it is not love but manipulation & they do not love you."
        });
        console.log("Result:", updatePostResult);

        console.log("Calling getUserById with 1");
        const lilybloom = await getUserById(1);
        console.log("Result:", lilybloom);

        console.log("Finished database tests!")
    } catch (error) {
        console.error("Error testing database!")
        throw error; 
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());