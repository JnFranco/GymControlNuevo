import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress
} from "@mui/material";

import api from "../../services/api";
import { SectionTitle } from "../../components/ui/Typography";
import "./DashboardInstructor.css";

export default function DashboardInstructor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    clasesActivas: 0,
    horariosAsignados: 0,
    reservasDelDia: 0,
    asistenciaPromedio: 0
  });
  const [proximaClase, setProximaClase] = useState(null);
  const [horariosDelDia, setHorariosDelDia] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    if (!usuario.id) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }
    try {
      const [statsRes, proxRes, horariosRes] = await Promise.all([
        api.get(`/dashboard/instructor/${usuario.id}`),
        api.get(`/dashboard/instructor/${usuario.id}/proxima-clase`),
        api.get(`/horarios/instructor/${usuario.id}`)
      ]);

      setEstadisticas(statsRes.data);
      setProximaClase(proxRes.data.proxima);

      const hoy = new Date();
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const diaHoy = diasSemana[hoy.getDay()];
      setHorariosDelDia(horariosRes.data.filter((h) => h.dia_semana === diaHoy));
      setError(null);
    } catch (error) {
      console.error("❌ Error al cargar dashboard:", error);
      setError(error.response?.data?.error || "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  const actividadSemanal = ["L", "M", "M", "J", "V"];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#fbc02d' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error" variant="h6">⚠️ {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* TARJETAS DE ESTADÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(estadisticas).map(([label, value], i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card className="stat-card">
              <CardContent>
                <Typography className="stat-label">
                  {label.replace(/([A-Z])/g, " $1")}
                </Typography>
                <Typography className="stat-value">
                  {label === "asistenciaPromedio" ? `${value}%` : value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CONTENIDO PRINCIPAL */}
      <Grid container spacing={3}>

        {/* COLUMNA IZQUIERDA */}
        <Grid item xs={12} md={6}>

          {/* PRÓXIMA CLASE */}
          <Card className="card" sx={{ mb: 3 }}>
            <CardContent>
              <SectionTitle mb={1}>
                Próxima Clase
              </SectionTitle>
              <Box className="next-class">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {proximaClase ? proximaClase.nombre : "Sin clases programadas"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {proximaClase ? proximaClase.hora : "Aún no tienes clases futuras"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    {proximaClase ? proximaClase.instructor : ""}
                  </Typography>
                </Box>
                <Button className="primary-btn" onClick={() => navigate("/entrenador/horarios")}>
                  Ver Lista
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* ACTIVIDAD SEMANAL */}
          <Card className="card">
            <CardContent>
              <SectionTitle mb={1}>
                Actividad Semanal
              </SectionTitle>
              <Box className="weekly-activity">
                {["Lun", "Mar", "Mié", "Jue", "Vie"].map((dia, i) => {
                  const hoy = new Date();
                  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                  const diaHoy = diasSemana[hoy.getDay()];
                  const mapDias = { Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles', Jue: 'Jueves', Vie: 'Viernes' };
                  const activo = mapDias[dia] === diaHoy && horariosDelDia.length > 0;
                  return (
                    <Box key={i} className={`day-box ${activo ? "active" : ""}`}>
                      {dia}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

        </Grid>

        {/* COLUMNA DERECHA */}
        <Grid item xs={12} md={6}>

          {/* HORARIOS DEL DÍA */}
          <Card className="card">
            <CardContent>
              <Box className="schedule-header">
                <SectionTitle>
                  Horarios del Día
                </SectionTitle>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {actividadSemanal.map((d, i) => (
                    <Chip
                      key={i}
                      label={d}
                      className="day-chip"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              {horariosDelDia.length > 0 ? (
                horariosDelDia.map((h, i) => (
                  <Box key={i} className="schedule-item">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {h.clase_nombre}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {String(h.hora_inicio).slice(0, 5)} - {String(h.hora_fin).slice(0, 5)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", py: 2 }}>
                  No tienes horarios para hoy.
                </Typography>
              )}
            </CardContent>
          </Card>

        </Grid>

      </Grid>
    </>
  );
}
