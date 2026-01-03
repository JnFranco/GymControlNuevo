import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip
} from "@mui/material";

import "./DashboardInstructor.css";

export default function DashboardInstructor() {
  
  const estadisticas = {
    clasesActivas: 5,
    horariosAsignados: 12,
    reservasDelDia: 28,
    asistenciaPromedio: 85
  };

  const proximaClase = {
    nombre: "CROSSFIT AVANZADO",
    hora: "Hoy, 6:00 PM",
    instructor: "Instructor, Laura G"
  };

  const actividadSemanal = [
    { dia: "Lun", activo: true },
    { dia: "Mar", activo: true },
    { dia: "Mié", activo: true },
    { dia: "Jue", activo: false },
    { dia: "Vie", activo: true }
  ];

  const horariosDelDia = [
    { titulo: "YOGA FLOW", hora: "7:00 AM" },
    { titulo: "CROSSFIT BÁSICO", hora: "8:00 AM" },
    { titulo: "BOXEO FUNDAMENTOS", hora: "9:00 AM" }
  ];

  const diasSemana = ["L", "M", "M", "J", "V"];

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
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Próxima Clase
              </Typography>
              <Box className="next-class">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {proximaClase.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {proximaClase.hora}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    {proximaClase.instructor}
                  </Typography>
                </Box>
                <Button className="primary-btn">
                  Ver Lista
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* ACTIVIDAD SEMANAL */}
          <Card className="card">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Actividad Semanal
              </Typography>
              <Box className="weekly-activity">
                {actividadSemanal.map((d, i) => (
                  <Box
                    key={i}
                    className={`day-box ${d.activo ? "active" : ""}`}
                  >
                    {d.dia}
                  </Box>
                ))}
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
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Horarios del Día
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {diasSemana.map((d, i) => (
                    <Chip 
                      key={i} 
                      label={d} 
                      className="day-chip"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              {horariosDelDia.map((h, i) => (
                <Box key={i} className="schedule-item">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {h.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {h.hora}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
          
        </Grid>

      </Grid>
    </>
  );
}