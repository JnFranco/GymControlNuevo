import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";

import {
  FitnessCenter,
  Dashboard,
  Schedule,
  CheckCircle,
  Group,
  Person,
  ExitToApp,  // 👈 AGREGADO
  Settings    // 👈 AGREGADO
} from "@mui/icons-material";

import "./InstructorLayout.css";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  // 👇 FUNCIÓN PARA ABRIR EL MENÚ DEL AVATAR
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 👇 FUNCIÓN PARA CERRAR EL MENÚ
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 👇 FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("correo");
    navigate("/");
  };

  return (
    <Box className="dashboard-container">
      {/* SIDEBAR COMPARTIDA */}
      <Box className="sidebar">
        <Box className="logo">
          <Avatar className="logo-icon">
            <FitnessCenter />
          </Avatar>
          <Typography variant="h6">GymControl</Typography>
        </Box>

        {/* DASHBOARD */}
        <Button
          className={`menu-button ${
            location.pathname === "/entrenador" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador")}
        >
          <Dashboard className="menu-icon" /> Dashboard
        </Button>

        {/* MIS CLASES */}
        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/mis-clases" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/mis-clases")}
        >
          <FitnessCenter className="menu-icon" /> Mis Clases
        </Button>

        {/* HORARIOS */}
        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/horarios" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/horarios")}
        >
          <Schedule className="menu-icon" /> Horarios
        </Button>

        {/* ASISTENCIAS */}
        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/asistencias" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/asistencias")}
        >
          <CheckCircle className="menu-icon" /> Asistencias
        </Button>

        {/* ALUMNOS */}
        <Button className="menu-button">
          <Group className="menu-icon" /> Alumnos
        </Button>

        {/* MI PERFIL */}
        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/perfil" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/perfil")}
        >
          <Person className="menu-icon" /> Mi Perfil
        </Button>



        {/* BOTÓN DE CERRAR SESIÓN EN EL SIDEBAR */}
        <Box sx={{ marginTop: 'auto', paddingTop: 2 }}>
          <Button
            className="menu-button logout-button"
            onClick={handleLogout}
            sx={{
              color: '#f44336 !important',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1) !important'
              }
            }}
          >
            <ExitToApp className="menu-icon" /> Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {/* CONTENIDO DINÁMICO */}
      <Box className="main-content">
        {/* HEADER */}
        <Box className="header">
          <Typography variant="h4" className="title">
            {usuario?.nombre ? `Hola, ${usuario.nombre}` : "Dashboard del Instructor"}
          </Typography>
          
          {/* AVATAR CON MENÚ DESPLEGABLE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' } }}>
              {usuario?.correo}
            </Typography>
            
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: '#ffd700', color: 'black', cursor: 'pointer' }}>
                {usuario?.nombre?.charAt(0) || "I"}
              </Avatar>
            </IconButton>

            {/* MENÚ DESPLEGABLE */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  background: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/entrenador/perfil");
                }}
              >
                <Person sx={{ mr: 1 }} /> Mi Perfil
              </MenuItem>


              <MenuItem onClick={handleMenuClose}>
                <Settings sx={{ mr: 1 }} /> Configuración
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: '#f44336',
                  '&:hover': { background: 'rgba(244, 67, 54, 0.1)' }
                }}
              >
                <ExitToApp sx={{ mr: 1 }} /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* AQUÍ SE RENDERIZA EL CONTENIDO DE CADA PÁGINA */}
        <Outlet />
      </Box>
    </Box>
  );
}

// import { useState, useEffect } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Avatar
// } from "@mui/material";

// import {
//   FitnessCenter,
//   Dashboard,
//   Schedule,
//   CheckCircle,
//   Group,
//   Person
// } from "@mui/icons-material";

// import "./InstructorLayout.css";

// export default function InstructorLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [usuario, setUsuario] = useState(null);

//   useEffect(() => {
//     const data = localStorage.getItem("usuario");
//     if (data) setUsuario(JSON.parse(data));
//   }, []);

//   return (
//     <Box className="dashboard-container">
//       {/* SIDEBAR COMPARTIDA */}
//       <Box className="sidebar">
//         <Box className="logo">
//           <Avatar className="logo-icon">
//             <FitnessCenter />
//           </Avatar>
//           <Typography variant="h6">GymControl</Typography>
//         </Box>

//         <Button
//           className={`menu-button ${
//             location.pathname === "/entrenador" ? "active" : ""
//           }`}
//           onClick={() => navigate("/entrenador")}
//         >
//           <Dashboard className="menu-icon" /> Dashboard
//         </Button>

//         <Button
//           className={`menu-button ${
//             location.pathname === "/entrenador/mis-clases" ? "active" : ""
//           }`}
//           onClick={() => navigate("/entrenador/mis-clases")}
//         >
//           <FitnessCenter className="menu-icon" /> Mis Clases
//         </Button>

//         <Button
//           className={`menu-button ${
//             location.pathname === "/entrenador/horarios" ? "active" : ""
//           }`}
//           onClick={() => navigate("/entrenador/horarios")}
//         >
//           <Schedule className="menu-icon" /> Horarios
//         </Button>
//         {/* <Button className="menu-button">
//           <Schedule className="menu-icon" /> Horarios
//         </Button> */}

//         <Button className="menu-button">
//           <CheckCircle className="menu-icon" /> Asistencias
//         </Button>

//         <Button className="menu-button">
//           <Group className="menu-icon" /> Alumnos
//         </Button>

//         <Button className="menu-button">
//           <Person className="menu-icon" /> Mi Perfil
//         </Button>
//       </Box>

//       {/* CONTENIDO DINÁMICO */}
//       <Box className="main-content">
//         {/* HEADER */}
//         <Box className="header">
//           <Typography variant="h4" className="title">
//             {usuario?.nombre ? `Hola, ${usuario.nombre}` : "Dashboard del Instructor"}
//           </Typography>
//           <Avatar>{usuario?.nombre?.charAt(0) || "I"}</Avatar>
//         </Box>

//         {/* AQUÍ SE RENDERIZA EL CONTENIDO DE CADA PÁGINA */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }