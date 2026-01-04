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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import {
  Group as GroupIcon,
  Person,
  Search,
  Visibility,
  CalendarToday,
  CheckCircle,
  FitnessCenter
} from "@mui/icons-material";

import api from "../../services/api";
import "./Alumnos.css";
console.log("✅ Alumnos cargado correctamente");

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [clasesAlumno, setClasesAlumno] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  
  const [estadisticas, setEstadisticas] = useState({
    totalAlumnos: 0,
    alumnosActivos: 0,
    totalAsistencias: 0
  });

  useEffect(() => {
    fetchAlumnos();
  }, []);

  useEffect(() => {
    // Filtrar alumnos en tiempo real
    const filtrados = alumnos.filter(alumno => 
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.clase_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAlumnosFiltrados(filtrados);
  }, [searchTerm, alumnos]);

  const fetchAlumnos = async () => {
    try {
      const usuarioStr = localStorage.getItem("usuario");
      if (!usuarioStr) {
        setError("No hay sesión activa");
        return;
      }

      const usuario = JSON.parse(usuarioStr);
      const res = await api.get(`/alumnos/instructor/${usuario.id}`);
      
      console.log("✅ Alumnos obtenidos:", res.data);
      
      setAlumnos(res.data);
      setAlumnosFiltrados(res.data);
      calcularEstadisticas(res.data);
      
    } catch (error) {
      console.error("❌ Error al cargar alumnos:", error);
      setError("Error al cargar los alumnos");
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (alumnosData) => {
    // Contar alumnos únicos
    const alumnosUnicos = new Set(alumnosData.map(a => a.alumno_id));
    const totalAsistencias = alumnosData.reduce((sum, a) => sum + (a.total_asistencias || 0), 0);
    
    setEstadisticas({
      totalAlumnos: alumnosUnicos.size,
      alumnosActivos: alumnosUnicos.size,
      totalAsistencias: totalAsistencias
    });
  };

  const handleVerDetalle = async (alumno) => {
    setAlumnoSeleccionado(alumno);
    setModalOpen(true);
    setLoadingModal(true);
    
    try {
      const usuarioStr = localStorage.getItem("usuario");
      const usuario = JSON.parse(usuarioStr);
      
      const res = await api.get(`/alumnos/instructor/${usuario.id}/alumno/${alumno.alumno_id}`);
      console.log("✅ Clases del alumno:", res.data);
      setClasesAlumno(res.data);
    } catch (error) {
      console.error("❌ Error al cargar clases del alumno:", error);
      setClasesAlumno([]);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAlumnoSeleccionado(null);
    setClasesAlumno([]);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin asistencias';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Mis Alumnos
        </Typography>
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
          <GroupIcon sx={{ fontSize: 40, color: '#ffd700' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Mis Alumnos
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Lista de alumnos que asisten a tus clases
        </Typography>
      </Box>

      {/* ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card className="stat-card-alumnos">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GroupIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                <Box>
                  <Typography className="stat-label">Total Alumnos</Typography>
                  <Typography className="stat-value">{estadisticas.totalAlumnos}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="stat-card-alumnos">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography className="stat-label">Alumnos Activos</Typography>
                  <Typography className="stat-value">{estadisticas.alumnosActivos}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="stat-card-alumnos">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: 40, color: '#ffd700' }} />
                <Box>
                  <Typography className="stat-label">Total Asistencias</Typography>
                  <Typography className="stat-value">{estadisticas.totalAsistencias}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* BARRA DE BÚSQUEDA */}
      <Card className="search-card" sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, correo o clase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#ffd700' }} />
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700'
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* TABLA DE ALUMNOS */}
      <TableContainer component={Paper} className="table-container-alumnos">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell align="center">Correo</TableCell>
              <TableCell align="center">Clase</TableCell>
              <TableCell align="center">Última Asistencia</TableCell>
              <TableCell align="center">Total Asistencias</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Cargando alumnos...
                </TableCell>
              </TableRow>
            ) : alumnosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchTerm ? 'No se encontraron alumnos con ese criterio' : 'No tienes alumnos registrados'}
                </TableCell>
              </TableRow>
            ) : (
              alumnosFiltrados.map((alumno, index) => (
                <TableRow key={`${alumno.alumno_id}-${alumno.clase_id}-${index}`} className="table-row-hover">
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ fontWeight: 600, color: 'white' }}>
                        {alumno.nombre} {alumno.apellido}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {alumno.correo}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      icon={<FitnessCenter />}
                      label={alumno.clase_nombre}
                      sx={{
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        color: '#2196f3',
                        fontWeight: 600,
                        border: '1px solid rgba(33, 150, 243, 0.5)'
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatearFecha(alumno.ultima_asistencia)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={alumno.total_asistencias || 0}
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4caf50',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleVerDetalle(alumno)}
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
                      Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* NOTA */}
      <Box className="note-alumnos">
        <Typography>
          ℹ️ Solo lectura - No puedes editar datos personales de los alumnos
        </Typography>
      </Box>

      {/* MODAL DE DETALLE */}
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
                {alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellido}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {alumnoSeleccionado?.correo}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {loadingModal ? (
            <Typography align="center">Cargando información...</Typography>
          ) : clasesAlumno.length === 0 ? (
            <Typography align="center" sx={{ py: 3 }}>
              No hay información de clases disponible
            </Typography>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#ffd700' }}>
                Clases en las que participa:
              </Typography>
              <Grid container spacing={2}>
                {clasesAlumno.map((clase) => (
                  <Grid item xs={12} key={clase.clase_id}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {clase.clase_nombre}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {clase.descripcion || 'Sin descripción'}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Asistencias
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                              {clase.total_asistencias || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Última: {formatearFecha(clase.ultima_asistencia)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
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