const pg = require('pg');
const client = new pg.Client("postgres://localhost/the_acme_store");
const bcrypt = require('bcrypt');

const createTables = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL 
    );
    CREATE TABLE favorites(
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) NOT NULL ,
    user_id INT REFERENCES users(id) NOT NULL,
    CONSTRAINT unique_favorite UNIQUE (product_id, user_id)
    );
    `;
    
    await client.query(SQL);
    };
  
   
  const createUser = async({ username, password })=> {
    const SQL = `
      INSERT INTO users(username, password) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  }
   
  const createProduct = async({ name })=> {
    const SQL = `
      INSERT INTO products(name) VALUES($1) RETURNING *
    `;
    const response = await client.query(SQL, [name]);
    return response.rows[0];
  }

  const fetchUsers = async()=> {
    const SQL = `
      SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }
  
  const fetchProducts = async()=> {
    const SQL = `
      SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }

  const createfavorites = async({ user_id, product_id })=> {
    const SQL = `
      INSERT INTO favorites( user_id, product_id) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, product_id]);
    return response.rows[0];
  }

  const fetchfavorites = async(id)=> {
    const SQL = `
      SELECT * FROM favorites
      WHERE user_id = $1
    `;
    const response = await client.query(SQL, [ id ]);
    return response.rows;
  }

  //DELETE USER IS NOT WORKING
const deleteFavorites = async({id, user_id})=> {
    const SQL = `
      DELETE FROM favorites
      WHERE id = $1 AND user_id = $2
    `;
    await client.query(SQL, [ id, user_id ]);
  }

  const fetchUsersFavorites = async({user_id}) =>{
    const SQL = `
      SELECT * FROM favorites
      WHERE user_id = $1
    `;
    const response = await client.query(SQL, [ user_id ]);
    return response.rows;
  }

  
  
  
  module.exports = {
    client,
    createTables,
    createUser, 
    createProduct,
    fetchUsers,
    fetchProducts,
    createfavorites, 
    fetchfavorites,
    deleteFavorites,
    fetchUsersFavorites
  };