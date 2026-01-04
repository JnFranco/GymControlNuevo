require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// =============================================
// MIDDLEWARES
// =============================================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Public', 'uploads')));

// =============================================
// IMPORTAR RUTAS
// =============================================

// 🔐 ADMIN
const adminRoutes = require('./routes/admin.routes');
const pagosRoutes = require('./routes/pagos.routes');

// 📦 BACKEND BASE
const rolesRoutes = require('./routes/roles.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const clasesRoutes = require('./routes/clases.routes');
const horariosRoutes = require('./routes/horarios.routes');
const reservasRoutes = require('./routes/reservas.routes');
const asistenciasRoutes = require('./routes/asistencias.routes');

const alumnosRoutes = require('./routes/alumnos.routes');

// 👤 DASHBOARD CLIENTE / INSTRUCTOR
const misClasesRoutes = require('./routes/mis-clases.routes');
const misReservasRoutes = require('./routes/mis-reservas.routes');
const miMembresiaRoutes = require('./routes/mi-membresia.routes');

// =============================================
// USAR RUTAS (ORDEN Y PREFIJOS CORRECTOS)
// =============================================

// 👉 ADMIN (prefijo explícito)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/pagos', pagosRoutes);

// 👉 API BASE
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/alumnos', alumnosRoutes);

// const alumnosRoutes = require('./routes/alumnos.routes');
// 👉 CLIENTE / INSTRUCTOR
app.use('/api', misClasesRoutes);
app.use('/api', misReservasRoutes);
app.use('/api', miMembresiaRoutes);

// =============================================
// RUTA BASE
// =============================================
app.get('/', (req, res) => {
  res.send('API funcionando correctamente.');
});

// =============================================
// MANEJO DE ERRORES
// =============================================
app.use((err, req, res, next) => {
  console.error('❌ Error interno del servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// =============================================
// INICIO DEL SERVIDOR
// =============================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// const adminRoutes = require('./routes/admin.routes');
// const pagosRoutes = require('./routes/pagos.routes');


// // =============================================
// // MIDDLEWARES
// // =============================================
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'Public', 'uploads')));

// // ⭐ RUTAS ADMIN DASHBOARD
// app.use('/api', adminRoutes);
// app.use('/api', pagosRoutes);


// // =============================================
// // IMPORTAR RUTAS BACKEND BÁSICAS
// // =============================================
// const rolesRoutes = require('./routes/roles.routes');
// const usuariosRoutes = require('./routes/usuarios.routes');
// const clasesRoutes = require('./routes/clases.routes');
// const horariosRoutes = require('./routes/horarios.routes');
// const reservasRoutes = require('./routes/reservas.routes');
// const asistenciasRoutes = require('./routes/asistencias.routes');

// // =============================================
// // IMPORTAR RUTAS DEL DASHBOARD CLIENTE
// // =============================================
// const misClasesRoutes = require('./routes/mis-clases.routes');
// const misReservasRoutes = require('./routes/mis-reservas.routes');
// const miMembresiaRoutes = require('./routes/mi-membresia.routes');

// // =============================================
// // USAR TODAS LAS RUTAS
// // =============================================
// app.use('/api/roles', rolesRoutes);
// app.use('/api/usuarios', usuariosRoutes);
// app.use('/api/clases', clasesRoutes);
// app.use('/api/horarios', horariosRoutes);
// app.use('/api/reservas', reservasRoutes);
// app.use('/api/asistencias', asistenciasRoutes);

// // ⭐ LAS RUTAS NUEVAS VAN AQUI
// app.use('/api', misClasesRoutes);
// app.use('/api', misReservasRoutes);
// app.use('/api', miMembresiaRoutes);

// // =============================================
// // RUTA BASE
// // =============================================
// app.get('/', (req, res) => {
//   res.send('API funcionando correctamente.');
// });

// // =============================================
// // MANEJO DE ERRORES
// // =============================================
// app.use((err, req, res, next) => {
//   console.error('❌ Error interno del servidor:', err.stack);
//   res.status(500).json({ error: 'Error interno del servidor' });
// });

// // =============================================
// // INICIO DEL SERVIDOR (AL FINAL)
// // =============================================
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
// });
