const UsuariosModel = require('../models/usuarios.model');
const db = require('../db/connection');
const bcrypt = require('bcrypt');

// ✅ Obtener todos
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuariosModel.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
    }
};

// ✅ Obtener por ID
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await UsuariosModel.obtenerUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuario', error });
    }
};

// ✅ Crear con Clave Encriptada y Detalle de Entrenador
exports.createUsuario = async (req, res) => {
    try {
        const { password, ...datosRestantes } = req.body;

        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Combinar datos con la clave encriptada
        const payloadCompleto = { ...datosRestantes, password: hashedPassword };

        // El modelo se encarga de repartir en las tablas usuarios y entrenadores
        const id = await UsuariosModel.crearUsuario(payloadCompleto);
        
        res.status(201).json({ id, mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
    }
};

// ✅ Actualizar
exports.updateUsuario = async (req, res) => {
    try {
        const updated = await UsuariosModel.actualizarUsuario(req.params.id, req.body);
        if (updated === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error });
    }
};

// ✅ Eliminar
exports.deleteUsuario = async (req, res) => {
    try {
        const deleted = await UsuariosModel.eliminarUsuario(req.params.id);
        if (deleted === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado de la base de datos' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
    }
};

// ✅ Login
exports.login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const [rows] = await db.execute(
            `SELECT u.*, r.nombre AS rol 
             FROM usuarios u 
             INNER JOIN roles r ON u.id_rol = r.id 
             WHERE u.correo = ? AND u.activo = 1`,
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: "Usuario no encontrado o inactivo" });
        }

        const usuario = rows[0];
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        delete usuario.password;
        res.json(usuario); 
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};