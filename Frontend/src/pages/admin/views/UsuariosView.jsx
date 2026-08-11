import { useState, useEffect } from 'react';
import api from "../../../api/axios";
import { useNotify } from "../../../components/NotificationProvider";
import { PageTitle } from "../../../components/ui/Typography";
import { 
  Box, Typography, Button, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress 
} from "@mui/material";
import { Search, Add, Edit, Delete, Person } from "@mui/icons-material";
// ../ sube a 'admin', ../../ sube a 'pages'
import RegisterUsuarios from "../../Register";
import EditarUsuarioModal from "./EditarUsuarioModal";

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 4,
  p: 3,
  color: 'white'
};

export default function UsuariosView() {
  const notify = useNotify();
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Cargar usuarios desde el Backend
  const fetchUsuarios = async () => {
  try {
    setLoading(true);
    const res = await api.get("/usuarios");
    console.log("DATOS DE LA BD:", res.data); // <--- AGREGA ESTO
    setUsuarios(res.data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 2. Lógica de filtrado en tiempo real
  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estado de membresía: Pagado y vigente = Activa; Pagado vencido = Atrasado
  const estadoMembresia = (u) => {
    if (!u.membresia_nombre) return null;
    if (u.pago_estado === "Pagado" && Number(u.dias_restantes) >= 0) return "Activa";
    return u.pago_estado; // Pendiente / Atrasado
  };

  const chipMembresia = (estado) => {
    const map = {
      "Activa": { bgcolor: 'rgba(0, 200, 0, 0.2)', color: '#43e97b' },
      "Pendiente": { bgcolor: 'rgba(255, 180, 0, 0.2)', color: '#ffb300' },
      "Atrasado": { bgcolor: 'rgba(200, 0, 0, 0.2)', color: '#f5576c' },
    };
    return map[estado] || { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' };
  };

  const handleEliminar = async (usuario) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;
    try {
      await api.delete(`/usuarios/${usuario.id}`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
      notify(error.response?.data?.mensaje || "No se pudo eliminar el usuario", "error");
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <PageTitle>Gestión de Usuarios</PageTitle>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
          sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}
        >
          Nuevo Miembro
        </Button>
      </Box>

      {/* BARRA DE BÚSQUEDA FUNCIONAL */}
      <Paper sx={{ ...glassStyle, mb: 3, p: 2 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o correo..."
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

      {/* TABLA O CARGANDO */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={glassStyle}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Correo</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Rol</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Membresía</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 700 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ color: 'rgba(255,255,255,0.3)' }} />
                    {row.nombre} {row.apellido}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{row.correo}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{row.rol}</TableCell>
                  <TableCell>
                    {row.membresia_nombre ? (
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>
                          {row.membresia_nombre}
                        </Typography>
                        <Chip
                          label={estadoMembresia(row)}
                          size="small"
                          sx={{
                            ...chipMembresia(estadoMembresia(row)),
                            fontWeight: 700, mt: 0.5
                          }}
                        />
                      </Box>
                    ) : (
                      <Chip label="Sin membresía" size="small"
                        sx={{ ...chipMembresia(null), fontWeight: 700 }} />
                    )}
                  </TableCell>
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
                    <Button sx={{ color: '#FFD700' }} onClick={() => setEditando(row)}><Edit fontSize="small" /></Button>
                    <Button sx={{ color: '#f5576c' }} onClick={() => handleEliminar(row)}><Delete fontSize="small" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DE EDICIÓN */}
      {editando && (
        <EditarUsuarioModal
          usuario={editando}
          onClose={() => setEditando(null)}
          onSaved={fetchUsuarios}
        />
      )}

      {/* FORMULARIO MODAL */}
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
            <RegisterUsuarios onSuccess={() => { setShowForm(false); fetchUsuarios(); }} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}