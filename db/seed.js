const { 
    client,
    createUser,
    updateUser,
    getAllUsers,
} = require('./index');

async function dropTables() {

    try {
        console.log("Starting to drop tables ...");

    await client.query(`
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

        console.log(lilybloom)
        console.log(eliBiz)
        console.log(augustusWaters)

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error; 
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.error(error);
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

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