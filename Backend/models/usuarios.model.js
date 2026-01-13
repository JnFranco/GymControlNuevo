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
    SELECT 
      u.id, u.nombre, u.apellido, u.correo, u.telefono, u.activo, u.id_rol,
      r.nombre AS rol,
      e.especialidad, e.descripcion 
    FROM usuarios u 
    LEFT JOIN roles r ON u.id_rol = r.id
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

// ✅ ACTUALIZAR USUARIO (DINÁMICO - solo actualiza los campos enviados)
async function actualizarUsuario(id, datos) {
  const campos = [];
  const valores = [];

  // Solo agregar los campos que vienen en datos
  if (datos.nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(datos.nombre);
  }
  if (datos.apellido !== undefined) {
    campos.push('apellido = ?');
    valores.push(datos.apellido);
  }
  if (datos.correo !== undefined) {
    campos.push('correo = ?');
    valores.push(datos.correo);
  }
  if (datos.telefono !== undefined) {
    campos.push('telefono = ?');
    valores.push(datos.telefono);
  }
  if (datos.password !== undefined) {
    campos.push('password = ?');
    valores.push(datos.password);
  }
  if (datos.id_rol !== undefined) {
    campos.push('id_rol = ?');
    valores.push(datos.id_rol);
  }
  if (datos.activo !== undefined) {
    campos.push('activo = ?');
    valores.push(datos.activo);
  }

  // Si no hay campos para actualizar
  if (campos.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  valores.push(id);

  const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
  const [result] = await db.query(query, valores);
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
// const db = require('../db/connection');

// // ✅ OBTENER TODOS LOS USUARIOS (Con Rol y Especialidad)
// async function obtenerUsuarios() {
//   const query = `
//     SELECT 
//       u.id, u.nombre, u.apellido, u.correo, u.telefono, u.activo, u.id_rol,
//       r.nombre AS rol,
//       e.especialidad, e.descripcion
//     FROM usuarios u
//     LEFT JOIN roles r ON u.id_rol = r.id
//     LEFT JOIN entrenadores e ON u.id = e.id_usuario
//     ORDER BY u.id DESC
//   `;
//   const [rows] = await db.query(query);
//   return rows;
// }

// // ✅ OBTENER USUARIO POR ID
// async function obtenerUsuarioPorId(id) {
//   const query = `
//     SELECT u.*, e.especialidad, e.descripcion 
//     FROM usuarios u 
//     LEFT JOIN entrenadores e ON u.id = e.id_usuario 
//     WHERE u.id = ?
//   `;
//   const [rows] = await db.query(query, [id]);
//   return rows[0];
// }

// // ✅ CREAR USUARIO (Usa Transacción para usuarios + entrenadores)
// async function crearUsuario(datos) {
//   const { 
//     nombre, apellido, correo, telefono, password, id_rol, activo, 
//     especialidad, descripcion 
//   } = datos;

//   const connection = await db.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     // 1. Insertar en la tabla principal 'usuarios'
//     const [userResult] = await connection.query(
//       'INSERT INTO usuarios (nombre, apellido, correo, telefono, password, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
//       [nombre, apellido, correo, telefono, password, id_rol, activo || 1]
//     );

//     const nuevoId = userResult.insertId;

//     // 2. Si el rol es Entrenador (ID 2), insertar en la tabla 'entrenadores'
//     if (Number(id_rol) === 2) {
//       await connection.query(
//         'INSERT INTO entrenadores (id_usuario, especialidad, descripcion) VALUES (?, ?, ?)',
//         [nuevoId, especialidad || null, descripcion || null]
//       );
//     }

//     await connection.commit();
//     return nuevoId;

//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// }

// // ✅ ACTUALIZAR USUARIO (Incluye campo activo)
// async function actualizarUsuario(id, datos) {
//   const { nombre, apellido, correo, telefono, id_rol, activo } = datos;
//   const [result] = await db.query(
//     'UPDATE usuarios SET nombre=?, apellido=?, correo=?, telefono=?, id_rol=?, activo=? WHERE id=?',
//     [nombre, apellido, correo, telefono, id_rol, activo, id]
//   );
//   return result.affectedRows;
// }

// // ✅ ELIMINAR USUARIO (Borrado físico)
// async function eliminarUsuario(id) {
//   const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
//   return result.affectedRows;
// }

// module.exports = { 
//   obtenerUsuarios, 
//   obtenerUsuarioPorId, 
//   crearUsuario, 
//   actualizarUsuario, 
//   eliminarUsuario 
// };
