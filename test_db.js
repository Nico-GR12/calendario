const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });
    const conn = await pool.getConnection();
    console.log('connected');
    const [rows] = await conn.query('SELECT 1 as ok');
    console.log(rows);
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  }
})();