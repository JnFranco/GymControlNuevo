import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar
} from "@mui/material";

import {
  FitnessCenter,
  Dashboard,
  Schedule,
  CheckCircle,
  Group,
  Person
} from "@mui/icons-material";

import "./InstructorLayout.css";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

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

        <Button
          className={`menu-button ${
            location.pathname === "/entrenador" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador")}
        >
          <Dashboard className="menu-icon" /> Dashboard
        </Button>

        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/mis-clases" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/mis-clases")}
        >
          <FitnessCenter className="menu-icon" /> Mis Clases
        </Button>

        <Button
          className={`menu-button ${
            location.pathname === "/entrenador/horarios" ? "active" : ""
          }`}
          onClick={() => navigate("/entrenador/horarios")}
        >
          <Schedule className="menu-icon" /> Horarios
        </Button>
        {/* <Button className="menu-button">
          <Schedule className="menu-icon" /> Horarios
        </Button> */}

        <Button className="menu-button">
          <CheckCircle className="menu-icon" /> Asistencias
        </Button>

        <Button className="menu-button">
          <Group className="menu-icon" /> Alumnos
        </Button>

        <Button className="menu-button">
          <Person className="menu-icon" /> Mi Perfil
        </Button>
      </Box>

      {/* CONTENIDO DINÁMICO */}
      <Box className="main-content">
        {/* HEADER */}
        <Box className="header">
          <Typography variant="h4" className="title">
            {usuario?.nombre ? `Hola, ${usuario.nombre}` : "Dashboard del Instructor"}
          </Typography>
          <Avatar>{usuario?.nombre?.charAt(0) || "I"}</Avatar>
        </Box>

        {/* AQUÍ SE RENDERIZA EL CONTENIDO DE CADA PÁGINA */}
        <Outlet />
      </Box>
    </Box>
  );
}