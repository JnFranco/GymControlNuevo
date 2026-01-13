import { useState, useEffect } from 'react';
import api from "../../../api/axios";
import { 
  Box, Typography, Grid, Card, CardContent, LinearProgress, 
  Chip, CircularProgress, Avatar 
} from "@mui/material";
import { 
  CheckCircle as AsistenciaIcon, 
  EventAvailable as ReservaIcon,
  Person as TrainerIcon 
} from "@mui/icons-material";

export default function InicioView() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nombreCompleto = usuario?.nombre || 'Usuario';

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!usuario || !usuario.id) {
        console.log('⚠️ No hay usuario o ID en localStorage');
        setDatos({
          membresia: "Sin Membresía",
          dias_restantes: 0,
          progreso_dias: 0,
          estado_pago: "Pendiente",
          total_asistencias: 0,
          reservas_activas: 0,
          entrenador: "Por asignar"
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`📡 Solicitando datos para usuario ID: ${usuario.id}`);
        
        const response = await api.get(`/cliente/dashboard/${usuario.id}`);
        console.log('✅ Respuesta del servidor:', response.data);

        // Los datos vienen directamente del array o del objeto del backend
        const d = Array.isArray(response.data) ? response.data[0] : response.data;

        if (d) {
          const dias = d.duracion || 0; // O la lógica que prefieras para días restantes
          const activo = dias > 0;

          setDatos({
            membresia: d.nombre_membresia || "Sin Membresía",
            dias_restantes: dias,
            progreso_dias: activo ? Math.min(100, Math.round((dias / 30) * 100)) : 0,
            estado_pago: activo ? "Pagado" : "Pendiente", // Lógica dinámica corregida
            total_asistencias: d.total_asistencias || 0,
            reservas_activas: d.total_reservas || 0,
            entrenador: "Por asignar"
          });
        }
      } catch (err) {
        console.error("❌ Error en la petición:", err.message || err);
        setError("Error de conexión con el servidor");
        setDatos({
          membresia: "Sin Membresía",
          dias_restantes: 0,
          progreso_dias: 0,
          estado_pago: "Pendiente",
          total_asistencias: 0,
          reservas_activas: 0,
          entrenador: "N/A"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#fbc02d' }} />
        <Typography color="gray" ml={2}>Cargando...</Typography>
      </Box>
    );
  }

  // Datos finales a mostrar
  const datosMostrar = datos || {
    membresia: "Sin Membresía",
    dias_restantes: 0,
    progreso_dias: 0,
    estado_pago: "Pendiente",
    total_asistencias: 0,
    reservas_activas: 0,
    entrenador: "Por asignar"
  };

  const tieneMembresia = datosMostrar.dias_restantes > 0;

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', p: { xs: 1, md: 2 } }}>
      
      {/* BIENVENIDA */}
      <Box mb={5}>
        <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
          ¡Bienvenido, {nombreCompleto}! 👋
        </Typography>
        <Typography variant="h6" color="gray" fontWeight={400}>
          Resumen de tu cuenta y actividad.
        </Typography>
      </Box>

      {/* TARJETA DE MEMBRESÍA */}
      <Card sx={{ 
        mb: 6, 
        background: tieneMembresia 
          ? "linear-gradient(135deg, #12141c 0%, #1a1c2e 100%)" 
          : "linear-gradient(135deg, #2a1212 0%, #1a0a0a 100%)",
        color: "white", 
        borderRadius: 5,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ p: 5 }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="overline" sx={{ color: '#fbc02d', fontWeight: 700 }}>
                MEMBRESÍA ACTUAL
              </Typography>
              <Typography variant="h2" fontWeight={900} sx={{ mb: 1 }}>
                {datosMostrar.membresia}
              </Typography>
              
              {tieneMembresia ? (
                <Box sx={{ mt: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Vence en {datosMostrar.dias_restantes} días
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {datosMostrar.progreso_dias}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={datosMostrar.progreso_dias} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 10, 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      '& .MuiLinearProgress-bar': { bgcolor: '#fbc02d' } 
                    }} 
                  />
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.6)' }}>
                  No tienes una membresía activa en este momento.
                </Typography>
              )}
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Chip 
                label={datosMostrar.estado_pago.toUpperCase()} 
                sx={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 800, 
                  px: 3, 
                  py: 2, 
                  borderRadius: 3,
                  bgcolor: datosMostrar.estado_pago === 'Pagado' ? '#43e97b' : '#ff5252', 
                  color: 'black'
                }} 
              />
              <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                Estado del pago
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ESTADÍSTICAS */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            bgcolor: 'rgba(255,255,255,0.02)', 
            color: 'white', 
            borderRadius: 5, 
            border: '1px solid rgba(255,255,255,0.05)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'rgba(67, 233, 123, 0.15)', color: '#43e97b', width: 80, height: 80, mr: 2 }}>
                  <AsistenciaIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    {datosMostrar.total_asistencias}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    ASISTENCIAS TOTALES
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            bgcolor: 'rgba(255,255,255,0.02)', 
            color: 'white', 
            borderRadius: 5, 
            border: '1px solid rgba(255,255,255,0.05)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'rgba(79, 172, 254, 0.15)', color: '#4facfe', width: 80, height: 80, mr: 2 }}>
                  <ReservaIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    {datosMostrar.reservas_activas}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    PRÓXIMAS CLASES
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            bgcolor: 'rgba(255,255,255,0.02)', 
            color: 'white', 
            borderRadius: 5, 
            border: '1px solid rgba(255,255,255,0.05)',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'rgba(251, 192, 45, 0.15)', color: '#fbc02d', width: 80, height: 80, mr: 2 }}>
                  <TrainerIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {datosMostrar.entrenador}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    MI ENTRENADOR
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}