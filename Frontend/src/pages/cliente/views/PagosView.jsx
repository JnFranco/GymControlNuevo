import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    Paper,
    Divider
} from "@mui/material";
import api from "../../../api/axios";
import PagoCard from "../components/PagoCard";

export default function PagosView() {
    const [pagos, setPagos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const cargarPagos = async () => {
        try {
        setLoading(true);
        setError("");

        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario?.id) {
            setError("Usuario no identificado");
            return;
        }

        const res = await api.get("/mi-membresia", {
            params: { id_usuario: usuario.id }
        });

        setPagos(res.data || []);
        } catch (err) {
        console.error("❌ Error frontend pagos:", err);
        setError("No se pudieron cargar los pagos del usuario");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        cargarPagos();
    }, []);

    const totalPendiente = pagos
        .filter(p => p.estado !== "Pagado")
        .reduce((acc, p) => acc + Number(p.monto || 0), 0);

    return (
        <Box>
        <Typography variant="h4" fontWeight={800} mb={3}>
            Mis Pagos
        </Typography>

        {loading && (
            <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
            </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && pagos.length === 0 && (
            <Alert severity="info">
            No tienes pagos registrados aún.
            </Alert>
        )}

        {!loading && pagos.length > 0 && (
            <>
            {/* RESUMEN */}
            <Paper
                sx={{
                p: 2,
                mb: 3,
                bgcolor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <Typography fontWeight={700}>
                💰 Total pendiente:{" "}
                <span style={{ color: "#FFD700" }}>
                    S/. {totalPendiente.toFixed(2)}
                </span>
                </Typography>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* LISTA DE PAGOS */}
            <Grid container spacing={3}>
                {pagos.map((pago) => (
                <Grid item xs={12} md={6} key={pago.id}>
                    <PagoCard
                    pago={pago}
                    onPagoRealizado={cargarPagos}
                    />
                </Grid>
                ))}
            </Grid>
            </>
        )}
        </Box>
    );
}