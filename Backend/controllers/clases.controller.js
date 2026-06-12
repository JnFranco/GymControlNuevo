const ClasesModel = require('../models/clases.model');

// ✅ Obtener todas las clases
exports.getClases = async (req, res) => {
  try {
    const clases = await ClasesModel.obtenerClases();
    res.json(clases);
  } catch (error) {
    console.error('❌ Error al obtener clases:', error);
    res.status(500).json({ mensaje: 'Error al obtener clases', error });
  }
};

// ✅ Obtener clase por ID
exports.getClaseById = async (req, res) => {
  try {
    const clase = await ClasesModel.obtenerClasePorId(req.params.id);
    if (!clase) return res.status(404).json({ mensaje: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clase', error });
  }
};

// ✅ Crear clase
exports.createClase = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const {
      nombre,
      descripcion,
      id_entrenador,
      cupos,
      dias,            // 👈 ahora usamos dias (array)
      hora_inicio,
      hora_fin
    } = req.body;

    if (
      !nombre ||
      !id_entrenador ||
      !Array.isArray(dias) ||
      dias.length === 0 ||
      !hora_inicio ||
      !hora_fin
    ) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    for (const dia of dias) {
      const cruce = await ClasesModel.existeCruceHorario({
        id_entrenador,
        dia_semana: dia,
        hora_inicio,
        hora_fin
      });

      if (cruce) {
        return res.status(409).json({
          mensaje: `Conflicto de horario\n\nEl entrenador ya tiene una clase asignada:\n• Clase: ${cruce.nombre_clase}\n• ${cruce.dia_semana}\n• ${cruce.hora_inicio.slice(0,5)} – ${cruce.hora_fin.slice(0,5)}`
        });
      }
    }

    // 1️⃣ Crear la clase
    const idClase = await ClasesModel.crearClase({
      nombre,
      descripcion,
      id_entrenador,
      cupos
    });

    // 2️⃣ Crear UN horario POR CADA DÍA
    for (const dia of dias) {
      await ClasesModel.crearHorario({
        id_clase: idClase,
        dia_semana: dia,
        hora_inicio,
        hora_fin,
        capacidad: cupos
      });
    }

    res.status(201).json({ mensaje: "Clase y horarios creados correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear clase" });
  }
};



// ✅ Actualizar clase
exports.updateClase = async (req, res) => {
  try {
    const idClase = req.params.id;

    // Verificar que la clase existe
    const claseExistente = await ClasesModel.obtenerClasePorId(idClase);
    if (!claseExistente) {
      return res.status(404).json({ mensaje: 'Clase no encontrada' });
    }

    const {
      nombre,
      descripcion,
      id_entrenador,
      cupos,
      dias,              // 👈 array
      hora_inicio,
      hora_fin,
      activo
    } = req.body;

    // 1️⃣ Actualizar datos base de la clase
    await ClasesModel.actualizarClase(idClase, {
      nombre,
      descripcion,
      id_entrenador,
      cupos,
      activo
    });

    // 2️⃣ Si vienen días y horas, actualizamos horarios
    if (
      Array.isArray(dias) &&
      dias.length > 0 &&
      hora_inicio &&
      hora_fin
    ) {

    for (const dia of dias) {
      const cruce = await ClasesModel.existeCruceHorario({
        id_entrenador,
        dia_semana: dia,
        hora_inicio,
        hora_fin,
        id_clase_excluir: idClase
      });

      if (cruce) {
        return res.status(409).json({
          mensaje: `⚠️ Conflicto de horario\n\nEl entrenador ya tiene una clase asignada:\n• Clase: ${cruce.nombre_clase}\n• ${cruce.dia_semana}\n• ${cruce.hora_inicio.slice(0,5)} – ${cruce.hora_fin.slice(0,5)}`
        });
      }
    }

  
      // ❌ eliminar horarios antiguos
      await ClasesModel.eliminarHorariosPorClase(idClase);

      // ✅ crear nuevos horarios
      for (const dia of dias) {
        await ClasesModel.crearHorario({
          id_clase: idClase,
          dia_semana: dia,
          hora_inicio,
          hora_fin,
          capacidad: cupos
        });
      }
    }

    res.json({ mensaje: "Clase y horarios actualizados correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar clase:", error);
    res.status(500).json({ mensaje: "Error al actualizar clase" });
  }
};




// ✅ Eliminar clase
exports.deleteClase = async (req, res) => {
  try {
    const deleted = await ClasesModel.eliminarClase(req.params.id);
    if (deleted === 0) return res.status(404).json({ mensaje: 'Clase no encontrada' });
    res.json({ mensaje: 'Clase eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar clase', error });
  }
};

// ✅ NUEVO: Obtener clases por instructor
exports.getClasesPorInstructor = async (req, res) => {
  try {
    const { id_entrenador } = req.params;
    const clases = await ClasesModel.obtenerClasesPorInstructor(id_entrenador);
    res.json(clases);
  } catch (error) {
    console.error('❌ Error al obtener clases del instructor:', error);
    res.status(500).json({ mensaje: 'Error al obtener clases del instructor', error });
  }
};

exports.getMisClases = async (req, res) => {
  try {
    const idInstructor = req.user.id; // ← desde token

    const clases = await ClasesModel.obtenerClasesPorInstructor(idInstructor);
    res.json(clases);
  } catch (error) {
    console.error('❌ Error al obtener mis clases:', error);
    res.status(500).json({ mensaje: 'Error al obtener mis clases' });
  }
};
