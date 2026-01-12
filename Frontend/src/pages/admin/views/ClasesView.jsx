import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert
} from "@mui/material";
import ClaseForm from "../components/ClaseForm";

export default function ClasesView() {
  // =========================
  // ESTADOS
  // =========================
    const [clases, setClases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [openForm, setOpenForm] = useState(false);
    const [claseEdit, setClaseEdit] = useState(null);

    // filtros
    const [fClase, setFClase] = useState("");
    const [fEntrenador, setFEntrenador] = useState("");
    const [fEstado, setFEstado] = useState("");

    // =========================
    // CARGAR CLASES
    // =========================
    const cargarClases = async () => {
        try {
        setLoading(true);
        setErr("");
        const res = await api.get("/clases");
        setClases(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
        console.error("Error al cargar clases:", e);
        setErr("No se pudieron cargar las clases.");
        setClases([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        cargarClases();
    }, []);

    // =========================
    // AGRUPAR CLASES + HORARIOS
    // =========================
    const clasesAgrupadas = Object.values(
        clases.reduce((acc, c) => {
        if (!acc[c.id]) {
            acc[c.id] = {
            id: c.id,
            nombre: c.nombre,
            entrenador: c.entrenador,
            activo: c.activo,
            cupos: c.cupos,
            horarios: []
            };
        }

        if (c.dia_semana && c.hora_inicio && c.hora_fin) {
            acc[c.id].horarios.push(
            `${c.dia_semana} ${c.hora_inicio} - ${c.hora_fin}`
            );
        }

        return acc;
        }, {})
    );

    // =========================
    // OPCIONES DE FILTROS
    // =========================
    const clasesUnicas = [...new Set(clasesAgrupadas.map(c => c.nombre))];
    const entrenadoresUnicos = [...new Set(clasesAgrupadas.map(c => c.entrenador))];

    // =========================
    // FILTRADO
    // =========================
    const clasesFiltradas = clasesAgrupadas.filter(c => {
        if (fClase && c.nombre !== fClase) return false;
        if (fEntrenador && c.entrenador !== fEntrenador) return false;
        if (fEstado === "activas" && c.activo !== 1) return false;
        if (fEstado === "inactivas" && c.activo !== 0) return false;
        return true;
    });

    // =========================
    // ACTIVAR / DESACTIVAR
    // =========================
    const cambiarEstado = async (id, activo) => {
        try {
        await api.put(`/clases/${id}`, { activo: activo ? 0 : 1 });
        cargarClases();
        } catch (e) {
        console.error(e);
        setErr("No se pudo cambiar el estado.");
        }
    };

    // =========================
    // ELIMINAR
    // =========================
    const eliminarClase = async (id) => {
        if (!window.confirm("¿Eliminar esta clase?")) return;
        try {
        await api.delete(`/clases/${id}`);
        cargarClases();
        } catch (e) {
        console.error(e);
        setErr("No se pudo eliminar la clase.");
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={2}>
            Gestión de Clases
        </Typography>

        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Button
            variant="contained"
            sx={{ mb: 3 }}
            onClick={() => {
            setClaseEdit(null);
            setOpenForm(true);
            }}
        >
            Nueva Clase
        </Button>

        {/* FILTROS */}
        <Box
        display="flex"
        gap={2}
        mb={3}
        flexWrap="wrap"
        >
        <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Clase</InputLabel>
            <Select
            value={fClase}
            label="Clase"
            onChange={e => setFClase(e.target.value)}
            >
            <MenuItem value="">Todas</MenuItem>
            {clasesUnicas.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Entrenador</InputLabel>
            <Select
            value={fEntrenador}
            label="Entrenador"
            onChange={e => setFEntrenador(e.target.value)}
            >
            <MenuItem value="">Todos</MenuItem>
            {entrenadoresUnicos.map(e => (
                <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Estado</InputLabel>
            <Select
            value={fEstado}
            label="Estado"
            onChange={e => setFEstado(e.target.value)}
            >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activas">Activas</MenuItem>
            <MenuItem value="inactivas">Inactivas</MenuItem>
            </Select>
        </FormControl>
        </Box>

        {/* LISTADO */}
        {loading ? (
            <CircularProgress />
        ) : (
            <Grid container spacing={3}>
            {clasesFiltradas.map(c => (
                <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card>
                    <CardContent>
                    <Typography fontWeight={700}>{c.nombre}</Typography>
                    <Typography>👤 {c.entrenador}</Typography>

                    <Typography mt={1}>📅 Horarios:</Typography>
                    {c.horarios.length > 0 ? (
                        c.horarios.map((h, i) => (
                        <Typography key={i} sx={{ ml: 2 }}>• {h}</Typography>
                        ))
                    ) : (
                        <Typography sx={{ ml: 2 }} color="text.secondary">
                        Sin horario asignado
                        </Typography>
                    )}

                    <Chip
                        label={c.activo ? "Activa" : "Inactiva"}
                        color={c.activo ? "success" : "error"}
                        variant={c.activo ? "filled" : "outlined"}
                        sx={{ mt: 1, fontWeight: 600 }}
                        />

                    </CardContent>

                    <CardActions>
                    <Button onClick={() => { setClaseEdit(c); setOpenForm(true); }}>
                        Editar
                    </Button>
                    <Button onClick={() => cambiarEstado(c.id, c.activo)}>
                        {c.activo ? "Desactivar" : "Activar"}
                    </Button>
                    <Button color="error" onClick={() => eliminarClase(c.id)}>
                        Eliminar
                    </Button>
                    </CardActions>
                </Card>
                </Grid>
            ))}
            </Grid>
        )}

        {openForm && (
            <ClaseForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            clase={claseEdit}
            recargar={cargarClases}
            />
        )}
        </Box>
    );
}
