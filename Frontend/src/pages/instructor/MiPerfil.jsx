import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid
} from "@mui/material";
import api from "../../services/api";
import "./MiPerfil.css";

export default function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    telefono: ""
  });

  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (usuarioStorage?.id) {
      api.get(`/usuarios/${usuarioStorage.id}`)
        .then(res => {
          setUsuario(res.data);
          setForm({
            nombre: res.data.nombre,
            telefono: res.data.telefono || ""
          });
        })
        .catch(err => console.error("❌ Error cargando perfil", err));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/usuarios/${usuarioStorage.id}`, {
        nombre: form.nombre,
        telefono: form.telefono
      });
      alert("✅ Perfil actualizado");
      setEditando(false);
      setUsuario({ ...usuario, ...form });
    } catch (error) {
      alert("❌ Error al actualizar perfil");
    }
  };

  if (!usuario) return null;

  return (
    <Box>
      <Typography variant="h4" className="perfil-title">
        👤 Mi Perfil
      </Typography>

      <Grid container spacing={3}>

        {/* COLUMNA IZQUIERDA – DATOS ACTUALES */}
        <Grid item xs={12} md={6}>
          <Card className="perfil-card">
            <CardContent>
              <Typography className="perfil-section-title">
                Datos actuales
              </Typography>

              <PerfilItem label="Nombre" value={usuario.nombre} />
              <PerfilItem label="Apellido" value={usuario.apellido} />
              <PerfilItem label="Correo" value={usuario.correo} />
              <PerfilItem label="Teléfono" value={usuario.telefono || "No registrado"} />

              <Button
                variant="outlined"
                className="editar-btn"
                onClick={() => setEditando(true)}
              >
                Editar perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA – EDITAR */}
        {editando && (
          <Grid item xs={12} md={6}>
            <Card className="perfil-card">
              <CardContent>
                <Typography className="perfil-section-title">
                  Editar información
                </Typography>

                <TextField
                  label="¿Cómo quieres que te llamemos?"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Número de celular"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <Button
                  variant="contained"
                  className="guardar-btn"
                  onClick={handleGuardar}
                >
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

      </Grid>
    </Box>
  );
}

/* COMPONENTE REUTILIZABLE */
function PerfilItem({ label, value }) {
  return (
    <Box className="perfil-item">
      <Typography className="perfil-label">{label}</Typography>
      <Typography className="perfil-value">{value}</Typography>
    </Box>
  );
}
