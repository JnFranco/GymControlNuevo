import { Box, Typography, Grid, Card, CardContent, LinearProgress, Avatar, Stack } from "@mui/material";
import { TrendingDown, EventAvailable, Timer, FitnessCenter } from "@mui/icons-material";

export default function ProgresoView({ usuario }) {
  // Estos datos vendrán de: SELECT peso, fecha_registro FROM usuarios + COUNT(asistencias)
  const statsProgreso = {
    pesoInicial: 82.0,
    pesoActual: 75.5,
    diferencia: -6.5,
    asistenciasMes: 14,
    metaAsistencias: 20,
    totalDiasGimnasio: 45,
    entrenamientosCompletados: 32
  };

  return (
    <Box sx={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>Mi Progreso</Typography>
        <Typography color="gray">Visualiza tus resultados y constancia en el tiempo.</Typography>
      </Box>

      <Grid container spacing={3}>
        
        {/* TARJETA PRINCIPAL: CONTROL DE PESO */}
        <Grid item xs={12} md={7}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Control de Peso</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="gray">PESO INICIAL</Typography>
                  <Typography variant="h4" fontWeight={800}>{statsProgreso.pesoInicial} kg</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#43e97b">PESO ACTUAL</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#43e97b' }}>{statsProgreso.pesoActual} kg</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(67, 233, 123, 0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDown sx={{ color: '#43e97b', fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight={900} sx={{ color: '#43e97b' }}>{statsProgreso.diferencia} kg</Typography>
                  <Typography variant="body2" color="gray">Has logrado reducir tu peso desde que iniciaste.</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TARJETA: CONSTANCIA (ASISTENCIAS) */}
        <Grid item xs={12} md={5}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Cumplimiento del Mes</Typography>
              <Box textAlign="center" mb={2}>
                <Typography variant="h2" fontWeight={900} color="#fbc02d">
                  {Math.round((statsProgreso.asistenciasMes / statsProgreso.metaAsistencias) * 100)}%
                </Typography>
                <Typography variant="body2" color="gray">de tus metas de asistencia</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(statsProgreso.asistenciasMes / statsProgreso.metaAsistencias) * 100} 
                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#fbc02d' } }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'gray' }}>
                {statsProgreso.asistenciasMes} de {statsProgreso.metaAsistencias} clases asistidas
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
                  <Typography variant="caption" color="gray">DÍAS COMO SOCIO</Typography>
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
                  <FitnessCenter />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{statsProgreso.entrenamientosCompletados}</Typography>
                  <Typography variant="caption" color="gray">TOTAL ENTRENAMIENTOS</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}