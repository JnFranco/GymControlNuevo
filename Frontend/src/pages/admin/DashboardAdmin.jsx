import { useState } from 'react';
import { Box } from "@mui/material";
import SidebarAdmin from "./components/SidebarAdmin";
import DashboardHome from "./views/DashboardHome";
import RegisterUsuarios from "../Register"; // Tu componente de usuarios
import UsuariosView from './views/UsuariosView';
import EntrenadoresView from './views/EntrenadoresView';


export default function DashboardAdmin() {
  // Por defecto, la vista activa es 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#000', // Fondo negro total como la imagen
      color: 'white' 
    }}>
      {/* 1. MENÚ LATERAL (SIDEBAR) */}
      <SidebarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. ÁREA DE CONTENIDO DINÁMICO */}
      <Box sx={{ flexGrow: 1, p: 4, mt: 2 }}>
    {activeTab === 'dashboard' && <DashboardHome />}
    {activeTab === 'usuarios' && <UsuariosView />}
    {activeTab === 'entrenadores' && <EntrenadoresView />}
    </Box>


    </Box>
  );
}
// import { useState, useEffect } from "react";
// import { Box, Typography, Grid, Paper } from "@mui/material";
// import { gymTheme } from "../gymTheme";
// import { ThemeProvider } from "@mui/material/styles";
// import Layout from "../layouts/Layout";
// import PeopleIcon from "@mui/icons-material/People";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import api from "../api/axios";

// export default function DashboardAdmin() {
//     const [totales, setTotales] = useState({
//         clientes: 0,
//         ingresos: 0,
//         clasesHoy: 0
//     });

//     useEffect(() => {
//         const cargarTotales = async () => {
//             try {
//                 const res = await api.get("/admin/resumen");
//                 setTotales(res.data);
//             } catch (error) {
//                 console.error("Error cargando dashboard admin:", error);
//             }
//         };
//         cargarTotales();
//     }, []);

//     return (
//         <ThemeProvider theme={gymTheme}>
//             <Layout rol="Administrador">
//                 <Box sx={{ p: 4 }}>
//                     <Typography variant="h4" fontWeight={700} gutterBottom>
//                         Panel General del Gimnasio
//                     </Typography>

//                     <Grid container spacing={3}>
//                         <Grid item xs={12} md={4}>
//                             <Paper sx={{ p: 3, borderRadius: 4 }}>
//                                 <PeopleIcon fontSize="large" />
//                                 <Typography variant="h5" fontWeight={700}>{totales.clientes}</Typography>
//                                 <Typography>Clientes activos</Typography>
//                             </Paper>
//                         </Grid>

//                         <Grid item xs={12} md={4}>
//                             <Paper sx={{ p: 3, borderRadius: 4 }}>
//                                 <MonetizationOnIcon fontSize="large" />
//                                 <Typography variant="h5" fontWeight={700}>S/ {totales.ingresos}</Typography>
//                                 <Typography>Ingresos del mes</Typography>
//                             </Paper>
//                         </Grid>

//                         <Grid item xs={12} md={4}>
//                             <Paper sx={{ p: 3, borderRadius: 4 }}>
//                                 <EventAvailableIcon fontSize="large" />
//                                 <Typography variant="h5" fontWeight={700}>{totales.clasesHoy}</Typography>
//                                 <Typography>Clases programadas hoy</Typography>
//                             </Paper>
//                         </Grid>
//                     </Grid>
//                 </Box>
//             </Layout>
//         </ThemeProvider>
//     );
// }
