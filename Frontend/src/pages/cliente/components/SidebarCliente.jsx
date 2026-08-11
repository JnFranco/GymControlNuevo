import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, FitnessCenter, TrendingUp, Payment, Person, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function SidebarCliente({ activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.clear();
        navigate("/");
    };

    const menuItems = [
        { id: "inicio", text: "Inicio", icon: <Dashboard /> },
        { id: "clases", text: "Clases", icon: <FitnessCenter /> },
        { id: "progreso", text: "Mi Progreso", icon: <TrendingUp /> },
        { id: "pagos", text: "Pagos", icon: <Payment /> },
        { id: "perfil", text: "Perfil", icon: <Person /> }
    ];

    return (
        <Box sx={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.1)",
            display: "flex", flexDirection: "column",
            p: 2,
            bgcolor: "#000", color: "white"
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 6, p: 2 }}>
                <Box sx={{ bgcolor: "#FFD700", borderRadius: "50%", p: 0.5, display: "flex" }}>
                    <FitnessCenter sx={{ color: "black", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 1 }}>
                    GymControl
                </Typography>
            </Box>

            <List sx={{ px: 1 }}>
                {menuItems.map(item => (
                    <ListItemButton
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        sx={{
                            borderRadius: 2, mb: 1, py: 1.5,
                            bgcolor: activeTab === item.id ? "rgba(255,215,0,0.15)" : "transparent",
                            borderLeft: activeTab === item.id ? "4px solid #FFD700" : "4px solid transparent",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                        }}
                    >
                        <ListItemIcon sx={{ color: activeTab === item.id ? "#FFD700" : "rgba(255,255,255,0.7)", minWidth: 40 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: activeTab === item.id ? 700 : 400, fontSize: "0.95rem" }} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ marginTop: "auto", px: 1 }}>
                <ListItemButton
                    onClick={cerrarSesion}
                    sx={{
                        borderRadius: 2, py: 1.5,
                        color: "#f44336",
                        "&:hover": { bgcolor: "rgba(244,67,54,0.12)" }
                    }}
                >
                    <ListItemIcon sx={{ color: "#f44336", minWidth: 40 }}>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }} />
                </ListItemButton>
            </Box>
        </Box>
    );
}
