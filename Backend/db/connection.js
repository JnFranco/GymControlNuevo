const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3308,
  user: 'root',
  password: '',
  database: 'db_gimnasio',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err.message);
  } else {
    console.log('✅ Conexión exitosa a MySQL (pool)');
    connection.release();
  }
});

module.exports = pool.promise(); // 👈 aquí usamos promesas