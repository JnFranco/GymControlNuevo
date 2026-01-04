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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  Person,
  EventNote,
  CalendarToday,
  AccessTime
} from "@mui/icons-material";

import api from "../../services/api";
import "./Asistencias.css";

export default function Asistencias() {
  const [clases, setClases] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingClases, setLoadingClases] = useState(true);
  const [error, setError] = useState(null);
  
  const [estadisticas, setEstadisticas] = useState({
    totalReservas: 0,
    presentes: 0,
    ausentes: 0
  });

  // Cargar clases del instructor al montar
  useEffect(() => {
    fetchClases();
  }, []);

  // Cargar horarios cuando se selecciona una clase
  useEffect(() => {
    if (claseSeleccionada) {
      fetchHorarios(claseSeleccionada);
      setHorarioSeleccionado("");
      setReservas([]);
    }
  }, [claseSeleccionada]);

  // Cargar reservas cuando se selecciona un horario
  useEffect(() => {
    if (horarioSeleccionado) {
      fetchReservas(horarioSeleccionado);
    }
  }, [horarioSeleccionado]);

  const fetchClases = async () => {
    try {
      const usuarioStr = localStorage.getItem("usuario");
      if (!usuarioStr) {
        setError("No hay sesión activa");
        return;
      }

      const usuario = JSON.parse(usuarioStr);
      const res = await api.get(`/asistencias/instructor/${usuario.id}/clases`);
      
      console.log("✅ Clases obtenidas:", res.data);
      setClases(res.data);
      
    } catch (error) {
      console.error("❌ Error al cargar clases:", error);
      setError("Error al cargar las clases");
    } finally {
      setLoadingClases(false);
    }
  };

  const fetchHorarios = async (claseId) => {
    try {
      setLoading(true);
      const res = await api.get(`/asistencias/clase/${claseId}/horarios`);
      
      console.log("✅ Horarios obtenidos:", res.data);
      setHorarios(res.data);
      
    } catch (error) {
      console.error("❌ Error al cargar horarios:", error);
      setError("Error al cargar los horarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservas = async (horarioId) => {
    try {
      setLoading(true);
      const res = await api.get(`/asistencias/horario/${horarioId}/reservas`);
      
      console.log("✅ Reservas obtenidas:", res.data);
      setReservas(res.data);
      calcularEstadisticas(res.data);
      
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (reservasData) => {
    const presentes = reservasData.filter(r => r.presente === 1 || r.presente === true).length;
    const ausentes = reservasData.length - presentes;
    
    setEstadisticas({
      totalReservas: reservasData.length,
      presentes: presentes,
      ausentes: ausentes
    });
  };

  const handleMarcarAsistencia = async (reservaId, presente) => {
    try {
      await api.post('/asistencias/marcar', {
        id_reserva: reservaId,
        presente: presente
      });
      
      // Actualizar la lista localmente
      const nuevasReservas = reservas.map(r => 
        r.reserva_id === reservaId ? { ...r, presente: presente ? 1 : 0 } : r
      );
      
      setReservas(nuevasReservas);
      calcularEstadisticas(nuevasReservas);
      
      console.log(`✅ Asistencia ${presente ? 'marcada' : 'desmarcada'}`);
      
    } catch (error) {
      console.error("❌ Error al marcar asistencia:", error);
      alert("Error al marcar la asistencia");
    }
  };

  const horarioSeleccionadoInfo = horarios.find(h => h.id === horarioSeleccionado);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#ffd700' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Marcar Asistencias
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Gestiona la asistencia de tus alumnos
        </Typography>
      </Box>

      {/* SELECTORES */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ffd700'
                }
              }}
            >
              Selecciona una Clase
            </InputLabel>
            <Select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
              disabled={loadingClases}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: '#ffd700',
                  fontSize: '2rem'
                },
                minHeight: '56px'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    maxHeight: '400px',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      fontSize: '1.1rem',
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                        transform: 'translateX(5px)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              {clases.map((clase) => (
                <MenuItem key={clase.id} value={clase.id}>
                  📚 {clase.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={!claseSeleccionada}>
            <InputLabel 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ffd700'
                }
              }}
            >
              Selecciona un Horario
            </InputLabel>
            <Select
              value={horarioSeleccionado}
              onChange={(e) => setHorarioSeleccionado(e.target.value)}
              disabled={!claseSeleccionada || loading}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderWidth: '2px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700',
                  borderWidth: '2px'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700',
                  borderWidth: '2px'
                },
                '.MuiSvgIcon-root': {
                  color: '#ffd700',
                  fontSize: '2rem'
                },
                minHeight: '56px'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid #ffd700',
                    maxHeight: '400px',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      fontSize: '1.1rem',
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                        transform: 'translateX(5px)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.4)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              {horarios.map((horario) => (
                <MenuItem key={horario.id} value={horario.id}>
                  📅 {horario.dia_semana} - 🕐 {horario.hora_inicio.slice(0, 5)} a {horario.hora_fin.slice(0, 5)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* INFO DEL HORARIO SELECCIONADO */}
      {horarioSeleccionado && horarioSeleccionadoInfo && (
        <Card className="info-card" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: '#ffd700' }} />
                  <Typography sx={{ color: 'white' }}>
                    {horarioSeleccionadoInfo.dia_semana}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: '#4caf50' }} />
                  <Typography sx={{ color: 'white' }}>
                    {horarioSeleccionadoInfo.hora_inicio.slice(0, 5)} - {horarioSeleccionadoInfo.hora_fin.slice(0, 5)}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Capacidad: {horarioSeleccionadoInfo.capacidad}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ESTADÍSTICAS */}
      {reservas.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card className="stat-card-asistencias">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EventNote sx={{ fontSize: 40, color: '#2196f3' }} />
                  <Box>
                    <Typography className="stat-label">Total Reservas</Typography>
                    <Typography className="stat-value">{estadisticas.totalReservas}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className="stat-card-asistencias">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                  <Box>
                    <Typography className="stat-label">Presentes</Typography>
                    <Typography className="stat-value">{estadisticas.presentes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card className="stat-card-asistencias">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person sx={{ fontSize: 40, color: '#f44336' }} />
                  <Box>
                    <Typography className="stat-label">Ausentes</Typography>
                    <Typography className="stat-value">{estadisticas.ausentes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* TABLA DE ASISTENCIAS */}
      {horarioSeleccionado && (
        <TableContainer component={Paper} className="table-container-asistencias">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Alumno</TableCell>
                <TableCell align="center">Correo</TableCell>
                <TableCell align="center">Teléfono</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Presente</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Cargando reservas...
                  </TableCell>
                </TableRow>
              ) : reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay reservas confirmadas para este horario
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((reserva) => (
                  <TableRow key={reserva.reserva_id} className="table-row-hover">
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
                        <Typography sx={{ fontWeight: 600, color: 'white' }}>
                          {reserva.nombre} {reserva.apellido}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {reserva.correo}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {reserva.telefono || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={reserva.estado}
                        size="small"
                        sx={{
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Checkbox
                        checked={reserva.presente === 1 || reserva.presente === true}
                        onChange={(e) => handleMarcarAsistencia(reserva.reserva_id, e.target.checked)}
                        sx={{
                          color: 'rgba(255,255,255,0.3)',
                          '&.Mui-checked': {
                            color: '#4caf50'
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: 28
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MENSAJE INICIAL */}
      {!horarioSeleccionado && !loading && (
        <Box className="empty-state">
          <CheckCircleIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            Selecciona una clase y un horario
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            para comenzar a marcar asistencias
          </Typography>
        </Box>
      )}
    </Box>
  );
}
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Card,
//   CardContent,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox
// } from "@mui/material";

// import {
//   CheckCircle as CheckCircleIcon,
//   Person,
//   EventNote,
//   CalendarToday,
//   AccessTime
// } from "@mui/icons-material";

// import api from "../../services/api";
// import "./Asistencias.css";

// export default function Asistencias() {
//   const [clases, setClases] = useState([]);
//   const [horarios, setHorarios] = useState([]);
//   const [reservas, setReservas] = useState([]);
  
//   const [claseSeleccionada, setClaseSeleccionada] = useState("");
//   const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  
//   const [loading, setLoading] = useState(false);
//   const [loadingClases, setLoadingClases] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [estadisticas, setEstadisticas] = useState({
//     totalReservas: 0,
//     presentes: 0,
//     ausentes: 0
//   });

//   // Cargar clases del instructor al montar
//   useEffect(() => {
//     fetchClases();
//   }, []);

//   // Cargar horarios cuando se selecciona una clase
//   useEffect(() => {
//     if (claseSeleccionada) {
//       fetchHorarios(claseSeleccionada);
//       setHorarioSeleccionado("");
//       setReservas([]);
//     }
//   }, [claseSeleccionada]);

//   // Cargar reservas cuando se selecciona un horario
//   useEffect(() => {
//     if (horarioSeleccionado) {
//       fetchReservas(horarioSeleccionado);
//     }
//   }, [horarioSeleccionado]);

//   const fetchClases = async () => {
//     try {
//       const usuarioStr = localStorage.getItem("usuario");
//       if (!usuarioStr) {
//         setError("No hay sesión activa");
//         return;
//       }

//       const usuario = JSON.parse(usuarioStr);
//       const res = await api.get(`/asistencias/instructor/${usuario.id}/clases`);
      
//       console.log("✅ Clases obtenidas:", res.data);
//       setClases(res.data);
      
//     } catch (error) {
//       console.error("❌ Error al cargar clases:", error);
//       setError("Error al cargar las clases");
//     } finally {
//       setLoadingClases(false);
//     }
//   };

//   const fetchHorarios = async (claseId) => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/asistencias/clase/${claseId}/horarios`);
      
//       console.log("✅ Horarios obtenidos:", res.data);
//       setHorarios(res.data);
      
//     } catch (error) {
//       console.error("❌ Error al cargar horarios:", error);
//       setError("Error al cargar los horarios");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReservas = async (horarioId) => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/asistencias/horario/${horarioId}/reservas`);
      
//       console.log("✅ Reservas obtenidas:", res.data);
//       setReservas(res.data);
//       calcularEstadisticas(res.data);
      
//     } catch (error) {
//       console.error("❌ Error al cargar reservas:", error);
//       setError("Error al cargar las reservas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calcularEstadisticas = (reservasData) => {
//     const presentes = reservasData.filter(r => r.presente === 1 || r.presente === true).length;
//     const ausentes = reservasData.length - presentes;
    
//     setEstadisticas({
//       totalReservas: reservasData.length,
//       presentes: presentes,
//       ausentes: ausentes
//     });
//   };

//   const handleMarcarAsistencia = async (reservaId, presente) => {
//     try {
//       await api.post('/asistencias/marcar', {
//         id_reserva: reservaId,
//         presente: presente
//       });
      
//       // Actualizar la lista localmente
//       const nuevasReservas = reservas.map(r => 
//         r.reserva_id === reservaId ? { ...r, presente: presente ? 1 : 0 } : r
//       );
      
//       setReservas(nuevasReservas);
//       calcularEstadisticas(nuevasReservas);
      
//       console.log(`✅ Asistencia ${presente ? 'marcada' : 'desmarcada'}`);
      
//     } catch (error) {
//       console.error("❌ Error al marcar asistencia:", error);
//       alert("Error al marcar la asistencia");
//     }
//   };

//   const horarioSeleccionadoInfo = horarios.find(h => h.id === horarioSeleccionado);

//   return (
//     <Box>
//       {/* HEADER */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//           <CheckCircleIcon sx={{ fontSize: 40, color: '#ffd700' }} />
//           <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
//             Marcar Asistencias
//           </Typography>
//         </Box>
//         <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
//           Gestiona la asistencia de tus alumnos
//         </Typography>
//       </Box>

//       {/* SELECTORES */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} md={6}>
//           <FormControl fullWidth>
//             <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               Selecciona una Clase
//             </InputLabel>
//             <Select
//               value={claseSeleccionada}
//               onChange={(e) => setClaseSeleccionada(e.target.value)}
//               disabled={loadingClases}
//               sx={{
//                 color: 'white',
//                 '.MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(255,255,255,0.3)'
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ffd700'
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ffd700'
//                 },
//                 '.MuiSvgIcon-root': {
//                   color: 'white'
//                 }
//               }}
//             >
//               {clases.map((clase) => (
//                 <MenuItem key={clase.id} value={clase.id}>
//                   {clase.nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <FormControl fullWidth disabled={!claseSeleccionada}>
//             <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               Selecciona un Horario
//             </InputLabel>
//             <Select
//               value={horarioSeleccionado}
//               onChange={(e) => setHorarioSeleccionado(e.target.value)}
//               disabled={!claseSeleccionada || loading}
//               sx={{
//                 color: 'white',
//                 '.MuiOutlinedInput-notchedOutline': {
//                   borderColor: 'rgba(255,255,255,0.3)'
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ffd700'
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ffd700'
//                 },
//                 '.MuiSvgIcon-root': {
//                   color: 'white'
//                 }
//               }}
//             >
//               {horarios.map((horario) => (
//                 <MenuItem key={horario.id} value={horario.id}>
//                   {horario.dia_semana} - {horario.hora_inicio.slice(0, 5)} a {horario.hora_fin.slice(0, 5)}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       {/* INFO DEL HORARIO SELECCIONADO */}
//       {horarioSeleccionado && horarioSeleccionadoInfo && (
//         <Card className="info-card" sx={{ mb: 3 }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//               <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CalendarToday sx={{ color: '#ffd700' }} />
//                   <Typography sx={{ color: 'white' }}>
//                     {horarioSeleccionadoInfo.dia_semana}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <AccessTime sx={{ color: '#4caf50' }} />
//                   <Typography sx={{ color: 'white' }}>
//                     {horarioSeleccionadoInfo.hora_inicio.slice(0, 5)} - {horarioSeleccionadoInfo.hora_fin.slice(0, 5)}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                 Capacidad: {horarioSeleccionadoInfo.capacidad}
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       )}

//       {/* ESTADÍSTICAS */}
//       {reservas.length > 0 && (
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={4}>
//             <Card className="stat-card-asistencias">
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <EventNote sx={{ fontSize: 40, color: '#2196f3' }} />
//                   <Box>
//                     <Typography className="stat-label">Total Reservas</Typography>
//                     <Typography className="stat-value">{estadisticas.totalReservas}</Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Card className="stat-card-asistencias">
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
//                   <Box>
//                     <Typography className="stat-label">Presentes</Typography>
//                     <Typography className="stat-value">{estadisticas.presentes}</Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Card className="stat-card-asistencias">
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Person sx={{ fontSize: 40, color: '#f44336' }} />
//                   <Box>
//                     <Typography className="stat-label">Ausentes</Typography>
//                     <Typography className="stat-value">{estadisticas.ausentes}</Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}

//       {/* TABLA DE ASISTENCIAS */}
//       {horarioSeleccionado && (
//         <TableContainer component={Paper} className="table-container-asistencias">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Alumno</TableCell>
//                 <TableCell align="center">Correo</TableCell>
//                 <TableCell align="center">Teléfono</TableCell>
//                 <TableCell align="center">Estado</TableCell>
//                 <TableCell align="center">Presente</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     Cargando reservas...
//                   </TableCell>
//                 </TableRow>
//               ) : reservas.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     No hay reservas confirmadas para este horario
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 reservas.map((reserva) => (
//                   <TableRow key={reserva.reserva_id} className="table-row-hover">
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
//                         <Typography sx={{ fontWeight: 600, color: 'white' }}>
//                           {reserva.nombre} {reserva.apellido}
//                         </Typography>
//                       </Box>
//                     </TableCell>

//                     <TableCell align="center">
//                       <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                         {reserva.correo}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="center">
//                       <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
//                         {reserva.telefono || 'N/A'}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="center">
//                       <Chip
//                         label={reserva.estado}
//                         size="small"
//                         sx={{
//                           backgroundColor: '#4caf50',
//                           color: 'white',
//                           fontWeight: 600
//                         }}
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       <Checkbox
//                         checked={reserva.presente === 1 || reserva.presente === true}
//                         onChange={(e) => handleMarcarAsistencia(reserva.reserva_id, e.target.checked)}
//                         sx={{
//                           color: 'rgba(255,255,255,0.3)',
//                           '&.Mui-checked': {
//                             color: '#4caf50'
//                           },
//                           '& .MuiSvgIcon-root': {
//                             fontSize: 28
//                           }
//                         }}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* MENSAJE INICIAL */}
//       {!horarioSeleccionado && !loading && (
//         <Box className="empty-state">
//           <CheckCircleIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
//             Selecciona una clase y un horario
//           </Typography>
//           <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
//             para comenzar a marcar asistencias
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// }