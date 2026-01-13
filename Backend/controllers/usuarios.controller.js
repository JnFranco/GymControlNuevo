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
        console.log('🔍 Buscando usuario ID:', req.params.id);
        const usuario = await UsuariosModel.obtenerUsuarioPorId(req.params.id);
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        console.log('✅ Usuario encontrado:', usuario.nombre);
        res.json(usuario);
    } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
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

// ✅ Actualizar (MEJORADO - soporta actualización parcial y cambio de contraseña)
exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        console.log('📝 Actualizando usuario ID:', id);
        console.log('📝 Datos recibidos:', datos);

        // Si se envía una nueva contraseña, encriptarla
        if (datos.password && datos.password.trim() !== '') {
            console.log('🔐 Encriptando nueva contraseña...');
            const saltRounds = 10;
            datos.password = await bcrypt.hash(datos.password, saltRounds);
        } else {
            // Si no se envía contraseña o está vacía, no actualizar ese campo
            delete datos.password;
        }

        const updated = await UsuariosModel.actualizarUsuario(id, datos);
        
        if (updated === 0) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        console.log('✅ Usuario actualizado correctamente');
        res.json({ mensaje: 'Usuario actualizado correctamente' });
        
    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        res.status(500).json({ 
            mensaje: 'Error al actualizar usuario', 
            error: error.message 
        });
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
// const UsuariosModel = require('../models/usuarios.model');
// const db = require('../db/connection');
// const bcrypt = require('bcrypt');

// // ✅ Obtener todos
// exports.getUsuarios = async (req, res) => {
//     try {
//         const usuarios = await UsuariosModel.obtenerUsuarios();
//         res.json(usuarios);
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
//     }
// };

// // ✅ Obtener por ID
// exports.getUsuarioById = async (req, res) => {
//     try {
//         const usuario = await UsuariosModel.obtenerUsuarioPorId(req.params.id);
//         if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//         res.json(usuario);
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al obtener usuario', error });
//     }
// };

// // ✅ Crear con Clave Encriptada y Detalle de Entrenador
// exports.createUsuario = async (req, res) => {
//     try {
//         const { password, ...datosRestantes } = req.body;

//         // Encriptar contraseña
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Combinar datos con la clave encriptada
//         const payloadCompleto = { ...datosRestantes, password: hashedPassword };

//         // El modelo se encarga de repartir en las tablas usuarios y entrenadores
//         const id = await UsuariosModel.crearUsuario(payloadCompleto);
        
//         res.status(201).json({ id, mensaje: 'Usuario registrado exitosamente' });
//     } catch (error) {
//         console.error("Error al crear usuario:", error);
//         res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
//     }
// };

// // ✅ Actualizar
// exports.updateUsuario = async (req, res) => {
//     try {
//         const updated = await UsuariosModel.actualizarUsuario(req.params.id, req.body);
//         if (updated === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//         res.json({ mensaje: 'Usuario actualizado correctamente' });
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al actualizar usuario', error });
//     }
// };

// // ✅ Eliminar
// exports.deleteUsuario = async (req, res) => {
//     try {
//         const deleted = await UsuariosModel.eliminarUsuario(req.params.id);
//         if (deleted === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//         res.json({ mensaje: 'Usuario eliminado de la base de datos' });
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
//     }
// };

// // ✅ Login
// exports.login = async (req, res) => {
//     const { correo, password } = req.body;
//     try {
//         const [rows] = await db.execute(
//             `SELECT u.*, r.nombre AS rol 
//              FROM usuarios u 
//              INNER JOIN roles r ON u.id_rol = r.id 
//              WHERE u.correo = ? AND u.activo = 1`,
//             [correo]
//         );

//         if (rows.length === 0) {
//             return res.status(401).json({ mensaje: "Usuario no encontrado o inactivo" });
//         }

//         const usuario = rows[0];
//         const match = await bcrypt.compare(password, usuario.password);

//         if (!match) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

//         delete usuario.password;
//         res.json(usuario); 
//     } catch (error) {
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// };