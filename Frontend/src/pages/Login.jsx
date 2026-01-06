import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from "../api/axios";
import { Box, Button, Typography, Paper, Avatar, CssBaseline, TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { gymTheme } from "../gymTheme";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Background from "../assets/gym-bg.jpg";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";

export default function Login() {
    const nav = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Validacion de formato de correo
    const esCorreoValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Funcion principal de inicio de sesion
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/usuarios/login", { correo, password });
            
            // Verificacion de respuesta y rol
            if (res.data && res.data.rol) {
                localStorage.setItem("usuario", JSON.stringify(res.data));
                const rolRecibido = res.data.rol;

                // Redireccion por rol
                if (rolRecibido === "Administrador") {
                    nav("/administrador");
                } else if (rolRecibido === "Entrenador") {
                    nav("/entrenador");
                } else {
                    nav("/cliente");
                }
            } else {
                setError("Error: El servidor no devolvio el rol del usuario.");
            }

        } catch (error) {
            console.error(error);
            setError("Correo o contrasena incorrectos");
        } finally {
            setLoading(false);
        }
    };

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
                        width: 420,
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0,0,0,.6)"
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
                            <FitnessCenterIcon sx={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography variant="h4" fontWeight={700}>
                            GymControl
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Inicia sesion para continuar
                        </Typography>

                        <TextField
                            label="Correo"
                            variant="filled"
                            fullWidth
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            error={!!error && !esCorreoValido(correo)}
                            InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: "grey.400" }} /> }}
                            sx={{ input: { color: "white" }, label: { color: "#ccc" } }}
                        />

                        <TextField
                            label="Contrasena"
                            variant="filled"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!error}
                            InputProps={{ startAdornment: <LockIcon sx={{ mr: 1, color: "grey.400" }} /> }}
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
                            onClick={handleLogin}
                            disabled={loading || !correo || !password || !esCorreoValido(correo)}
                            sx={{ mt: 2, borderRadius: 3 }}
                        >
                            {loading ? "Verificando..." : "Iniciar sesion"}
                        </Button>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            ¿No tienes cuenta?{' '}
                            <Link 
                                to="/register" 
                                style={{ 
                                    color: '#90caf9', 
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Registrate aqui
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}