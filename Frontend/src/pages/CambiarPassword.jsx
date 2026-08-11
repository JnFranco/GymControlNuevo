import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Button, Typography, Paper, Avatar, CssBaseline, TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { gymTheme } from "../gymTheme";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Background from "../assets/gym-bg.jpg";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function CambiarPassword() {
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (password !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/usuarios/${usuario.id}/cambiar-password`, { password });

            const actualizado = { ...usuario, debe_cambiar_password: false };
            localStorage.setItem("usuario", JSON.stringify(actualizado));

            if (actualizado.rol === "Administrador") {
                nav("/administrador");
            } else if (actualizado.rol === "Entrenador") {
                nav("/entrenador");
            } else {
                nav("/cliente");
            }
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.mensaje || "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return <Navigate to="/" replace />;

    return (
        <ThemeProvider theme={gymTheme}>
            <CssBaseline />
            <Box
                sx={{
                    height: "100vh",
                    background: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${Background}) center/cover no-repeat`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Paper
                    elevation={20}
                    sx={{
                        p: 5,
                        borderRadius: 5,
                        width: { xs: '90%', sm: 420 },
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0,0,0,.6)"
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: "secondary.main" }}>
                            <FitnessCenterIcon sx={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography variant="h4" fontWeight={700}>
                            GymControl
                        </Typography>

                        <Typography variant="body2" color="text.secondary" align="center">
                            Por política del sistema debes cambiar tu contraseña antes de continuar
                        </Typography>

                        <TextField
                            label="Nueva contraseña"
                            variant="filled"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ startAdornment: <LockResetIcon sx={{ mr: 1, color: "grey.400" }} /> }}
                            sx={{ input: { color: "white" }, label: { color: "#ccc" } }}
                        />

                        <TextField
                            label="Confirmar contraseña"
                            variant="filled"
                            fullWidth
                            type="password"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            InputProps={{ startAdornment: <LockResetIcon sx={{ mr: 1, color: "grey.400" }} /> }}
                            sx={{ input: { color: "white" }, label: { color: "#ccc" } }}
                        />

                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading || !password || !confirmar}
                            sx={{ mt: 2, borderRadius: 3 }}
                        >
                            {loading ? "Guardando..." : "Cambiar contraseña"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
