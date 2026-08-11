import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Avatar, Stack } from "@mui/material";
import { TrendingDown, EventAvailable, Timer, FitnessCenter } from "@mui/icons-material";
import api from "../../../services/api";
import { PageTitle, SectionTitle } from "../../../components/ui/Typography";

export default function ProgresoView() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const [statsProgreso, setStatsProgreso] = useState({
    pesoActual: usuario?.peso || null,
    asistenciasMes: 0,
    metaAsistencias: 20,
    totalDiasGimnasio: 0,
    entrenamientosCompletados: 0
  });

  useEffect(() => {
    if (!usuario.id) return;
    api.get(`/cliente/dashboard/${usuario.id}`)
      .then((res) => {
        setStatsProgreso({
          pesoActual: usuario?.peso || null,
          asistenciasMes: Number(res.data.asistencias_mes) || 0,
          metaAsistencias: 20,
          totalDiasGimnasio: Number(res.data.total_asistencias) || 0,
          entrenamientosCompletados: Number(res.data.total_asistencias) || 0
        });
      })
      .catch((err) => console.error("❌ Error cargando progreso:", err));
  }, []);

  const pesoActual = statsProgreso.pesoActual ? `${statsProgreso.pesoActual} kg` : "Sin registro";
  const cumplimiento = statsProgreso.metaAsistencias > 0
    ? Math.min(100, Math.round((statsProgreso.asistenciasMes / statsProgreso.metaAsistencias) * 100))
    : 0;

  return (
    <Box sx={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Box mb={4}>
        <PageTitle sx={{ mb: 0.5 }}>Mi Progreso</PageTitle>
        <Typography variant="body2" color="text.secondary">Visualiza tus resultados y constancia en el tiempo.</Typography>
      </Box>

      <Grid container spacing={3}>

        {/* TARJETA PRINCIPAL: CONTROL DE PESO */}
        <Grid item xs={12} md={7}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle>Control de Peso</SectionTitle>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">PESO REGISTRADO</Typography>
                  <Typography variant="h4" fontWeight={800}>{pesoActual}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">ASISTENCIAS TOTALES</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#43e97b' }}>{statsProgreso.totalDiasGimnasio}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(251, 192, 45, 0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FitnessCenter sx={{ color: '#fbc02d', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Actualiza tu peso en "Mi Perfil" para llevar un mejor seguimiento de tu progreso.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TARJETA: CONSTANCIA (ASISTENCIAS) */}
        <Grid item xs={12} md={5}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle mb={1}>Cumplimiento del Mes</SectionTitle>
              <Box textAlign="center" mb={2}>
                <Typography variant="h2" fontWeight={900} color="#fbc02d">
                  {cumplimiento}%
                </Typography>
                <Typography variant="body2" color="text.secondary">de tus metas de asistencia</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={cumplimiento}
                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#fbc02d' } }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                {statsProgreso.asistenciasMes} de {statsProgreso.metaAsistencias} clases asistidas este mes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* MINI CARDS DE DATOS ADICIONALES */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(79, 172, 254, 0.1)', color: '#4facfe' }}>
                  <Timer />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{statsProgreso.totalDiasGimnasio}</Typography>
                  <Typography variant="caption" color="text.secondary">ASISTENCIAS TOTALES</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(251, 192, 45, 0.1)', color: '#fbc02d' }}>
                  <EventAvailable />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{statsProgreso.asistenciasMes}</Typography>
                  <Typography variant="caption" color="text.secondary">ASISTENCIAS ESTE MES</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
