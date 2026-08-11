import { useState } from "react";
import { Box, Drawer, IconButton, AppBar, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Menu as MenuIcon, FitnessCenter } from "@mui/icons-material";
import SidebarCliente from "./components/SidebarCliente";
import InicioView from "./views/InicioView";
import ClasesView from "./views/ClasesView";
import ProgresoView from "./views/ProgresoView";
import PagosView from "./views/PagosView";
import PerfilView from "./views/PerfilView";

const SIDEBAR_W = 280;

export default function DashboardCliente() {
    const [activeTab, setActiveTab] = useState("inicio");
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleTab = (tab) => {
        setActiveTab(tab);
        if (isMobile) setMobileOpen(false);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#000", color: "white", overflow: "hidden" }}>
            {isMobile && (
                <AppBar position="fixed" elevation={0} sx={{ bgcolor: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <Toolbar variant="dense">
                        <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: "white", mr: 1 }}>
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ bgcolor: "#FFD700", borderRadius: "50%", p: 0.4, display: "flex" }}>
                                <FitnessCenter sx={{ color: "black", fontSize: 16 }} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={800}>GymControl</Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                PaperProps={{ sx: { width: SIDEBAR_W, bgcolor: "#000", borderRight: "1px solid rgba(255,255,255,0.1)" } }}
            >
                <SidebarCliente activeTab={activeTab} setActiveTab={handleTab} />
            </Drawer>

            <Box sx={{ display: { xs: "none", sm: "flex" }, width: SIDEBAR_W, flexShrink: 0 }}>
                <SidebarCliente activeTab={activeTab} setActiveTab={handleTab} />
            </Box>

            <Box component="main" sx={{
                flexGrow: 1,
                minWidth: 0,
                p: { xs: 2, md: 4 },
                pt: isMobile ? 8 : 4,
            }}>
                {activeTab === "inicio" && <InicioView />}
                {activeTab === "clases" && <ClasesView />}
                {activeTab === "progreso" && <ProgresoView />}
                {activeTab === "pagos" && <PagosView />}
                {activeTab === "perfil" && <PerfilView />}
            </Box>
        </Box>
    );
}
