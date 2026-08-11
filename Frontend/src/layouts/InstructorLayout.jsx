import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem, Drawer, AppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { FitnessCenter, Dashboard, Schedule, CheckCircle, Group, Person, ExitToApp, Menu as MenuIcon } from "@mui/icons-material";
import "./InstructorLayout.css";

const NAV_ROUTES = ["/entrenador", "/entrenador/mis-clases", "/entrenador/horarios", "/entrenador/asistencias", "/entrenador/alumnos"];
const SIDEBAR_W = 280;

const menuItems = [
    { path: "/entrenador", icon: <Dashboard />, label: "Dashboard" },
    { path: "/entrenador/mis-clases", icon: <FitnessCenter />, label: "Mis Clases" },
    { path: "/entrenador/horarios", icon: <Schedule />, label: "Horarios" },
    { path: "/entrenador/asistencias", icon: <CheckCircle />, label: "Asistencias" },
    { path: "/entrenador/alumnos", icon: <Group />, label: "Alumnos" },
    { path: "/entrenador/perfil", icon: <Person />, label: "Mi Perfil" },
];

export default function InstructorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario, setUsuario] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const data = localStorage.getItem("usuario");
        if (data) setUsuario(JSON.parse(data));
    }, []);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("correo");
        navigate("/");
    };

    const handleNav = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const sidebarContent = (
        <>
            <Box className="logo">
                <Avatar className="logo-icon"><FitnessCenter /></Avatar>
                <Typography variant="h6">GymControl</Typography>
            </Box>
            {menuItems.map((item) => (
                <Button
                    key={item.path}
                    className={`menu-button ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNav(item.path)}
                >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                </Button>
            ))}
            <Box sx={{ marginTop: "auto", paddingTop: 2 }}>
                <Button className="menu-button logout-button" onClick={handleLogout} sx={{ color: "#f44336 !important", "&:hover": { background: "rgba(244,67,54,0.1) !important" } }}>
                    <span className="menu-icon"><ExitToApp /></span>
                    <span className="menu-label">Cerrar Sesión</span>
                </Button>
            </Box>
        </>
    );

    return (
        <Box className="dashboard-container">
            {isMobile && (
                <AppBar position="fixed" elevation={0} sx={{ bgcolor: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.08)", zIndex: 1300 }}>
                    <Toolbar variant="dense">
                        <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: "white", mr: 1 }}>
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: "#ffd700", color: "black", fontSize: 14 }}>
                                {usuario?.nombre?.charAt(0) || "I"}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {usuario?.nombre ? `${usuario.nombre}` : "Instructor"}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                PaperProps={{ sx: { width: SIDEBAR_W, bgcolor: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", borderRight: "1px solid rgba(255,255,255,0.1)" } }}
            >
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                    {sidebarContent}
                </Box>
            </Drawer>

            <Box className="instructor-sidebar-desktop" sx={{ width: SIDEBAR_W, flexShrink: 0 }}>
                {sidebarContent}
            </Box>

            <Box className="instructor-main-content" sx={{ pt: isMobile ? 7 : 0 }}>
                <Box className="header">
                    <Typography variant="h4" className="title">
                        {usuario?.nombre ? `Hola, ${usuario.nombre}` : "Dashboard del Instructor"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", display: { xs: "none", sm: "block" } }}>
                            {usuario?.correo}
                        </Typography>
                        <IconButton onClick={handleMenuOpen}>
                            <Avatar sx={{ bgcolor: "#ffd700", color: "black", cursor: "pointer" }}>
                                {usuario?.nombre?.charAt(0) || "I"}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            sx={{ "& .MuiPaper-root": { background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "white" } }}
                        >
                            <MenuItem onClick={() => { handleMenuClose(); navigate("/entrenador/perfil"); }}><Person sx={{ mr: 1 }} /> Mi Perfil</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: "#f44336", "&:hover": { background: "rgba(244,67,54,0.1)" } }}><ExitToApp sx={{ mr: 1 }} /> Cerrar Sesión</MenuItem>
                        </Menu>
                    </Box>
                </Box>
                <Outlet />
            </Box>
        </Box>
    );
}
