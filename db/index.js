const { Client } = require("pg");

const client = new Client("postgress://localhost:5432/backend-dev");

async function getAllUsers() {
  const { rows } = await client.query(`
    SELECT id, username
    FROM users;
    `);

  return rows;
}

async function createUser({ username, password }) {
  const { rows } = await client.query(
    `
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
    [username, password]
  );

  return rows;
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
