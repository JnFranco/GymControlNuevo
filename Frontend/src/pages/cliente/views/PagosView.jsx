import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Alert,
    Card,
    CardContent,
    Button,
    Divider
} from "@mui/material";
import api from "../../../api/axios";
import PagoCard from "../components/PagoCard";

export default function PagosView() {
    const [pagos, setPagos] = useState([]);
    const [membresias, setMembresias] = useState([]);
    const [error, setError] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // =========================
    // CARGAR PAGOS DEL USUARIO
    // =========================
    const cargarPagos = async () => {
        try {
            const res = await api.get(`/pagos/usuario/${usuario.id}`);
            setPagos(res.data);   // res.data ya es array
            setError("");
        } catch (err) {
            console.error(err);
            setPagos([]);
            setError(""); // 👈 NO mostrar error feo
        }
        };


    // =========================
    // CARGAR MEMBRESÍAS
    // ========================
    const cargarMembresias = async () => {
    const res = await api.get("/membresias");
    setMembresias(res.data);
    };

    useEffect(() => {
    cargarPagos();
    cargarMembresias();
    }, []);

    // =========================
    // CREAR NUEVO PAGO
    // =========================
    const crearPago = async (idMembresia) => {
        try {
        await api.post("/pagos", {
            id_usuario: usuario.id,
            id_membresia: idMembresia
        });

        cargarPagos(); // refresca
        } catch (err) {
        console.error(err);
        alert("No se pudo crear el pago");
        }
    };

    useEffect(() => {
        cargarPagos();
        cargarMembresias();
    }, []);

    const onPagoRealizado = () => {
        cargarPagos();
    };

return (
    <Box>
        <Typography variant="h4" fontWeight={700} mb={3}>
        Mis Pagos
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* =========================
            SECCIÓN: ELEGIR MEMBRESÍA
            (solo si NO hay pagos)
        ========================= */}
        {pagos.length === 0 && (
        <>
            <Typography variant="h6" fontWeight={600} mb={2}>
            Elegir membresía
            </Typography>

            <Grid container spacing={3} mb={4}>
            {membresias.map((m) => (
                <Grid item xs={12} md={4} key={m.id}>
                <Card
                    sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3
                    }}
                >
                    <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                        {m.nombre}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {m.descripcion}
                    </Typography>

                    <Typography mt={1} fontWeight={700}>
                        S/. {m.costo}
                    </Typography>

                    <Typography variant="caption">
                        Duración: {m.duracion_dias} días
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                        mt: 2,
                        bgcolor: "#FFD700",
                        color: "black",
                        fontWeight: 700
                        }}
                        onClick={() => crearPago(m.id)}
                    >
                        Elegir membresía
                    </Button>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>

            <Divider sx={{ mb: 4 }} />
        </>
        )}

        {/* =========================
            SECCIÓN: PAGOS EXISTENTES
        ========================= */}
        <Grid container spacing={3}>
        {pagos.length === 0 && (
            <Grid item xs={12}>
            <Alert severity="info">
                No tienes pagos registrados aún.
            </Alert>
            </Grid>
        )}

        {pagos.map((pago) => (
            <Grid item xs={12} md={6} key={pago.id}>
            <PagoCard
                pago={pago}
                onPagoRealizado={onPagoRealizado}
            />
            </Grid>
        ))}
        </Grid>
    </Box>
);
}
