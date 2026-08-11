import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  Button, Avatar, Divider, MenuItem, InputAdornment, Chip, Alert 
} from "@mui/material";
import { 
  Save, Person, Scale 
} from "@mui/icons-material";
import api from "../../../services/api";
import { PageTitle, SectionTitle } from "../../../components/ui/Typography";

export default function PerfilView() {
  const usuarioLS = JSON.parse(localStorage.getItem("usuario") || "{}");

  // Estado local que maneja todos los datos editables del cliente
  const [formData, setFormData] = useState({
    nombre: usuarioLS?.nombre || "",
    apellido: usuarioLS?.apellido || "",
    correo: usuarioLS?.correo || "",
    telefono: usuarioLS?.telefono || "",
    peso: usuarioLS?.peso || "",
    altura: usuarioLS?.altura || "",
    objetivo: usuarioLS?.objetivo || "",
    genero: usuarioLS?.genero || ""
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (!usuarioLS.id) return;
    api.get(`/usuarios/${usuarioLS.id}`)
      .then((res) => {
        const u = res.data;
        setFormData({
          nombre: u.nombre || "",
          apellido: u.apellido || "",
          correo: u.correo || "",
          telefono: u.telefono || "",
          peso: u.peso ?? "",
          altura: u.altura ?? "",
          objetivo: u.objetivo || "",
          genero: u.genero || ""
        });
      })
      .catch((err) => console.error("❌ Error cargando perfil:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!usuarioLS.id) return;
    try {
      setLoading(true);
      setMensaje({ tipo: '', texto: '' });

      await api.put(`/usuarios/${usuarioLS.id}`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: formData.peso,
        altura: formData.altura,
        objetivo: formData.objetivo,
        genero: formData.genero
      });

      // Actualizar localStorage para que Progreso e Inicio reflejen los cambios
      localStorage.setItem("usuario", JSON.stringify({
        ...usuarioLS,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: formData.peso,
        altura: formData.altura,
        objetivo: formData.objetivo,
        genero: formData.genero
      }));

      setMensaje({ tipo: 'success', texto: 'Datos actualizados correctamente' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.mensaje || 'Error al guardar los datos' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', pb: 5 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <PageTitle sx={{ mb: 0.5 }}>Mi Perfil</PageTitle>
          <Typography variant="body2" color="text.secondary">Mantén tus datos actualizados para un mejor seguimiento.</Typography>
        </Box>
        <Chip 
          label="Cuenta Activa" 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: 'bold', borderColor: '#43e97b', color: '#43e97b' }} 
        />
      </Box>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 3 }}>
          {mensaje.texto}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* LADO IZQUIERDO: FOTO Y OBJETIVO RAPIDO */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)', p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 120, height: 120, margin: '0 auto 20px', 
                bgcolor: '#fbc02d', color: 'black', fontSize: '3rem', fontWeight: 800 
              }}
            >
              {formData.nombre[0]}
            </Avatar>
            <Typography variant="h5" fontWeight={800}>{formData.nombre} {formData.apellido}</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>{formData.correo}</Typography>
            
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Box textAlign="left">
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Objetivo Actual</Typography>
              <Typography variant="body1" sx={{ color: '#fbc02d', fontWeight: 600 }}>{formData.objetivo}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* LADO DERECHO: FORMULARIO EDITABLE */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              
              <SectionTitle mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person sx={{ color: '#fbc02d' }} /> Datos Personales
              </SectionTitle>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Correo (No editable)" value={formData.correo} disabled
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 1, input: { color: 'rgba(255,255,255,0.3)' } }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

              <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                <Scale sx={{ color: '#fbc02d' }} /> Parámetros Físicos
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Peso Actual" name="peso" value={formData.peso} onChange={handleChange}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography color="gray">kg</Typography></InputAdornment> }}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Altura" name="altura" value={formData.altura} onChange={handleChange}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography color="gray">m</Typography></InputAdornment> }}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Género" name="genero" value={formData.genero} onChange={handleChange}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    select fullWidth label="Objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange}
                    variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, '& .MuiSelect-select': { color: 'white' } }}
                  >
                    <MenuItem value="Ganar Masa Muscular">Ganar Masa</MenuItem>
                    <MenuItem value="Perder Grasa">Perder Grasa</MenuItem>
                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Box mt={5}>
                <Button 
                  fullWidth size="large" variant="contained" startIcon={<Save />}
                  onClick={handleGuardar}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#fbc02d', color: 'black', fontWeight: 800, py: 1.5, borderRadius: 3,
                    '&:hover': { bgcolor: '#f9a825' }
                  }}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}