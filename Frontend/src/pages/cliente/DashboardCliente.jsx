import { useState } from "react";
import { Box } from "@mui/material";

import SidebarCliente from "./components/SidebarCliente";

// Vistas del cliente
import InicioView from "./views/InicioView";
import ClasesView from "./views/ClasesView";
import ProgresoView from "./views/ProgresoView";
import PagosView from "./views/PagosView";
import PerfilView from "./views/PerfilView";

export default function DashboardCliente() {
  // IMPORTANTE: debe coincidir con el menú
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#000",
        color: "white"
      }}
    >
      {/* SIDEBAR IZQUIERDO */}
      <SidebarCliente activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CONTENIDO */}
      <Box sx={{ flexGrow: 1, p: 4, mt: 2 }}>
        {activeTab === "inicio" && <InicioView />}
        {activeTab === "clases" && <ClasesView />}
        {activeTab === "progreso" && <ProgresoView />}
        {activeTab === "pagos" && <PagosView />}
        {activeTab === "perfil" && <PerfilView />}
      </Box>
    </Box>
  );
}








//import { useState, useEffect } from 'react';
//import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress, Chip } from "@mui/material";
//import { 
//  FitnessCenter as FitnessIcon,
//  CalendarToday as CalendarIcon,
//  TrendingUp as TrendingIcon,
//  Stars as StarsIcon
//} from "@mui/icons-material";
//
//export default function DashboardCliente() {
//  const [usuario, setUsuario] = useState(null);
//
//  useEffect(() => {
//    const usuarioData = localStorage.getItem("usuario");
//    if (usuarioData) {
//      setUsuario(JSON.parse(usuarioData));
//    }
//  }, []);
//
//  // Datos de ejemplo
//  const miPlan = {
//    nombre: "Plan Premium",
//    estado: "Activo",
//    diasRestantes: 15,
//    progreso: 50
//  };
//
//  const estadisticas = {
//    asistenciasEsteMes: 18,
//    diasConsecutivos: 5,
//    caloriasQuemadas: 3250,
//    metaCumplida: 72
//  };
//
//  return (
//    <Box sx={{ p: 3 }}>
//      {/* HEADER */}
//      <Box mb={4}>
//        <Typography variant="h3" fontWeight={700} gutterBottom>
//          Mi Panel
//        </Typography>
//        <Typography variant="body1" color="text.secondary">
//          ¡Hola, {usuario?.nombre}! 💪 Sigue así
//        </Typography>
//      </Box>
//
//      {/* MI MEMBRESÍA */}
//      <Card sx={{ 
//        mb: 4,
//        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//        color: "white"
//      }}>
//        <CardContent>
//          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//            <Box>
//              <Typography variant="h5" fontWeight={700}>
//                {miPlan.nombre}
//              </Typography>
//              <Typography variant="body2">
//                Tu membresía actual
//              </Typography>
//            </Box>
//            <Chip 
//              label={miPlan.estado} 
//              color="success" 
//              sx={{ fontWeight: 600 }}
//            />
//          </Box>
//          
//          <Box mt={2}>
//            <Typography variant="body2" mb={1}>
//              Días restantes: {miPlan.diasRestantes} días
//            </Typography>
//            <LinearProgress 
//              variant="determinate" 
//              value={miPlan.progreso}
//              sx={{ 
//                height: 8, 
//                borderRadius: 5,
//                backgroundColor: "rgba(255,255,255,0.3)",
//                '& .MuiLinearProgress-bar': {
//                  backgroundColor: "white"
//                }
//              }}
//            />
//          </Box>
//        </CardContent>
//      </Card>
//
//      {/* ESTADÍSTICAS */}
//      <Grid container spacing={3} mb={4}>
//        
//        <Grid item xs={12} sm={6} md={3}>
//          <Card sx={{ 
//            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//            color: "white"
//          }}>
//            <CardContent>
//              <Box display="flex" justifyContent="space-between" alignItems="center">
//                <Box>
//                  <Typography variant="h4" fontWeight={700}>
//                    {estadisticas.asistenciasEsteMes}
//                  </Typography>
//                  <Typography variant="body2">
//                    Asistencias este mes
//                  </Typography>
//                </Box>
//                <CalendarIcon sx={{ fontSize: 50, opacity: 0.5 }} />
//              </Box>
//            </CardContent>
//          </Card>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={3}>
//          <Card sx={{ 
//            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//            color: "white"
//          }}>
//            <CardContent>
//              <Box display="flex" justifyContent="space-between" alignItems="center">
//                <Box>
//                  <Typography variant="h4" fontWeight={700}>
//                    {estadisticas.diasConsecutivos}
//                  </Typography>
//                  <Typography variant="body2">
//                    Días consecutivos 🔥
//                  </Typography>
//                </Box>
//                <TrendingIcon sx={{ fontSize: 50, opacity: 0.5 }} />
//              </Box>
//            </CardContent>
//          </Card>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={3}>
//          <Card sx={{ 
//            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
//            color: "white"
//          }}>
//            <CardContent>
//              <Box display="flex" justifyContent="space-between" alignItems="center">
//                <Box>
//                  <Typography variant="h4" fontWeight={700}>
//                    {estadisticas.caloriasQuemadas}
//                  </Typography>
//                  <Typography variant="body2">
//                    Calorías quemadas
//                  </Typography>
//                </Box>
//                <FitnessIcon sx={{ fontSize: 50, opacity: 0.5 }} />
//              </Box>
//            </CardContent>
//          </Card>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={3}>
//          <Card sx={{ 
//            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
//            color: "white"
//          }}>
//            <CardContent>
//              <Box display="flex" justifyContent="space-between" alignItems="center">
//                <Box>
//                  <Typography variant="h4" fontWeight={700}>
//                    {estadisticas.metaCumplida}%
//                  </Typography>
//                  <Typography variant="body2">
//                    Meta cumplida
//                  </Typography>
//                </Box>
//                <StarsIcon sx={{ fontSize: 50, opacity: 0.5 }} />
//              </Box>
//            </CardContent>
//          </Card>
//        </Grid>
//
//      </Grid>
//
//      {/* ACCESOS RÁPIDOS */}
//      <Grid container spacing={3} mb={4}>
//        <Grid item xs={12}>
//          <Typography variant="h5" fontWeight={600} mb={2}>
//            Accesos Rápidos
//          </Typography>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//            }}
//          >
//            💪 Mi Rutina
//          </Button>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
//            }}
//          >
//            📅 Mis Clases
//          </Button>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//            }}
//          >
//            📊 Mi Progreso
//          </Button>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
//            }}
//          >
//            📅 Reservar Clase
//          </Button>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
//            }}
//          >
//            👤 Mi Perfil
//          </Button>
//        </Grid>
//
//        <Grid item xs={12} sm={6} md={4}>
//          <Button
//            fullWidth
//            variant="contained"
//            size="large"
//            sx={{ 
//              py: 3,
//              background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
//            }}
//          >
//            💳 Renovar Plan
//          </Button>
//        </Grid>
//
//      </Grid>
//
//      {/* MI RUTINA DE HOY */}
//      <Box>
//        <Typography variant="h5" fontWeight={600} mb={2}>
//          Mi Rutina de Hoy
//        </Typography>
//        <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
//          <CardContent>
//            <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
//              📝 No tienes rutina asignada aún.
//              <br />
//              Consulta con tu entrenador.
//            </Typography>
//          </CardContent>
//        </Card>
//      </Box>
//
//    </Box>
//  );
//}


