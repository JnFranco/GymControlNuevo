const db = require('../db/connection');

// ✅ OBTENER TODOS LOS USUARIOS (Con Rol y Especialidad)
async function obtenerUsuarios() {
  const query = `
    SELECT 
      u.id, u.nombre, u.apellido, u.correo, u.telefono, u.activo, u.id_rol,
      r.nombre AS rol,
      e.especialidad, e.descripcion
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id
    LEFT JOIN entrenadores e ON u.id = e.id_usuario
    ORDER BY u.id DESC
  `;
  const [rows] = await db.query(query);
  return rows;
}

// ✅ OBTENER USUARIO POR ID
async function obtenerUsuarioPorId(id) {
  const query = `
    SELECT u.*, e.especialidad, e.descripcion 
    FROM usuarios u 
    LEFT JOIN entrenadores e ON u.id = e.id_usuario 
    WHERE u.id = ?
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
}

// ✅ CREAR USUARIO (Usa Transacción para usuarios + entrenadores)
async function crearUsuario(datos) {
  const { 
    nombre, apellido, correo, telefono, password, id_rol, activo, 
    especialidad, descripcion 
  } = datos;

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Insertar en la tabla principal 'usuarios'
    const [userResult] = await connection.query(
      'INSERT INTO usuarios (nombre, apellido, correo, telefono, password, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, correo, telefono, password, id_rol, activo || 1]
    );

    const nuevoId = userResult.insertId;

    // 2. Si el rol es Entrenador (ID 2), insertar en la tabla 'entrenadores'
    if (Number(id_rol) === 2) {
      await connection.query(
        'INSERT INTO entrenadores (id_usuario, especialidad, descripcion) VALUES (?, ?, ?)',
        [nuevoId, especialidad || null, descripcion || null]
      );
    }

    await connection.commit();
    return nuevoId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ✅ ACTUALIZAR USUARIO (Incluye campo activo)
async function actualizarUsuario(id, datos) {
  const { nombre, apellido, correo, telefono, id_rol, activo } = datos;
  const [result] = await db.query(
    'UPDATE usuarios SET nombre=?, apellido=?, correo=?, telefono=?, id_rol=?, activo=? WHERE id=?',
    [nombre, apellido, correo, telefono, id_rol, activo, id]
  );
  return result.affectedRows;
}

// ✅ ELIMINAR USUARIO (Borrado físico)
async function eliminarUsuario(id) {
  const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
};
