import { useState, useEffect } from 'react';
import api from "../../../api/axios";
import { 
  Box, Typography, Button, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress 
} from "@mui/material";
import { Search, Add, Edit, Delete, FitnessCenter } from "@mui/icons-material";
// Importamos el mismo componente de registro que usas en usuarios
import RegisterUsuarios from "../../Register";

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 4,
  p: 3,
  color: 'white'
};

export default function EntrenadoresView() {
  const [showForm, setShowForm] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Cargar datos (Usamos /usuarios porque ya trae la especialidad del backend)
  const fetchEntrenadores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar entrenadores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrenadores();
  }, []);

  // 2. Lógica de filtrado: Solo mostrar ROL 2 (Entrenadores) y filtrar por búsqueda
  const entrenadoresFiltrados = usuarios.filter(u => 
    (Number(u.id_rol) === 2) && 
    (u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Gestión de Entrenadores</Typography>
        {/* MISMO BOTÓN QUE EN USUARIOS */}
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
          sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}
        >
          Nuevo Miembro
        </Button>
      </Box>

      {/* BARRA DE BÚSQUEDA */}
      <Paper sx={{ ...glassStyle, mb: 3, p: 2 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o especialidad..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#FFD700' }} />
              </InputAdornment>
            ),
            style: { color: 'white', fontSize: '1.1rem' }
          }}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1.5, borderRadius: 2 }}
        />
      </Paper>

      {/* TABLA DE ENTRENADORES */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={glassStyle}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Entrenador</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Especialidad</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Teléfono</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entrenadoresFiltrados.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FitnessCenter sx={{ color: '#FFD700', fontSize: 20 }} />
                    <Box>
                        <Typography variant="body2" fontWeight={700}>{row.nombre} {row.apellido}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{row.correo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>
                    {row.especialidad || "No asignada"}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{row.telefono}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.activo ? "Activo" : "Inactivo"} 
                      size="small"
                      sx={{ 
                        bgcolor: row.activo ? 'rgba(0, 200, 0, 0.2)' : 'rgba(200, 0, 0, 0.2)',
                        color: row.activo ? '#43e97b' : '#f5576c',
                        fontWeight: 700
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button sx={{ color: '#FFD700' }}><Edit fontSize="small" /></Button>
                    <Button sx={{ color: '#f5576c' }}><Delete fontSize="small" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {entrenadoresFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'gray', py: 3 }}>
                    No hay entrenadores que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MISMO FORMULARIO MODAL QUE EN USUARIOS */}
      {showForm && (
        <Box sx={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          bgcolor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <Paper sx={{ ...glassStyle, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <Button 
              onClick={() => setShowForm(false)} 
              sx={{ position: 'absolute', right: 10, top: 10, color: 'white', minWidth: 0, fontSize: '1.5rem' }}
            >
              ×
            </Button>
            <Typography variant="h5" fontWeight={700} mb={3}>Registrar Nuevo Miembro</Typography>
            {/* IMPORTANTE: defaultRol={2} le dice al componente Register 
              que empiece seleccionado como Entrenador 
            */}
            <RegisterUsuarios 
              defaultRol={2} 
              onSuccess={() => { setShowForm(false); fetchEntrenadores(); }} 
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
}