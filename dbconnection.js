const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'HGtht34@rf7T',
  port: 5432, 
});

pool.query(' SELECT * from item;', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database:', res.rows[0].now);
  }
});
