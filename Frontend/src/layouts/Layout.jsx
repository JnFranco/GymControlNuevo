import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import { gymTheme } from "../gymTheme";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FULLSCREEN_ROUTES = ["/cliente", "/administrador"];

export default function Layout({ rol }) {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  return (
    <ThemeProvider theme={gymTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: isFullscreen
            ? "#000"
            : "linear-gradient(180deg, #0d0d12 0%, #1b1b26 100%)",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden"
        }}
      >
        {!isFullscreen && <Header rol={rol} />}

        <Box
          sx={{
            flexGrow: 1,
            px: isFullscreen ? 0 : 4,
            py: isFullscreen ? 0 : 3
          }}
        >
          <Outlet />
        </Box>

        {!isFullscreen && <Footer />}
      </Box>
    </ThemeProvider>
  );
}
