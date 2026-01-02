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
  Button,
  Chip
} from "@mui/material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import api from "../../services/api";
import "./MisClases.css";

export default function MisClases() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        // Obtener usuario del localStorage dentro del useEffect
        const usuarioStr = localStorage.getItem("usuario");
        
        if (!usuarioStr) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        const usuario = JSON.parse(usuarioStr);
        
        if (!usuario?.id) {
          setError("Usuario sin ID válido");
          setLoading(false);
          return;
        }

        console.log("🔍 Buscando clases para instructor ID:", usuario.id);

        const res = await api.get(`/clases/instructor/${usuario.id}`);
        
        console.log("✅ Clases obtenidas:", res.data);
        
        setClases(res.data);
        setError(null);
        
      } catch (error) {
        console.error("❌ Error al cargar mis clases:", error);
        console.error("❌ Detalles:", error.response?.data);
        setError(
          error.response?.data?.error || 
          "Error al cargar las clases. Por favor intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, []); // ✅ Array vacío - solo se ejecuta una vez al montar el componente

  // Mostrar error si existe
  if (error) {
    return (
      <Box className="mis-clases-container">
        <Box className="title-box">
          <FitnessCenterIcon className="title-icon" />
          <Typography variant="h4" className="title">
            Mis Clases
          </Typography>
        </Box>
        <Box className="error-box">
          <Typography color="error" variant="h6" align="center">
            ⚠️ {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mis-clases-container">
      {/* TÍTULO */}
      <Box className="title-box">
        <FitnessCenterIcon className="title-icon" />
        <Typography variant="h4" className="title">
          Mis Clases
        </Typography>
      </Box>

      <Typography className="subtitle">
        Lista de clases asignadas a ti como instructor
      </Typography>

      {/* TABLA */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clase</TableCell>
              <TableCell align="center">Cupos</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Cargando clases...
                </TableCell>
              </TableRow>
            ) : clases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No tienes clases asignadas
                </TableCell>
              </TableRow>
            ) : (
              clases.map((clase) => (
                <TableRow key={clase.id}>
                  <TableCell>{clase.clase_nombre}</TableCell>

                  <TableCell align="center">
                    {clase.clase_cupos}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={clase.activo ? "Activa" : "Inactiva"}
                      className={
                        clase.activo ? "chip-activa" : "chip-inactiva"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      className="ver-btn"
                      onClick={() =>
                        console.log("Ver clase:", clase.id)
                      }
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* NOTA */}
      <Typography className="note">
        👉 Solo puedes visualizar tus clases.  
        La creación y eliminación de clases es responsabilidad del administrador.
      </Typography>
    </Box>
  );
}
