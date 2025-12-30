import { Grid, Paper, Typography } from "@mui/material";

// Estilo glass reutilizado
const glassStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: 4,
  p: 3,
  color: "white",
};

export default function AdminStatsCards({ stats }) {
  const cards = [
    { label: "Clientes Activos", value: stats.clientes },
    { label: "Entrenadores", value: stats.entrenadores },
    { label: "Clases Hoy", value: stats.clasesHoy },
    { label: "Ingresos del Mes", value: `S/ ${stats.ingresos}` },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper sx={glassStyle}>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
              {card.label}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ color: "#FFD700" }}
            >
              {card.value ?? "-"}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
