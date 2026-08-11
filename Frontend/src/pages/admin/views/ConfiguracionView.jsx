import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Alert,
    CircularProgress
} from "@mui/material";

import api from "../../../api/axios";
import { PageTitle, SectionTitle } from "../../../components/ui/Typography";

// ===============================
// ESTILO GLASS
// ===============================
const glassStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    p: 3,
    color: "white"
};

// ===============================
// CONFIG DEFAULT
// ===============================
const DEFAULT_CONFIG = {
    nombreGimnasio: "Gym Control",
    direccion: "",
    telefono: "",
    correo: "",
    cuposDefecto: 10,
    maxReservas: 3,
    cancelarHoras: 2,
    sistemaActivo: true,
    reservasActivas: true,
    pagosActivos: true,
    exportarPDF: true,
    exportarExcel: true,
    forzarPassword: false,
    tiempoSesion: 30
    };

    export default function ConfiguracionView() {
    const [tab, setTab] = useState(0);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // ===============================
    // CARGAR CONFIG DESDE EL BACKEND
    // ===============================
    useEffect(() => {
        const cargar = async () => {
        try {
            const res = await api.get("/config");
            setConfig({ ...DEFAULT_CONFIG, ...res.data });
        } catch (error) {
            console.error("Error al cargar config:", error);
            setMensaje("No se pudo cargar la configuración del servidor");
        } finally {
            setLoading(false);
        }
        };
        cargar();
    }, []);

    // ===============================
    // HANDLE CHANGE
    // ===============================
    const handleChange = (campo, valor) => {
        setConfig(prev => ({ ...prev, [campo]: valor }));
    };

    // ===============================
    // GUARDAR CONFIG (BACKEND)
    // ===============================
    const guardarConfig = async () => {
        setGuardando(true);
        setMensaje("");
        try {
        await api.put("/config", config);
        setMensaje("Configuración guardada correctamente");
        } catch (error) {
        console.error("Error al guardar config:", error);
        setMensaje("Ocurrió un error al guardar la configuración");
        } finally {
        setGuardando(false);
        }
    };

    if (loading) {
        return (
        <Box>
            <PageTitle>
            Configuración del Sistema
            </PageTitle>
            <CircularProgress />
        </Box>
        );
    }

    return (
        <Box>
        <PageTitle>
            Configuración del Sistema
        </PageTitle>

        <Paper sx={glassStyle}>
            <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ mb: 3 }}
            >
            <Tab label="General" />
            <Tab label="Parámetros" />
            <Tab label="Estados" />
            <Tab label="Reportes" />
            <Tab label="Seguridad" />
            </Tabs>

            {/* ===============================
                GENERAL
            =============================== */}
            {tab === 0 && (
            <Box>
                <SectionTitle>
                Información del Gimnasio
                </SectionTitle>

                <TextField
                label="Nombre del gimnasio"
                fullWidth
                margin="dense"
                value={config.nombreGimnasio}
                onChange={e => handleChange("nombreGimnasio", e.target.value)}
                />

                <TextField
                label="Dirección"
                fullWidth
                margin="dense"
                value={config.direccion}
                onChange={e => handleChange("direccion", e.target.value)}
                />

                <TextField
                label="Teléfono"
                fullWidth
                margin="dense"
                value={config.telefono}
                onChange={e => handleChange("telefono", e.target.value)}
                />

                <TextField
                label="Correo de contacto"
                fullWidth
                margin="dense"
                value={config.correo}
                onChange={e => handleChange("correo", e.target.value)}
                />
            </Box>
            )}

            {/* ===============================
                PARÁMETROS
            =============================== */}
            {tab === 1 && (
            <Box>
                <SectionTitle>
                Parámetros del Sistema
                </SectionTitle>

                <TextField
                type="number"
                label="Cupos por defecto en clases"
                fullWidth
                margin="dense"
                value={config.cuposDefecto}
                onChange={e => handleChange("cuposDefecto", e.target.value)}
                />

                <TextField
                type="number"
                label="Máximo de reservas por usuario"
                fullWidth
                margin="dense"
                value={config.maxReservas}
                onChange={e => handleChange("maxReservas", e.target.value)}
                />

                <TextField
                type="number"
                label="Horas mínimas para cancelar reserva"
                fullWidth
                margin="dense"
                value={config.cancelarHoras}
                onChange={e => handleChange("cancelarHoras", e.target.value)}
                />
            </Box>
            )}

            {/* ===============================
                ESTADOS
            =============================== */}
            {tab === 2 && (
            <Box>
                <SectionTitle>
                Estados del Sistema
                </SectionTitle>

                <FormControlLabel
                control={
                    <Switch
                    checked={config.sistemaActivo}
                    onChange={e => handleChange("sistemaActivo", e.target.checked)}
                    />
                }
                label="Sistema activo"
                />

                <FormControlLabel
                control={
                    <Switch
                    checked={config.reservasActivas}
                    onChange={e => handleChange("reservasActivas", e.target.checked)}
                    />
                }
                label="Reservas habilitadas"
                />

                <FormControlLabel
                control={
                    <Switch
                    checked={config.pagosActivos}
                    onChange={e => handleChange("pagosActivos", e.target.checked)}
                    />
                }
                label="Pagos habilitados"
                />
            </Box>
            )}

            {/* ===============================
                REPORTES
            =============================== */}
            {tab === 3 && (
            <Box>
                <SectionTitle>
                Configuración de Reportes
                </SectionTitle>

                <FormControlLabel
                control={
                    <Switch
                    checked={config.exportarPDF}
                    onChange={e => handleChange("exportarPDF", e.target.checked)}
                    />
                }
                label="Permitir exportación PDF"
                />

                <FormControlLabel
                control={
                    <Switch
                    checked={config.exportarExcel}
                    onChange={e => handleChange("exportarExcel", e.target.checked)}
                    />
                }
                label="Permitir exportación Excel"
                />
            </Box>
            )}

            {/* ===============================
                SEGURIDAD
            =============================== */}
            {tab === 4 && (
            <Box>
                <SectionTitle>
                Seguridad
                </SectionTitle>

                <FormControlLabel
                control={
                    <Switch
                    checked={config.forzarPassword}
                    onChange={e => handleChange("forzarPassword", e.target.checked)}
                    />
                }
                label="Forzar cambio de contraseña al primer ingreso"
                />

                <TextField
                type="number"
                label="Tiempo de sesión (minutos)"
                fullWidth
                margin="dense"
                value={config.tiempoSesion}
                onChange={e => handleChange("tiempoSesion", e.target.value)}
                />
            </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {mensaje && (
            <Alert severity={mensaje.includes("No se pudo") || mensaje.includes("error") ? "error" : "success"} sx={{ mb: 2 }}>
                {mensaje}
            </Alert>
            )}

            <Button variant="contained" disabled={guardando} onClick={guardarConfig}>
            {guardando ? "Guardando..." : "Guardar Configuración"}
            </Button>
        </Paper>
        </Box>
    );
}