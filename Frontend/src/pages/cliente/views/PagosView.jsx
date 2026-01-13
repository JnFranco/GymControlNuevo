import { useEffect, useState } from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import api from "../../../api/axios";
import PagoCard from "../components/PagoCard";

export default function PagosView() {
    const [pagos, setPagos] = useState([]);
    const [error, setError] = useState("");

    const cargarPagos = async () => {
        try {
        const res = await api.get("/mi-membresia"); 
        // backend ya lo tienes
        setPagos(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pagos");
        }
    };

    useEffect(() => {
        cargarPagos();
    }, []);

    const onPagoRealizado = () => {
        cargarPagos(); // refresca estado
    };

    return (
        <Box>
        <Typography variant="h4" fontWeight={700} mb={3}>
            💳 Mis Pagos
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
            {pagos.map((pago) => (
            <Grid item xs={12} md={6} key={pago.id}>
                <PagoCard pago={pago} onPagoRealizado={onPagoRealizado} />
            </Grid>
            ))}
        </Grid>
        </Box>
    );
    }
