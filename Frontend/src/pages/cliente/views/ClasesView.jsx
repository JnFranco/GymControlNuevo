import { useState, useEffect } from 'react';
import api from "../../../api/axios";
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Avatar, ButtonGroup, Stack, CircularProgress
} from "@mui/material";
import { 
  AccessTime, CalendarMonth, CheckCircle, AddCircleOutline, CancelOutlined 
} from "@mui/icons-material";

export default function ClasesView() {
  const [vista, setVista] = useState('mis_clases');
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos desde el Backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cliente/clases');
      setClases(res.data);
    } catch (error) {
      console.error("Error al cargar clases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // 2. Acciones: Reservar y Cancelar
  const manejarReserva = async (idHorario) => {
    await api.post('/cliente/reservar', { idHorario });
    cargarDatos(); // Recargar para ver cambios
  };

  const manejarCancelacion = async (idHorario) => {
    await api.put(`/cliente/cancelar/${idHorario}`);
    cargarDatos();
  };

  // Filtrado de la lista
  const clasesAMostrar = vista === 'mis_clases' 
    ? clases.filter(c => c.reservado === 1) 
    : clases;

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress sx={{color: '#fbc02d'}}/></Box>;

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', p: 2 }}>
      {/* CABECERA */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>Gestión de Clases</Typography>
          <Typography color="gray">Administra tus horarios y reserva nuevas sesiones.</Typography>
        </Box>

        <ButtonGroup sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 3 }}>
          {['mis_clases', 'reservar'].map((v) => (
            <Button 
              key={v}
              onClick={() => setVista(v)}
              sx={{ 
                bgcolor: vista === v ? '#fbc02d' : 'transparent', 
                color: vista === v ? 'black' : 'white',
                fontWeight: 700, px: 3, borderRadius: '10px !important', border: 'none !important',
                '&:hover': { bgcolor: vista === v ? '#fbc02d' : 'rgba(255,255,255,0.1)' }
              }}
            >
              {v === 'mis_clases' ? 'Mis Clases' : 'Reservar'}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* LISTADO */}
      <Grid container spacing={2}>
        {clasesAMostrar.length > 0 ? (
          clasesAMostrar.map((clase) => (
            <Grid item xs={12} key={clase.horario_id}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.03)', color: 'white', borderRadius: 4, 
                border: '1px solid rgba(255,255,255,0.08)', transition: '0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', transform: 'scale(1.005)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <CalendarMonth sx={{ color: '#fbc02d', fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={800}>{clase.dia_semana}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ color: 'gray', fontSize: 18 }} />
                        <Typography variant="body1" color="gray">{clase.hora_inicio} - {clase.hora_fin}</Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Typography variant="h5" fontWeight={900}>{clase.clase_nombre}</Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#fbc02d', color: 'black', fontSize: 12, fontWeight: 700 }}>
                          {clase.entrenador[0]}
                        </Avatar>
                        <Typography variant="body2" color="gray">Prof. {clase.entrenador} • {clase.cupos_disponibles} cupos</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      {clase.reservado === 1 ? (
                        <Stack direction="row" spacing={1} justifyContent={{xs: 'flex-start', sm: 'flex-end'}}>
                          <Button variant="contained" disabled startIcon={<CheckCircle />} sx={{ borderRadius: 3, bgcolor: '#2e7d32 !important', color: 'white !important' }}>
                            Confirmada
                          </Button>
                          <Button onClick={() => manejarCancelacion(clase.horario_id)} color="error" sx={{ minWidth: 0, borderRadius: 3 }}><CancelOutlined /></Button>
                        </Stack>
                      ) : (
                        <Button 
                          variant="outlined" onClick={() => manejarReserva(clase.horario_id)}
                          disabled={clase.cupos_disponibles <= 0}
                          startIcon={<AddCircleOutline />}
                          sx={{ borderRadius: 3, color: '#fbc02d', borderColor: '#fbc02d', fontWeight: 700, px: 4 }}
                        >
                          {clase.cupos_disponibles > 0 ? "Reservar" : "Agotado"}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ p: 10, textAlign: 'center', width: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 5 }}>
            <Typography color="gray">No hay clases disponibles en esta sección.</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}