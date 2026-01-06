import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";

import GymStatsChart from "../components/GymStatsChart.jsx";



import { 
  getAdminStats,
  getPagosPendientesAdmin,
  getPagosAtrasadosAdmin,
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
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosAtrasados, setPagosAtrasados] = useState([]);
  const [chartData, setChartData] = useState([]);

  console.log("✅ DashboardHome se está renderizando");

  useEffect(() => {
    getAdminStats().then(res => setStats(res));

    getPagosPendientesAdmin().then(res => setPagosPendientes(res));
    getPagosAtrasadosAdmin().then(res => setPagosAtrasados(res));

    getAsistenciasSemana().then(res => {
      console.log("📊 DATA DEL BACKEND:", res);
      setChartData(res);
    });

}, []);





const handleCobrar = async (pagoId) => {
  try {
    const response = await cobrarPago(pagoId);

    console.log("✅ STATUS:", response.status);
    console.log("✅ DATA:", response.data);

    setPagosPendientes(prev => prev.filter(p => p.id !== pagoId));
    setPagosAtrasados(prev => prev.filter(p => p.id !== pagoId));

    const newStats = await getAdminStats();
    setStats(newStats);

  } catch (error) {
    console.error("❌ ERROR AXIOS:", error);

    if (error.response) {
      console.error("❌ STATUS:", error.response.status);
      console.error("❌ DATA:", error.response.data);
    } else {
      console.error("❌ ERROR SIN RESPONSE (RED):", error.message);
    }

  }
};

const promedioAsistencias =
  chartData.length > 0
    ? Math.round(
        chartData.reduce((acc, d) => acc + d.asistencias, 0) /
        chartData.length
      )
    : 0;
const totalPendiente = pagosPendientes.reduce(
  (acc, p) => acc + Number(p.monto || 0),
  0
);

const totalAtrasado = pagosAtrasados.reduce(
  (acc, p) => acc + Number(p.monto || 0),
  0
);





  return (

    <Box>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Dashboard de Administración
      </Typography>

      {/* TARJETAS */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total de Clientes Activos', val: stats.clientes },
          { label: 'Total de Entrenadores', val: stats.entrenadores },
          { label: 'Clases Activas', val: stats.clasesHoy },
          { label: 'Reservas del Día', val: stats.reservasHoy ?? 0 },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={glassStyle}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {item.label}
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ color: '#FFD700' }}>
                {item.val ?? 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={700}>
            💰 Total pendiente: 
            <span style={{ color: "#FFD700" }}>
              {" "}S/. {totalPendiente}
            </span>
          </Typography>

          <Typography fontWeight={700}>
            🔥 Total atrasado: 
            <span style={{ color: "#ff6b6b" }}>
              {" "}S/. {totalAtrasado}
            </span>
          </Typography>
        </Box>



      {/* ===== PAGOS ===== */}
      <Box sx={{ mb: 6 }}>
        <Paper sx={glassStyle}>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Pagos Pendientes
          </Typography>

          {pagosPendientes.map(pago => (
            <Box key={pago.id} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mb: 1,
              bgcolor: 'rgba(255,255,0,0.12)',
              borderRadius: 2
            }}>
              <Box>
                <Typography fontWeight={600}>{pago.cliente}</Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  Próximo pago:{" "}
                  {new Date(pago.proximo_pago).toLocaleDateString()}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#4caf50",
                    fontSize: 14
                  }}
                >
                  Monto: S/. {pago.monto}
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

          <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 2 }}>
            Pagos Atrasados
          </Typography>

          {pagosAtrasados.map(pago => (
            <Box key={pago.id} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mb: 1,
              bgcolor: 'rgba(255,0,0,0.15)',
              borderRadius: 2
            }}>
              <Box>
                <Typography fontWeight={600}>{pago.cliente}</Typography>
                <Typography variant="caption">
                  {pago.dias_atraso} días de atraso
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#ff6b6b",
                    fontSize: 14
                  }}
                >
                  💸 Debe: S/. {pago.monto}
                </Typography>

              </Box>

              <Button
                variant="contained"
                color="error"
                onClick={() => handleCobrar(pago.id)}
              >
                Cobrar
              </Button>
            </Box>
          ))}

        </Paper>
      </Box>

      {/* ===== GRÁFICO ABAJO ===== */}
      <Box>
        <Paper sx={glassStyle}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Estado del Gimnasio
          </Typography>

          <GymStatsChart data={chartData} />
            <Typography
            variant="caption"
            sx={{
              mt: 2,
              display: "block",
              color:
                promedioAsistencias >= 10
                  ? "#4caf50"
                  : promedioAsistencias >= 5
                  ? "#ff9800"
                  : "#f44336",
              fontWeight: 700
            }}
          >
            {promedioAsistencias >= 10
              ? "🔥 Alta actividad esta semana"
              : promedioAsistencias >= 5
              ? "⚠️ Actividad moderada, se puede mejorar"
              : "🚨 Actividad baja, considerar promociones"}
          </Typography>

        </Paper>
      </Box>

    </Box>
  );
}