// import { useState, useEffect } from "react";
// import {
//     Box, Typography, Button, Card, CardContent, CardMedia,
//     Avatar, Chip, Paper, Grid
// } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";
// import { gymTheme } from "../gymTheme";
// import Layout from "../layouts/Layout";


// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";


// import api from "../api/axios";

// export default function DashboardCliente() {
//     const usuario = JSON.parse(localStorage.getItem("usuario"));
//     const correo = usuario?.correo;

//     const [misClases, setMisClases] = useState([]);
//     const [misReservas, setMisReservas] = useState([]);
//     const [miMembresia, setMiMembresia] = useState({});

//     useEffect(() => {
//         const cargarDatos = async () => {
//         if (!correo) return;

//         try {
//             const clasesRes = await api.get(`/mis-clases?correo=${correo}`);
//             setMisClases(clasesRes.data);

//             const reservasRes = await api.get(`/mis-reservas?correo=${correo}`);
//             setMisReservas(reservasRes.data);

//             const membresiaRes = await api.get(`/mi-membresia?correo=${correo}`);
//             setMiMembresia(membresiaRes.data);

//         } catch (error) {
//             console.error("❌ Error al cargar datos:", error);
//             alert("No se pudieron cargar tus datos.");
//         }
//         };

//         cargarDatos();
//     }, [correo]);

