import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  CircularProgress
} from "@mui/material";
import api from "../../../api/axios";

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 4,
  p: 3,
  color: 'white'
};

export default function EditarUsuarioModal({ usuario, mostrarRol = true, onClose, onSaved }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "",
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    id_rol: usuario?.id_rol ?? 3,
    activo: usuario?.activo ?? 1,
    password: "",
    especialidad: usuario?.especialidad || "",
    descripcion: usuario?.descripcion || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (Number(payload.id_rol) !== 2) {
        delete payload.especialidad;
        delete payload.descripcion;
      }

      await api.put(`/usuarios/${usuario.id}`, payload);
      onSaved();
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err);
      setError(err.response?.data?.mensaje || "Error al actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      bgcolor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <Paper sx={{ ...glassStyle, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <Button
          onClick={onClose}
          sx={{ position: 'absolute', right: 10, top: 10, color: 'white', minWidth: 0, fontSize: '1.5rem' }}
        >
          ×
        </Button>

        <Typography variant="h5" fontWeight={700} mb={3}>
          Editar {Number(usuario?.id_rol) === 2 ? "Entrenador" : "Usuario"}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              fullWidth label="Nombre" name="nombre" value={form.nombre} onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              inputProps={{ style: { color: 'white' } }}
            />
            <TextField
              fullWidth label="Apellido" name="apellido" value={form.apellido} onChange={handleChange}
              sx={{ flex: 1, minWidth: 200 }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              inputProps={{ style: { color: 'white' } }}
            />
          </Box>

          <TextField
            fullWidth label="Correo" name="correo" value={form.correo} onChange={handleChange}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            inputProps={{ style: { color: 'white' } }}
          />

          <TextField
            fullWidth label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            inputProps={{ style: { color: 'white' } }}
          />

          {mostrarRol && (
            <TextField
              select fullWidth label="Rol" name="id_rol" value={form.id_rol} onChange={handleChange}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              sx={{ '& .MuiSelect-select': { color: 'white' } }}
            >
              <MenuItem value={1}>Administrador</MenuItem>
              <MenuItem value={2}>Entrenador</MenuItem>
              <MenuItem value={3}>Cliente</MenuItem>
            </TextField>
          )}

          {Number(form.id_rol) === 2 && (
            <>
              <TextField
                fullWidth label="Especialidad" name="especialidad" value={form.especialidad} onChange={handleChange}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                inputProps={{ style: { color: 'white' } }}
              />
              <TextField
                fullWidth label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange}
                multiline minRows={2}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                inputProps={{ style: { color: 'white' } }}
              />
            </>
          )}

          <TextField
            select fullWidth label="Estado" name="activo" value={form.activo} onChange={handleChange}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            sx={{ '& .MuiSelect-select': { color: 'white' } }}
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
          </TextField>

          <TextField
            fullWidth type="password" label="Nueva contraseña (opcional)" name="password"
            value={form.password} onChange={handleChange}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            inputProps={{ style: { color: 'white' } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              fullWidth variant="contained" onClick={handleGuardar} disabled={loading}
              sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar Cambios"}
            </Button>
            <Button
              fullWidth variant="outlined" onClick={onClose}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
