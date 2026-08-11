# 💪 GymControl

Sistema de gestión para gimnasios desarrollado como **Proyecto de Investigación de Sistemas (PIS)**. Permite administrar usuarios, entrenadores, clases, horarios, reservas, asistencias, pagos, membresías y reportes, con paneles diferenciados para **Administrador**, **Cliente** e **Instructor**.

## ✨ Funcionalidades

### 👨‍💼 Administrador
- Dashboard con estadísticas (ingresos, reservas, membresías).
- CRUD de usuarios, entrenadores, membresías, clases y horarios.
- Gestión de reservas, pagos y asistencias.
- Reportes en PDF y Excel.
- **Configuración del sistema**: nombre del gimnasio, cupos por clase, máximo de reservas por cliente, horas límite para cancelar, activar/desactivar reservas y pagos, **forzar cambio de contraseña** y **tiempo de sesión**.

### 🏋️ Cliente
- Inicio con resumen personal (membresía, días restantes, próxima clase).
- Explorar y **reservar clases** (validación de cupos y límites).
- Ver y cancelar **mis reservas**.
- Gestionar **pagos** de membresía.
- Registrar y ver **progreso** (peso, medidas, etc.).
- Editar perfil y **cambiar contraseña**.

### 🎽 Instructor
- Dashboard con clases del día y alumnos.
- Consultar **alumnos** asignados.
- Marcar **asistencias**.
- Ver sus **horarios** y clases asignadas.

### ⚙️ General
- Autenticación por roles (JWT).
- Notificaciones visuales (Snackbar) en toda la aplicación.
- Cambio de contraseña obligatorio al inicio de sesión (política configurable).
- Sesión con expiración automática configurable.
- Interfaz responsive con Material UI.

## 🧱 Tecnologías

| Capa      | Tecnologías |
|-----------|-------------|
| Frontend  | React 19, Vite 7, Material UI 7, Axios, Recharts, jsPDF, React Router 7 |
| Backend   | Node.js, Express 5, MySQL 2, bcrypt, dotenv |
| Base de datos | MySQL (MariaDB compatible) |
| Pruebas   | Jest (backend y frontend) |

## 📁 Estructura del proyecto

```
GymControlNuevo/
├── Backend/                  # API REST (Express)
│   ├── controllers/          # Lógica de negocio por módulo
│   ├── models/               # Consultas a MySQL
│   ├── routes/               # Definición de rutas
│   ├── middleware/           # Autenticación JWT
│   ├── db/connection.js      # Conexión a la base de datos
│   ├── __tests__/            # Pruebas unitarias del backend
│   └── index.js              # Punto de entrada del servidor
├── Frontend/                 # Aplicación web (React + Vite)
│   └── src/
│       ├── api/              # Cliente Axios
│       ├── components/       # Componentes compartidos
│       ├── layouts/          # Layouts por rol
│       ├── pages/            # Vistas por rol (admin, cliente, instructor)
│       ├── routes/           # Rutas protegidas
│       ├── services/         # Servicios API (instructor)
│       ├── __tests__/        # Pruebas unitarias del frontend
│       └── main.jsx          # Punto de entrada de React
└── EvidenciasQA/             # Evidencias de pruebas QA
```

## 🚀 Puesta en marcha

### Requisitos previos
- **Node.js** 18 o superior.
- **MySQL** 8 o MariaDB corriendo en `localhost:3306`.

### 1. Base de datos

Crea la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS db_gimnasio;
```

> **Nota:** El backend crea automáticamente la tabla `config_sistema` al iniciar. Las demás tablas (`usuarios`, `roles`, `clases`, `horarios`, `reservas`, `pagos`, `membresias`, `asistencias`, `entrenadores`) deben existir con su esquema correspondiente según el diseño del proyecto.

La conexión está configurada en `Backend/db/connection.js` (usuario `root`, sin contraseña, base `db_gimnasio`). Ajusta los valores según tu entorno:

```js
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'db_gimnasio',
});
```

### 2. Backend

```bash
cd Backend
npm install
npm run dev        # con nodemon (desarrollo)
# o
npm start          # producción
```

El servidor arranca en **http://localhost:3001**.

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

La aplicación arranca en **http://localhost:5173**.

## 🔑 Credenciales de prueba

Todas las contraseñas fueron restablecidas a **`123456`**.

| Rol          | Correo          | Contraseña |
|--------------|-----------------|------------|
| Administrador| `jean@gmail.com`| `123456`   |
| Entrenador   | `juan@test.com` | `123456`   |
| Cliente      | `pedro@gym.com` | `123456`   |

> Si la política **"Forzar cambio de contraseña"** está activa, el sistema pedirá un cambio de contraseña al iniciar sesión.

## 🧪 Pruebas

El proyecto incluye pruebas unitarias (PU-01 a PU-10) para backend y frontend.

```bash
# Backend
cd Backend
npm test

# Frontend
cd Frontend
npm test
```

## 🔌 Principales endpoints de la API

| Método | Ruta                          | Descripción                        |
|--------|-------------------------------|------------------------------------|
| POST   | `/api/usuarios/login`         | Iniciar sesión (JWT)               |
| GET    | `/api/config`                 | Obtener configuración del sistema  |
| PUT    | `/api/config`                 | Actualizar configuración           |
| GET    | `/api/admin/dashboard`        | Estadísticas del panel admin       |
| GET    | `/api/admin/usuarios`         | Listar usuarios                    |
| GET    | `/api/admin/entrenadores`     | Listar entrenadores                |
| GET    | `/api/membresias`             | Listar membresías                  |
| GET    | `/api/clases`                 | Listar clases                      |
| GET    | `/api/horarios`               | Listar horarios                    |
| POST   | `/api/reservas`               | Crear reserva                      |
| GET    | `/api/mis-reservas`           | Reservas del cliente               |
| GET    | `/api/mi-membresia`           | Membresía del cliente              |
| GET    | `/api/mi-progreso`            | Progreso del cliente               |
| POST   | `/api/pagos`                  | Registrar pago                     |
| GET    | `/api/asistencias`            | Listar asistencias                 |
| POST   | `/api/asistencias`            | Registrar asistencia               |
| GET    | `/api/mis-clases`             | Clases del instructor              |
| POST   | `/api/usuarios/cambiar-password` | Cambiar contraseña propia       |

## 👥 Autor

- **Jean Franco Colque Galindo** — Proyecto de Investigación de Sistemas.