//     return (
//         <ThemeProvider theme={gymTheme}>
//         <Layout rol="Cliente">
//             <Box sx={{ p: 4 }}>

//             {/* TÍTULO */}
//             <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
//                 Hola, {usuario?.nombre}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//                 Esta es tu vista general de actividades, clases y membresía.
//             </Typography>

//             {/* ACCIONES RÁPIDAS */}
//             <Grid container spacing={2} sx={{ mb: 4 }}>
//                 <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 3, textAlign: "center", borderRadius: 4 }}>
//                     <FitnessCenterIcon color="primary" sx={{ fontSize: 40 }} />
//                     <Typography fontWeight={600}>Reservar nueva clase</Typography>
//                     <Button variant="contained" fullWidth sx={{ mt: 1 }}>
//                     Ver clases disponibles
//                     </Button>
//                 </Paper>
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 3, textAlign: "center", borderRadius: 4 }}>
//                     <CalendarTodayIcon color="secondary" sx={{ fontSize: 40 }} />
//                     <Typography fontWeight={600}>Mis reservas</Typography>
//                     <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
//                     Revisar reservas
//                     </Button>
//                 </Paper>
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 3, textAlign: "center", borderRadius: 4 }}>
//                     <CreditCardIcon color="success" sx={{ fontSize: 40 }} />
//                     <Typography fontWeight={600}>Membresía</Typography>
//                     <Button variant="outlined" color="success" fullWidth sx={{ mt: 1 }}>
//                     Renovar membresía
//                     </Button>
//                 </Paper>
//                 </Grid>
//             </Grid>

//             {/* SECCIÓN: MIS CLASES */}
//             <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
//                 <EventAvailableIcon sx={{ mr: 1 }} />
//                 Mis Clases
//             </Typography>

//             <Grid container spacing={3}>
//                 {misClases.length === 0 && (
//                 <Typography color="text.secondary" sx={{ ml: 2 }}>
//                     No tienes clases registradas todavía.
//                 </Typography>
//                 )}

//                 {misClases.map((c) => (
//                 <Grid item xs={12} sm={6} md={4} key={c.id}>
//                     <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 6 }}>
//                     <CardMedia
//                         component="img"
//                         height="180"
//                         image="https://source.unsplash.com/600x400/?workout,gym"
//                     />
//                     <CardContent>
//                         <Typography variant="h6">{c.nombre}</Typography>
//                         <Typography variant="body2" color="text.secondary">
//                         Instructor: {c.instructor}
//                         </Typography>

//                         <Chip
//                         label={`${c.dia_semana} · ${c.hora_inicio}`}
//                         color="primary"
//                         sx={{ mt: 1 }}
//                         />
//                     </CardContent>
//                     </Card>
//                 </Grid>
//                 ))}
//             </Grid>

//             {/* SECCIÓN: MIS RESERVAS */}
//             <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
//                 <CalendarTodayIcon sx={{ mr: 1 }} />
//                 Mis Reservas
//             </Typography>

//             <Grid container spacing={3}>
//                 {misReservas.length === 0 && (
//                 <Typography color="text.secondary" sx={{ ml: 2 }}>
//                     No tienes reservas aún.
//                 </Typography>
//                 )}

//                 {misReservas.map((r) => (
//                 <Grid item xs={12} sm={6} md={4} key={r.id}>
//                     <Paper sx={{ p: 3, borderRadius: 4 }}>
//                     <Typography variant="h6">{r.clase}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                         {r.fecha} · {r.hora_inicio}
//                     </Typography>

//                     <Chip
//                         label={r.estado}
//                         color={r.estado === "Confirmada" ? "success" : "warning"}
//                         sx={{ mt: 1 }}
//                     />
//                     </Paper>
//                 </Grid>
//                 ))}
//             </Grid>

//             {/* SECCIÓN: MI MEMBRESÍA */}
//             <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
//                 <CreditCardIcon sx={{ mr: 1 }} />
//                 Mi Membresía
//             </Typography>

//             <Paper sx={{ p: 3, borderRadius: 4, display: "flex", gap: 2 }}>
//                 <Avatar sx={{ bgcolor: "success.main" }}>💳</Avatar>
//                 <Box>
//                 <Typography variant="h6">{miMembresia.nombre}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     {miMembresia.diasRestantes} días restantes · {miMembresia.estado}
//                 </Typography>
//                 </Box>
//             </Paper>

//             </Box>
//         </Layout>
//         </ThemeProvider>
//     );
// }

