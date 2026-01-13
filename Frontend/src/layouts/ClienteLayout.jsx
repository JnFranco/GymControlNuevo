import { Box } from "@mui/material";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#000",
        color: "white"
      }}
    >
      {sidebar}

      <Box sx={{ flexGrow: 1, p: 4, mt: 2 }}>
        {children}
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
