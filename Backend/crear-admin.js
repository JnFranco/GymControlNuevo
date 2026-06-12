const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'db_gimnasio',
  waitForConnections: true,
  connectionLimit: 10,
});

async function crearAdmin() {
  try {
    // 1. Verificar que exista el rol Administrador
    const [roles] = await pool.promise().query("SELECT * FROM roles WHERE nombre = 'Administrador'");

    let adminRoleId;
    if (roles.length === 0) {
      const [result] = await pool.promise().query(
        "INSERT INTO roles (nombre) VALUES ('Administrador')"
      );
      adminRoleId = result.insertId;
      console.log('✅ Rol Administrador creado con ID:', adminRoleId);
    } else {
      adminRoleId = roles[0].id;
      console.log('✅ Rol Administrador ya existe con ID:', adminRoleId);
    }

    // 2. Verificar si ya existe el usuario
    const [existing] = await pool.promise().query(
      "SELECT * FROM usuarios WHERE correo = 'jean@gmail.com'"
    );

    if (existing.length > 0) {
      console.log('⚠️ El usuario jean@gmail.com ya existe. Actualizando rol a Administrador...');
      await pool.promise().query(
        "UPDATE usuarios SET id_rol = ?, activo = 1 WHERE correo = 'jean@gmail.com'",
        [adminRoleId]
      );
      console.log('✅ Usuario actualizado como Administrador');
    } else {
      // 3. Crear el admin
      const hashedPassword = await bcrypt.hash('jean123', 10);
      await pool.promise().query(
        "INSERT INTO usuarios (nombre, apellido, correo, telefono, password, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['Jean', 'Admin', 'jean@gmail.com', '000-000-0000', hashedPassword, adminRoleId, 1]
      );
      console.log('✅ Usuario Administrador creado exitosamente');
    }

    console.log('\n🔐 Credenciales para login:');
    console.log('   Correo: jean@gmail.com');
    console.log('   Contraseña: jean123');
    console.log('   URL del login: http://localhost:5173');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

crearAdmin();
