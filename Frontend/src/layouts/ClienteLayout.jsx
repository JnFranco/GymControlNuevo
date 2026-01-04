import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Avatar
} from "@mui/material";

import {
  FitnessCenter,
  Home,
  CalendarToday,
  TrendingUp,
  Payments,
  Person,
  Logout
} from "@mui/icons-material";

import "./ClienteLayout.css";

export default function ClienteLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/cliente" },
    { text: "Clases", icon: <CalendarToday />, path: "/cliente/clases" },
    { text: "Mi Progreso", icon: <TrendingUp />, path: "/cliente/progreso" },
    { text: "Pagos", icon: <Payments />, path: "/cliente/pagos" },
    { text: "Perfil", icon: <Person />, path: "/cliente/perfil" },
  ];

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box className="dashboard-container">
      
      {/* SIDEBAR */}
      <Box className="sidebar">

        {/* LOGO (MISMO QUE INSTRUCTOR) */}
        <Box className="logo">
          <Avatar className="logo-icon">
            <FitnessCenter />
          </Avatar>
          <Typography variant="h6">GymControl</Typography>
        </Box>

        {/* MENÚ */}
        {menuItems.map((item) => (
          <Button
            key={item.text}
            startIcon={item.icon}
            className={`menu-button ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.text}
          </Button>
        ))}

        {/* CERRAR SESIÓN */}
        <Button
          startIcon={<Logout />}
          className="menu-button logout-button"
          onClick={cerrarSesion}
          sx={{ mt: "auto" }}
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* CONTENIDO */}
      <Box className="main-content">
        <Outlet />
      </Box>
    </Box>
  );
}


// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import "./ClienteLayout.css";

// export default function ClienteLayout() {
//   const navigate = useNavigate();

//   const cerrarSesion = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("usuario");
//     navigate("/");
//   };

//   return (
//     <div className="cliente-layout">
      
//       {/* SIDEBAR */}
//       <aside className="cliente-sidebar">
//         <h2 className="logo">🏋️ Gym</h2>

//         <nav>
//           <NavLink to="/cliente" end>🏠 Inicio</NavLink>
//           <NavLink to="/cliente/clases">📅 Clases</NavLink>
//           <NavLink to="/cliente/progreso">📈 Mi Progreso</NavLink>
//           <NavLink to="/cliente/pagos">💳 Pagos</NavLink>
//           <NavLink to="/cliente/perfil">👤 Perfil</NavLink>
//         </nav>

//         <button className="logout-btn" onClick={cerrarSesion}>
//           🚪 Cerrar Sesión
//         </button>
//       </aside>

//       {/* CONTENIDO */}
//       <main className="cliente-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
