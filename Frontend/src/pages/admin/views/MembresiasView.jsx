import { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Grid,
    Stack,
    MenuItem,
    CircularProgress,
    InputAdornment,
    Alert
} from "@mui/material";
import { Add, Edit, Delete, Search, Payments, PersonAdd } from "@mui/icons-material";
import { PageTitle } from "../../../components/ui/Typography";

const glassStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    p: 3,
    color: "white"
};

const inputDark = {
    "& .MuiInputBase-root": { color: "white" },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" }
    }
};

const estadoChip = (estado) => {
    switch (estado) {
        case "Pagado": return { bgcolor: "rgba(0,200,0,0.2)", color: "#43e97b", label: "Activa" };
        case "Pendiente": return { bgcolor: "rgba(255,180,0,0.2)", color: "#ffb300", label: "Pendiente" };
        case "Atrasado": return { bgcolor: "rgba(200,0,0,0.2)", color: "#f5576c", label: "Atrasado" };
        default: return { bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", label: "Sin membresía" };
    }
};

const formVacio = { nombre: "", descripcion: "", costo: "", duracion_dias: "" };

export default function MembresiasView() {
    const [tab, setTab] = useState(0);
    const [membresias, setMembresias] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    // Planes
    const [showFormPlan, setShowFormPlan] = useState(false);
    const [formPlan, setFormPlan] = useState(formVacio);
    const [editandoId, setEditandoId] = useState(null);

    // Asignar
    const [showAsignar, setShowAsignar] = useState(false);
    const [asignar, setAsignar] = useState({ id_usuario: "", id_membresia: "" });

    const cargarTodo = async () => {
        try {
            setLoading(true);
            const [resM, resP, resU] = await Promise.all([
                api.get("/membresias"),
                api.get("/pagos/admin"),
                api.get("/usuarios")
            ]);
            setMembresias(resM.data);
            setPagos(resP.data);
            setUsuarios(resU.data);
        } catch (error) {
            console.error("Error cargando membresías:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarTodo(); }, []);

    const mostrarMensaje = (texto, ok = true) => {
        setMensaje({ texto, ok });
        setTimeout(() => setMensaje(""), 4000);
    };

    // ============ PLANES CRUD ============
    const abrirNuevoPlan = () => {
        setEditandoId(null);
        setFormPlan(formVacio);
        setShowFormPlan(true);
    };

    const abrirEditarPlan = (m) => {
        setEditandoId(m.id);
        setFormPlan({ nombre: m.nombre, descripcion: m.descripcion || "", costo: m.costo, duracion_dias: m.duracion_dias });
        setShowFormPlan(true);
    };

    const guardarPlan = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                await api.put(`/membresias/${editandoId}`, formPlan);
                mostrarMensaje("Membresía actualizada correctamente");
            } else {
                await api.post("/membresias", formPlan);
                mostrarMensaje("Membresía creada correctamente");
            }
            setShowFormPlan(false);
            cargarTodo();
        } catch (error) {
            mostrarMensaje(error.response?.data?.error || "Error al guardar", false);
        }
    };

    const eliminarPlan = async (m) => {
        if (!window.confirm(`¿Eliminar la membresía "${m.nombre}"?`)) return;
        try {
            await api.delete(`/membresias/${m.id}`);
            mostrarMensaje("Membresía eliminada correctamente");
            cargarTodo();
        } catch (error) {
            mostrarMensaje(error.response?.data?.error || "No se pudo eliminar", false);
        }
    };

    // ============ ASIGNAR MEMBRESÍA ============
    const asignarMembresia = async (e) => {
        e.preventDefault();
        if (!asignar.id_usuario || !asignar.id_membresia) {
            mostrarMensaje("Selecciona un usuario y una membresía", false);
            return;
        }
        try {
            await api.post("/pagos", { ...asignar });
            mostrarMensaje("Membresía asignada (pago pendiente). Cobra el pago para activarla.");
            setShowAsignar(false);
            setAsignar({ id_usuario: "", id_membresia: "" });
            cargarTodo();
        } catch (error) {
            mostrarMensaje(error.response?.data?.error || "Error al asignar", false);
        }
    };

    const cobrar = async (pagoId) => {
        try {
            await api.post(`/pagos/cobrar/${pagoId}`);
            mostrarMensaje("Pago cobrado correctamente");
            cargarTodo();
        } catch (error) {
            mostrarMensaje(error?.response?.data?.error || "Error al cobrar el pago", false);
        }
    };

    const clientes = usuarios.filter(u => Number(u.id_rol) === 3);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress sx={{ color: '#FFD700' }} />
            </Box>
        );
    }

    return (
        <Box>
            <PageTitle>Gestión de Membresías</PageTitle>

            {mensaje && (
                <Alert severity={mensaje.ok ? "success" : "error"} sx={{ mb: 3 }}>
                    {mensaje.texto}
                </Alert>
            )}

            <Paper sx={glassStyle}>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{ mb: 3 }}
                >
                    <Tab label={`Planes (${membresias.length})`} />
                    <Tab label={`Usuarios y Pagos (${pagos.length})`} />
                </Tabs>

                {/* ==================== PLANES ==================== */}
                {tab === 0 && (
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={abrirNuevoPlan}
                                sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}
                            >
                                Nuevo Plan
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Plan</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Descripción</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Costo</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Duración</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }} align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {membresias.map((m) => (
                                        <TableRow key={m.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>{m.nombre}</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{m.descripcion}</TableCell>
                                            <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>S/. {m.costo}</TableCell>
                                            <TableCell sx={{ color: 'white' }}>{m.duracion_dias} días</TableCell>
                                            <TableCell align="right">
                                                <Button sx={{ color: '#FFD700' }} onClick={() => abrirEditarPlan(m)}><Edit fontSize="small" /></Button>
                                                <Button sx={{ color: '#f5576c' }} onClick={() => eliminarPlan(m)}><Delete fontSize="small" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {membresias.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ color: 'gray', py: 3 }}>
                                                No hay planes registrados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* ==================== USUARIOS Y PAGOS ==================== */}
                {tab === 1 && (
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd />}
                                onClick={() => setShowAsignar(true)}
                                sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}
                            >
                                Asignar Membresía
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Cliente</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Membresía</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Estado</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Monto</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }}>Vence</TableCell>
                                        <TableCell sx={{ color: '#FFD700', fontWeight: 700 }} align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagos.map((p) => {
                                        const c = estadoChip(p.estado === "Pagado" && Number(p.dias_restantes) < 0 ? "Atrasado" : p.estado);
                                        return (
                                            <TableRow key={p.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                                                <TableCell sx={{ color: 'white' }}>
                                                    <Typography variant="body2" fontWeight={700}>{p.cliente}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{p.correo}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>{p.membresia}</TableCell>
                                                <TableCell>
                                                    <Chip label={c.label} size="small" sx={{ bgcolor: c.bgcolor, color: c.color, fontWeight: 700 }} />
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }}>S/. {p.monto}</TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {p.fecha_fin ? new Date(p.fecha_fin).toLocaleDateString() : "-"}
                                                    {p.dias_restantes != null && (
                                                        <Typography variant="caption" sx={{ display: "block", color: Number(p.dias_restantes) < 0 ? "#f5576c" : "#43e97b" }}>
                                                            {Number(p.dias_restantes) < 0 ? `${Math.abs(p.dias_restantes)} días vencido` : `${p.dias_restantes} días restantes`}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {p.estado !== "Pagado" && (
                                                        <Button variant="contained" size="small" startIcon={<Payments />}
                                                            onClick={() => cobrar(p.id)}
                                                            sx={{ bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}>
                                                            Cobrar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {pagos.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ color: 'gray', py: 3 }}>
                                                No hay pagos registrados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Paper>

            {/* ============ MODAL PLAN ============ */}
            {showFormPlan && (
                <Box sx={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    bgcolor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <Paper sx={{ ...glassStyle, width: '90%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <Button onClick={() => setShowFormPlan(false)} sx={{ position: 'absolute', right: 10, top: 10, color: 'white', minWidth: 0, fontSize: '1.5rem' }}>×</Button>
                        <Typography variant="h5" fontWeight={700} mb={3}>
                            {editandoId ? "Editar Membresía" : "Nuevo Plan de Membresía"}
                        </Typography>
                        <Box component="form" onSubmit={guardarPlan} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField label="Nombre del plan" required value={formPlan.nombre} onChange={(e) => setFormPlan({ ...formPlan, nombre: e.target.value })} sx={inputDark} />
                            <TextField label="Descripción" multiline rows={2} value={formPlan.descripcion} onChange={(e) => setFormPlan({ ...formPlan, descripcion: e.target.value })} sx={inputDark} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField label="Costo (S/.)" type="number" required value={formPlan.costo} onChange={(e) => setFormPlan({ ...formPlan, costo: e.target.value })} sx={inputDark} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Duración (días)" type="number" required value={formPlan.duracion_dias} onChange={(e) => setFormPlan({ ...formPlan, duracion_dias: e.target.value })} sx={inputDark} />
                                </Grid>
                            </Grid>
                            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}>
                                {editandoId ? "GUARDAR CAMBIOS" : "CREAR PLAN"}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* ============ MODAL ASIGNAR MEMBRESÍA ============ */}
            {showAsignar && (
                <Box sx={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    bgcolor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <Paper sx={{ ...glassStyle, width: '90%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <Button onClick={() => setShowAsignar(false)} sx={{ position: 'absolute', right: 10, top: 10, color: 'white', minWidth: 0, fontSize: '1.5rem' }}>×</Button>
                        <Typography variant="h5" fontWeight={700} mb={3}>Asignar Membresía</Typography>
                        <Box component="form" onSubmit={asignarMembresia} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField select label="Cliente" required value={asignar.id_usuario} onChange={(e) => setAsignar({ ...asignar, id_usuario: e.target.value })} sx={inputDark}>
                                {clientes.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.correo})</MenuItem>
                                ))}
                            </TextField>
                            <TextField select label="Plan de membresía" required value={asignar.id_membresia} onChange={(e) => setAsignar({ ...asignar, id_membresia: e.target.value })} sx={inputDark}>
                                {membresias.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>{m.nombre} — S/. {m.costo} / {m.duracion_dias} días</MenuItem>
                                ))}
                            </TextField>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                El pago se crea en estado <b>Pendiente</b>. Luego cobro el pago desde la lista para activar la membresía.
                            </Typography>
                            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, bgcolor: '#FFD700', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#ccac00' } }}>
                                ASIGNAR MEMBRESÍA
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}