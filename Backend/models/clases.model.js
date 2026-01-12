const db = require("../db/connection");

// =======================================================
// ✅ OBTENER CLASES (CON HORARIOS Y CUPOS DISPONIBLES)
// =======================================================
async function obtenerClases() {
  const [rows] = await db.execute(`
    SELECT
      c.id,
      c.nombre,
      c.cupos,
      c.activo,
      CONCAT(u.nombre, ' ', u.apellido) AS entrenador,
      h.dia_semana,
      h.hora_inicio,
      h.hora_fin,
      (c.cupos - COUNT(r.id)) AS cupos_disponibles
    FROM clases c
    LEFT JOIN usuarios u ON c.id_entrenador = u.id
    LEFT JOIN horarios h ON h.id_clase = c.id
    LEFT JOIN reservas r 
      ON r.id_horario = h.id AND r.estado = 'Confirmada'
    GROUP BY c.id, h.id
    ORDER BY c.nombre, h.dia_semana, h.hora_inicio
  `);

  return rows;
}

// =======================================================
// ✅ OBTENER CLASE POR ID
// =======================================================
async function obtenerClasePorId(id) {
  const [rows] = await db.query(
    "SELECT * FROM clases WHERE id = ?",
    [id]
  );
  return rows[0];
}

// =======================================================
// ✅ CREAR CLASE
// =======================================================
async function crearClase({ nombre, descripcion, id_entrenador }) {
  const [result] = await db.query(
    "INSERT INTO clases (nombre, descripcion, id_entrenador) VALUES (?, ?, ?)",
    [nombre, descripcion, id_entrenador]
  );
  return result.insertId;
}

// =======================================================
// ✅ ACTUALIZAR CLASE (PARCIAL, SEGURO)
// =======================================================
async function actualizarClase(id, data) {
  const campos = [];
  const valores = [];

  if (data.nombre !== undefined) {
    campos.push("nombre = ?");
    valores.push(data.nombre);
  }

  if (data.descripcion !== undefined) {
    campos.push("descripcion = ?");
    valores.push(data.descripcion);
  }

  if (data.id_entrenador !== undefined) {
    campos.push("id_entrenador = ?");
    valores.push(data.id_entrenador);
  }

  if (data.cupos !== undefined) {
    campos.push("cupos = ?");
    valores.push(data.cupos);
  }

  if (data.activo !== undefined) {
    campos.push("activo = ?");
    valores.push(data.activo);
  }

  if (campos.length === 0) return 0;

  const [result] = await db.query(
    `UPDATE clases SET ${campos.join(", ")} WHERE id = ?`,
    [...valores, id]
  );

  return result.affectedRows;
}

// =======================================================
// ✅ ELIMINAR CLASE
// =======================================================
async function eliminarClase(id) {
  const [result] = await db.query(
    "DELETE FROM clases WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}

async function crearHorario({ id_clase, dia_semana, hora_inicio, hora_fin, capacidad }) {
  await db.query(
    `INSERT INTO horarios (id_clase, dia_semana, hora_inicio, hora_fin, capacidad)
    VALUES (?, ?, ?, ?, ?)`,
    [id_clase, dia_semana, hora_inicio, hora_fin, capacidad]
  );
}

// =======================================================
// ✅ OBTENER CLASES POR INSTRUCTOR
// =======================================================
async function obtenerClasesPorInstructor(id_entrenador) {
  const [rows] = await db.query(
    `
    SELECT 
      c.id,
      c.nombre,
      c.descripcion,
      c.cupos,
      c.id_entrenador,
      c.activo
    FROM clases c
    WHERE c.id_entrenador = ?
    ORDER BY c.nombre ASC
    `,
    [id_entrenador]
  );

  return rows;
}

async function actualizarHorarioPorClase({ id_clase, dia_semana, hora_inicio, hora_fin }) {
  await db.query(
    `UPDATE horarios
    SET dia_semana = ?, hora_inicio = ?, hora_fin = ?
    WHERE id_clase = ?`,
    [dia_semana, hora_inicio, hora_fin, id_clase]
  );
}

// ❌ Eliminar todos los horarios de una clase
async function eliminarHorariosPorClase(id_clase) {
  await db.query(
    "DELETE FROM horarios WHERE id_clase = ?",
    [id_clase]
  );
}

// ✅ Crear horario
async function crearHorario({ id_clase, dia_semana, hora_inicio, hora_fin, capacidad }) {
  await db.query(
    `
    INSERT INTO horarios (id_clase, dia_semana, hora_inicio, hora_fin, capacidad)
    VALUES (?, ?, ?, ?, ?)
    `,
    [id_clase, dia_semana, hora_inicio, hora_fin, capacidad]
  );
}

// 🔍 Verificar cruce de horarios para un entrenador (con detalle)
async function existeCruceHorario({
  id_entrenador,
  dia_semana,
  hora_inicio,
  hora_fin,
  id_clase_excluir = null
}) {
  const [rows] = await db.query(
    `
    SELECT 
      h.dia_semana,
      h.hora_inicio,
      h.hora_fin,
      c.nombre AS nombre_clase
    FROM horarios h
    INNER JOIN clases c ON c.id = h.id_clase
    WHERE c.id_entrenador = ?
      AND h.dia_semana = ?
      AND (? < h.hora_fin AND ? > h.hora_inicio)
      ${id_clase_excluir ? "AND c.id <> ?" : ""}
    LIMIT 1
    `,
    id_clase_excluir
      ? [id_entrenador, dia_semana, hora_inicio, hora_fin, id_clase_excluir]
      : [id_entrenador, dia_semana, hora_inicio, hora_fin]
  );

  return rows.length > 0 ? rows[0] : null;
}



// =======================================================
// ✅ EXPORTS (FORMA CORRECTA)
// =======================================================
module.exports = {
  obtenerClases,
  obtenerClasePorId,
  obtenerClasesPorInstructor,
  crearClase,
  actualizarClase,
  eliminarClase,
  crearHorario,
  actualizarHorarioPorClase,
  crearHorario,
  eliminarHorariosPorClase,
  existeCruceHorario
};
