import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../services/api";
import "./MiPerfil.css";

export default function MiPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: ""
  });

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/usuarios/${usuario.id}`, {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono
      });
      alert("✅ Datos actualizados correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar datos");
    }
  };

  return (
    <Box className="perfil-container">
      <Typography variant="h4" className="perfil-title">
        <PersonIcon /> Mi Perfil
      </Typography>

      <Card className="perfil-card">
        <CardContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            fullWidth
            className="perfil-input"
          />

          <TextField
            label="Apellido"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            fullWidth
            className="perfil-input"
          />

          <TextField
            label="Correo"
            value={usuario.correo}
            fullWidth
            disabled
            className="perfil-input"
          />

          <TextField
            label="Teléfono"
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            fullWidth
            className="perfil-input"
          />

          <Button
            className="perfil-btn"
            onClick={handleGuardar}
          >
            Guardar cambios
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
