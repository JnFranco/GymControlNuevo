import { Box, Typography, Button } from "@mui/material";

const glassItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  p: 2,
  mb: 1,
  bgcolor: "rgba(255,255,255,0.03)",
  borderRadius: 2,
};

export default function PagosPendientesTable({ pagos = [], onCobrar }) {
  return (
    <>
      {pagos.length === 0 && (
        <Typography sx={{ opacity: 0.5 }}>
          No hay pagos pendientes 🎉
        </Typography>
      )}

      {pagos.map((pago) => (
        <Box key={pago.id} sx={glassItemStyle}>
          <Box>
            <Typography fontWeight={600}>{pago.cliente}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {pago.id} | {pago.fecha}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => onCobrar(pago.id)}
            sx={{
              bgcolor: "#FFD700",
              color: "black",
              fontWeight: 800,
              "&:hover": { bgcolor: "#ffeb3b" },
            }}
          >
            Cobrar S/ {pago.monto}
          </Button>
        </Box>
      ))}
    </>
  );
}
