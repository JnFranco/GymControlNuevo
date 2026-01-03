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
  LinearProgress
} from "@mui/material";

import {
  Schedule as ScheduleIcon,
  AccessTime,
  CalendarToday,
  Person,
  Visibility,
  People
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
  
  // Estado para el modal de reservas
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
      setError(
        error.response?.data?.error || 
        "Error al cargar los horarios. Por favor intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (horariosData) => {
    const hoy = new Date();
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaHoy = diasSemana[hoy.getDay()];

    const horariosHoy = horariosData.filter(h => h.dia_semana === diaHoy).length;
    const totalReservas = horariosData.reduce((sum, h) => sum + (h.cupos_ocupados || 0), 0);
    
    setEstadisticas({
      totalHorarios: horariosData.length,
      horariosHoy: horariosHoy,
      totalReservas: totalReservas
    });
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
    if (porcentaje >= 50) return '#ffeb3b'; // Amarillo
    return '#4caf50'; // Verde
  };

  const handleVerReservas = async (horario) => {
    setHorarioSeleccionado(horario);
    setModalOpen(true);
    setLoadingReservas(true);
    
    try {
      const res = await api.get(`/horarios/${horario.id}/reservas`);
      console.log("✅ Reservas obtenidas:", res.data);
      setReservasModal(res.data);
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
      setReservasModal([]);
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReservasModal([]);
    setHorarioSeleccionado(null);
  };

  if (error) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            Mis Horarios
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Gestiona tus horarios asignados
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
                <People sx={{ fontSize: 40, color: '#2196f3' }} />
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
              horarios.map((horario) => (
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
                    <Chip
                      icon={<AccessTime />}
                      label={`${horario.hora_inicio.slice(0, 5)} - ${horario.hora_fin.slice(0, 5)}`}
                      className="chip-hora"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: 'white' }}>
                      {horario.capacidad}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'white' }}>
                          {horario.cupos_ocupados}/{horario.capacidad}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'white' }}>
                          {horario.porcentaje_ocupacion}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={horario.porcentaje_ocupacion}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getOcupacionColor(horario.porcentaje_ocupacion),
                            borderRadius: 5
                          }
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleVerReservas(horario)}
                      sx={{
                        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                        color: 'black',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)'
                        }
                      }}
                    >
                      Ver Reservas
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* NOTA */}
      <Box className="note-horarios">
        <Typography sx={{ mb: 1 }}>
          ✅ Puedes ver cupos ocupados y reservas
        </Typography>
        <Typography>
          ❌ No puedes crear ni borrar horarios (solo el administrador)
        </Typography>
      </Box>

      {/* MODAL DE RESERVAS */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ color: '#ffd700' }} />
            <Box>
              <Typography variant="h6">
                Reservas - {horarioSeleccionado?.clase_nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {horarioSeleccionado?.dia_semana} {horarioSeleccionado?.hora_inicio?.slice(0, 5)} - {horarioSeleccionado?.hora_fin?.slice(0, 5)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {loadingReservas ? (
            <Typography align="center">Cargando reservas...</Typography>
          ) : reservasModal.length === 0 ? (
            <Typography align="center" sx={{ py: 3 }}>
              No hay reservas para este horario
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ffd700' }}>Cliente</TableCell>
                    <TableCell sx={{ color: '#ffd700' }}>Correo</TableCell>
                    <TableCell sx={{ color: '#ffd700' }}>Teléfono</TableCell>
                    <TableCell sx={{ color: '#ffd700' }} align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservasModal.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell sx={{ color: 'white' }}>
                        {reserva.nombre} {reserva.apellido}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {reserva.correo}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {reserva.telefono || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={reserva.estado}
                          size="small"
                          sx={{
                            backgroundColor: 
                              reserva.estado === 'Confirmada' ? '#4caf50' :
                              reserva.estado === 'Pendiente' ? '#ff9800' :
                              '#f44336',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={handleCloseModal} 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}