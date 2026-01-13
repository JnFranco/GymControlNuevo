import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    Divider,
    Alert
} from "@mui/material";
import api from "../../../api/axios";

export default function PagoCard({ pago, onPagoRealizado }) {
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const pagar = async (metodo) => {
        try {
        setLoading(true);
        setMensaje("");

        const res = await api.post(`/pagos/${pago.id}/pagar`, {
            metodo_pago: metodo
        });

        if (metodo === "Efectivo") {
            setMensaje(`🧾 Código de pago: ${res.data.codigo}`);
        } else {
            setMensaje("✅ Pago realizado con éxito");
        }

        onPagoRealizado();

        } catch (err) {
        console.error(err);
        setMensaje("❌ Error al procesar el pago");
        } finally {
        setLoading(false);
        }
    };

    const colorEstado =
        pago.estado === "Pagado"
        ? "success"
        : pago.estado === "Atrasado"
        ? "error"
        : "warning";

    return (
        <Box sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)"
        }}>
        <Typography variant="h6" fontWeight={700}>
            {pago.membresia}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Duración: {pago.duracion_dias} días
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={700}>
            Monto: <span style={{ color: "#FFD700" }}>S/. {pago.monto}</span>
        </Typography>

        <Box mt={1}>
            <Chip label={pago.estado} color={colorEstado} size="small" />
        </Box>

        {mensaje && (
            <Alert sx={{ mt: 2 }} severity={mensaje.includes("❌") ? "error" : "success"}>
            {mensaje}
            </Alert>
        )}

        {pago.estado !== "Pagado" && (
            <>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600} mb={1}>
                Método de pago
            </Typography>

            <Stack direction="row" spacing={1}>
                <Button
                variant="contained"
                disabled={loading}
                onClick={() => pagar("Tarjeta")}
                >
                💳 Tarjeta
                </Button>

                <Button
                variant="contained"
                disabled={loading}
                onClick={() => pagar("Yape")}
                >
                📱 Yape
                </Button>

                <Button
                variant="contained"
                disabled={loading}
                onClick={() => pagar("Plin")}
                >
                📲 Plin
                </Button>

                <Button
                variant="outlined"
                disabled={loading}
                onClick={() => pagar("Efectivo")}
                >
                🧾 Efectivo
                </Button>
            </Stack>
            </>
        )}
        </Box>
    );
}
