import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton
} from "@mui/material";

import {
  Schedule as ScheduleIcon,
  AccessTime,
  CalendarToday,
  Person,
  Visibility,
  Close
} from "@mui/icons-material";

import api from "../../services/api";
import "./Horarios.css";

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalHorarios: 0,
    horariosHoy: 0,
    totalReservas: 0
  });
  
  // Modal de reservas
  const [modalOpen, setModalOpen] = useState(false);
  const [reservasModal, setReservasModal] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [loadingReservas, setLoadingReservas] = useState(false);

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const usuarioStr = localStorage.getItem("usuario");
      
      if (!usuarioStr) {
        setError("No hay sesión activa");
        setLoading(false);
        return;
      }

      const usuario = JSON.parse(usuarioStr);
      
      if (!usuario?.id) {
        setError("Usuario sin ID válido");
        setLoading(false);
        return;
      }

      console.log("🔍 Buscando horarios para instructor ID:", usuario.id);

      const res = await api.get(`/horarios/instructor/${usuario.id}`);
      
      console.log("✅ Horarios obtenidos:", res.data);
      
      setHorarios(res.data);
      calcularEstadisticas(res.data);
      setError(null);
      
    } catch (error) {
      console.error("❌ Error al cargar horarios:", error);
      setError("Error al cargar los horarios. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (horariosData) => {
    const hoy = new Date();
    const diaHoy = hoy.toLocaleDateString('es-ES', { weekday: 'long' });
    const diaHoyCapitalizado = diaHoy.charAt(0).toUpperCase() + diaHoy.slice(1);

    const horariosHoy = horariosData.filter(h => h.dia_semana === diaHoyCapitalizado).length;
    const totalReservas = horariosData.reduce((sum, h) => sum + (h.reservas_actuales || 0), 0);
    
    setEstadisticas({
      totalHorarios: horariosData.length,
      horariosHoy: horariosHoy,
      totalReservas: totalReservas
    });
  };

  const verReservas = async (horario) => {
    setHorarioSeleccionado(horario);
    setModalOpen(true);
    setLoadingReservas(true);
    
    try {
      const res = await api.get(`/horarios/${horario.id}/reservas`);
      setReservasModal(res.data);
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
      setReservasModal([]);
    } finally {
      setLoadingReservas(false);
    }
  };

  const getDiaColor = (dia) => {
    const colores = {
      'Lunes': '#4caf50',
      'Martes': '#2196f3',
      'Miércoles': '#ff9800',
      'Jueves': '#9c27b0',
      'Viernes': '#f44336',
      'Sábado': '#00bcd4',
      'Domingo': '#ff5722'
    };
    return colores[dia] || '#757575';
  };

  const getOcupacionColor = (porcentaje) => {
    if (porcentaje >= 90) return '#f44336'; // Rojo
    if (porcentaje >= 70) return '#ff9800'; // Naranja
    if (porcentaje >= 50) return '#ffd700'; // Amarillo
    return '#4caf50'; // Verde
  };

  if (error) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 40, color: '#ffd700' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              Mis Horarios
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Horarios asociados a tus clases
          </Typography>
        </Box>
        <Box className="error-box">
          <Typography color="error" variant="h6" align="center">
            ⚠️ {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <ScheduleIcon sx={{ fontSize: 40, color: '#ffd700' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Mis Horarios
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Horarios asociados a tus clases
        </Typography>
      </Box>

      {/* ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card className="stat-card-horarios">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: 40, color: '#ffd700' }} />
                <Box>
                  <Typography className="stat-label">Total Horarios</Typography>
                  <Typography className="stat-value">{estadisticas.totalHorarios}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="stat-card-horarios">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTime sx={{ fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography className="stat-label">Horarios Hoy</Typography>
                  <Typography className="stat-value">{estadisticas.horariosHoy}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="stat-card-horarios">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person sx={{ fontSize: 40, color: '#2196f3' }} />
                <Box>
                  <Typography className="stat-label">Total Reservas</Typography>
                  <Typography className="stat-value">{estadisticas.totalReservas}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TABLA DE HORARIOS */}
      <TableContainer component={Paper} className="table-container-horarios">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clase</TableCell>
              <TableCell align="center">Día</TableCell>
              <TableCell align="center">Hora</TableCell>
              <TableCell align="center">Capacidad</TableCell>
              <TableCell align="center">Ocupación</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Cargando horarios...
                </TableCell>
              </TableRow>
            ) : horarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tienes horarios asignados
                </TableCell>
              </TableRow>
            ) : (
              horarios.map((horario) => {
                const ocupadas = horario.reservas_actuales || 0;
                const capacidad = horario.capacidad || 0;
                const porcentaje = capacidad > 0 ? (ocupadas / capacidad) * 100 : 0;
                
                return (
                  <TableRow key={horario.id} className="table-row-hover">
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: 'white' }}>
                        {horario.clase_nombre}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={horario.dia_semana}
                        sx={{
                          backgroundColor: getDiaColor(horario.dia_semana),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          icon={<AccessTime />}
                          label={`${horario.hora_inicio.slice(0, 5)} - ${horario.hora_fin.slice(0, 5)}`}
                          className="chip-hora"
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 600, color: 'white' }}>
                        {capacidad}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: getOcupacionColor(porcentaje),
                          mb: 1
                        }}>
                          {ocupadas} / {capacidad}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={porcentaje}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getOcupacionColor(porcentaje)
                            }
                          }}
                        />
                        <Typography sx={{ 
                          fontSize: '0.75rem', 
                          color: 'rgba(255,255,255,0.5)',
                          mt: 0.5
                        }}>
                          {porcentaje.toFixed(0)}% ocupado
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => verReservas(horario)}
                        sx={{
                          background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                          textTransform: 'none'
                        }}
                      >
                        Ver Reservas
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* NOTA */}
      <Typography className="note-horarios">
        ⏰ Los horarios son asignados por el administrador. Puedes ver los cupos ocupados y las reservas activas.
      </Typography>

      {/* MODAL DE RESERVAS */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reservas - {horarioSeleccionado?.clase_nombre}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {horarioSeleccionado?.dia_semana} • {horarioSeleccionado?.hora_inicio?.slice(0, 5)} - {horarioSeleccionado?.hora_fin?.slice(0, 5)}
            </Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {loadingReservas ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Cargando reservas...</Typography>
            </Box>
          ) : reservasModal.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No hay reservas para este horario
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ffd700', fontWeight: 600 }}>Alumno</TableCell>
                    <TableCell sx={{ color: '#ffd700', fontWeight: 600 }}>Contacto</TableCell>
                    <TableCell sx={{ color: '#ffd700', fontWeight: 600 }} align="center">Estado</TableCell>
                    <TableCell sx={{ color: '#ffd700', fontWeight: 600 }} align="center">Fecha Reserva</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservasModal.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell sx={{ color: 'white' }}>
                        {reserva.usuario_nombre} {reserva.usuario_apellido}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Box>
                          <Typography variant="body2">{reserva.usuario_correo}</Typography>
                          <Typography variant="caption">{reserva.usuario_telefono}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={reserva.estado}
                          size="small"
                          sx={{
                            backgroundColor: reserva.estado === 'Confirmada' ? '#4caf50' : '#ff9800',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ color: '#ffd700' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}