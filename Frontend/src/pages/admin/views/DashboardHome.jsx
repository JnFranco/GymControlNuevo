import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";

import GymStatsChart from "../components/GymStatsChart.jsx";


import { 
  getAdminStats, 
  getPagosPendientes, 
  getAsistenciasSemana,
  cobrarPago
} from "../../../services/admin.service";

// Estilo de cristal (NO SE TOCA)
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 4,
  p: 3,
  color: 'white'
};

export default function DashboardHome() {
  const [stats, setStats] = useState({});
  const [pagos, setPagos] = useState([]);
  const [chartData, setChartData] = useState([]);
  console.log("✅ DashboardHome se está renderizando");

  useEffect(() => {
  console.log("✅ DashboardHome se está renderizando");

  getAdminStats().then(res => setStats(res));
  getPagosPendientes().then(res => setPagos(res));

  getAsistenciasSemana().then(res => {
    console.log("📊 DATA DEL GRÁFICO:", res);
    setChartData(res);
  });

}, []);




const handleCobrar = async (pagoId) => {
  try {
    await cobrarPago(pagoId);

    // quitar pago de la lista
    setPagos(prev => prev.filter(p => p.id !== pagoId));

    // refrescar estadísticas
    const newStats = await getAdminStats();
    setStats(newStats);

  } catch (error) {
    console.error("Error al cobrar pago", error);
    alert("No se pudo cobrar el pago");
  }
};



  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Dashboard de Administración
      </Typography>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total de Clientes Activos', val: stats.clientes },
          { label: 'Total de Entrenadores', val: stats.entrenadores },
          { label: 'Clases Activas', val: stats.clasesHoy },
          { label: 'Reservas del Día', val: stats.reservasHoy ?? 0 },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={glassStyle}>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                {item.label}
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ color: '#FFD700' }}>
                {item.val ?? 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* SECCIÓN INFERIOR */}
      <Grid container spacing={3}>
        {/* PAGOS */}
        <Grid item xs={12} md={7}>
          <Paper sx={glassStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Pagos Pendientes
            </Typography>

            {pagos.map((pago, i) => (
              <Box key={i} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2, 
                mb: 1, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 2
              }}>
                <Box>
                  <Typography fontWeight={600}>{pago.cliente}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    {pago.fecha}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 800 }}
                  onClick={() => handleCobrar(pago.id)}
                >
                  Cobrar
                </Button>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* GRÁFICO */}
        <Grid item xs={12} md={5}>
          <Paper sx={glassStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Estado del Gimnasio
            </Typography>

            <GymStatsChart data={chartData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
