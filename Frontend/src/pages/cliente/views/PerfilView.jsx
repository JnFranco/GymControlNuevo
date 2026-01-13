import { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  Button, Avatar, Divider, MenuItem, InputAdornment, Chip 
} from "@mui/material";
import { 
  Save, Person, Email, Phone, Scale, Height, Flag, Edit 
} from "@mui/icons-material";

export default function PerfilView({ usuario }) {
  // Estado local que maneja todos los datos editables del cliente
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "Juan",
    apellido: usuario?.apellido || "Pérez",
    correo: usuario?.correo || "juan.perez@email.com",
    telefono: usuario?.telefono || "987654321",
    peso: "78.5",      // Este dato alimentará la vista de Progreso
    altura: "1.75",    // Este dato alimentará la vista de Progreso
    objetivo: "Perder Grasa",
    genero: "Masculino"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    console.log("Enviando a la BD:", formData);
    alert("¡Datos actualizados correctamente!");
    // Aquí irá la conexión fetch/axios a tu base de datos después
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', pb: 5 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>Mi Perfil</Typography>
          <Typography color="gray">Mantén tus datos actualizados para un mejor seguimiento.</Typography>
        </Box>
        <Chip 
          label="Cuenta Activa" 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: 'bold', borderColor: '#43e97b', color: '#43e97b' }} 
        />
      </Box>

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
            <Typography variant="body2" color="gray" mb={3}>{formData.correo}</Typography>
            
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Box textAlign="left">
              <Typography variant="caption" color="gray" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Objetivo Actual</Typography>
              <Typography variant="body1" sx={{ color: '#fbc02d', fontWeight: 600 }}>{formData.objetivo}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* LADO DERECHO: FORMULARIO EDITABLE */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              
              <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                <Person sx={{ color: '#fbc02d' }} /> Datos Personales
              </Typography>
              
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
                  sx={{ 
                    bgcolor: '#fbc02d', color: 'black', fontWeight: 800, py: 1.5, borderRadius: 3,
                    '&:hover': { bgcolor: '#f9a825' }
                  }}
                >
                  Guardar Cambios
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}