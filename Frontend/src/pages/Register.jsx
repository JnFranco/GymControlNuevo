import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import { 
  Box, Button, Typography, Paper, TextField, MenuItem, Grid, IconButton, Collapse 
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CloseIcon from "@mui/icons-material/Close";
import Background from "../assets/gym-bg.jpg";

const ROLES = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Entrenador' },
  { value: 3, label: 'Cliente' },
];

export default function Register({ onSuccess }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    nombre: "", 
    apellido: "", 
    correo: "", 
    telefono: "", 
    password: "", 
    confirmPassword: "", 
    id_rol: 3, 
    especialidad: "", 
    descripcion: "" 
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm((prev) => {
      const newState = { 
        ...prev, 
        [name]: name === "telefono" ? value.replace(/\D/g, '') : value 
      };

      // Lógica Profesional: Si cambia el rol y NO es entrenador, limpiamos los campos extra
      if (name === "id_rol" && Number(value) !== 2) {
        newState.especialidad = "";
        newState.descripcion = "";
      }
      
      return newState;
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Las claves no coinciden");
    
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      
      // Si no es entrenador, eliminamos los campos para que el backend reciba un objeto limpio
      if (Number(form.id_rol) !== 2) {
        delete payload.especialidad;
        delete payload.descripcion;
      }

      await api.post("/usuarios", { ...payload, activo: 1 });
      
      if (onSuccess) onSuccess();
      else nav(-1);

    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ 
      width: "100%", 
      maxWidth: 450, 
      margin: "auto",
      borderRadius: 4,
      overflow: "hidden",
      background: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url(${Background}) center/cover`,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#eaff17", px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <FitnessCenterIcon sx={{ color: "black" }} />
          <Typography variant="h6" fontWeight={900} color="black" sx={{ letterSpacing: -0.5 }}>
            {Number(form.id_rol) === 2 ? "NUEVO ENTRENADOR" : "NUEVO MIEMBRO"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => onSuccess ? onSuccess() : nav(-1)} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* FORMULARIO */}
      <Box component="form" onSubmit={handleRegister} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        
        <TextField
          select label="Tipo de Perfil" name="id_rol" size="small" fullWidth variant="filled"
          value={form.id_rol} onChange={handleChange}
          sx={{ 
            "& .MuiFilledInput-root": { backgroundColor: "rgba(255,255,255,0.05)" }, 
            "& .MuiSelect-select": { color: "#eaff17", fontWeight: 700 },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" }
          }}
        >
          {ROLES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </TextField>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Nombre" name="nombre" size="small" variant="filled" fullWidth required 
              value={form.nombre} onChange={handleChange} sx={{ input: { color: "white" } }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Apellido" name="apellido" size="small" variant="filled" fullWidth required 
              value={form.apellido} onChange={handleChange} sx={{ input: { color: "white" } }} />
          </Grid>
        </Grid>

        <TextField label="Correo" name="correo" type="email" size="small" variant="filled" fullWidth required 
          value={form.correo} onChange={handleChange} sx={{ input: { color: "white" } }} />
        
        <TextField label="Teléfono" name="telefono" size="small" variant="filled" fullWidth required 
          value={form.telefono} onChange={handleChange} inputProps={{ maxLength: 9 }} sx={{ input: { color: "white" } }} />

        {/* --- SECCIÓN ANIMADA PARA ENTRENADOR --- */}
        <Collapse in={Number(form.id_rol) === 2}>
          <Box sx={{ 
            display: "flex", flexDirection: "column", gap: 2, mt: 1, p: 2, 
            borderRadius: 2, bgcolor: "rgba(234, 255, 23, 0.03)", 
            border: "1px solid rgba(234, 255, 23, 0.2)" 
          }}>
            <Typography variant="overline" sx={{ color: "#eaff17", fontWeight: 900, lineHeight: 1 }}>
              Información Profesional
            </Typography>
            <TextField 
              label="Especialidad" name="especialidad" 
              placeholder="Ej. Crossfit, Yoga, Nutrición"
              size="small" variant="filled" fullWidth 
              required={Number(form.id_rol) === 2}
              value={form.especialidad} onChange={handleChange} sx={{ input: { color: "white" } }} 
            />
            <TextField 
              label="Biografía Corta" name="descripcion" 
              size="small" variant="filled" fullWidth multiline rows={2}
              value={form.descripcion} onChange={handleChange} sx={{ "& .MuiInputBase-input": { color: "white" } }} 
            />
          </Box>
        </Collapse>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Contraseña" name="password" type="password" size="small" variant="filled" fullWidth required 
              value={form.password} onChange={handleChange} sx={{ input: { color: "white" } }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Confirmar" name="confirmPassword" type="password" size="small" variant="filled" fullWidth required 
              value={form.confirmPassword} onChange={handleChange} sx={{ input: { color: "white" } }} />
          </Grid>
        </Grid>

        {error && (
          <Typography variant="caption" color="error" textAlign="center" 
            sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', py: 1, borderRadius: 1, border: '1px solid #d32f2f' }}>
            {error}
          </Typography>
        )}

        <Button 
          fullWidth variant="contained" type="submit" disabled={loading} 
          sx={{ 
            mt: 2, py: 1.5, fontWeight: 900, bgcolor: "#eaff17", color: "black", 
            fontSize: '0.9rem',
            "&:hover": { bgcolor: "#ccff00" },
            "&.Mui-disabled": { bgcolor: "rgba(234, 255, 23, 0.2)", color: "rgba(0,0,0,0.5)" }
          }}
        >
          {loading ? "PROCESANDO..." : "REGISTRAR AHORA"}
        </Button>
      </Box>
    </Paper>
  );
}