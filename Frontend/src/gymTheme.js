import { createTheme } from "@mui/material/styles";

export const gymTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
        default: "#0d0d12",
        paper: "rgba(255,255,255,0.05)",
        },
        text: {
        primary: "#ffffff",
        secondary: "#cfcfcf",
        },
        primary: {
        main: "#f5f11aff",
        },
        success: {
        main: "#d3dd94ff",
        }
    },

    typography: {
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter, sans-serif",
        h1: {
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#f0ededff"
            },
            h2: {
            fontWeight: 700,
            letterSpacing: "-0.3px",
            color: "#ffffff"
            },
            h3: {
            fontWeight: 700,
            color: "#ffffff"
            },
            h4: {
            fontWeight: 700,
            color: "#ffffff"
            },
            h5: {
            fontWeight: 600,
            color: "#ffffff"
            },
            h6: {
            fontWeight: 600,
            color: "#ffffff"
            },
            body1: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#d0d0d0"
            },
            body2: {
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "#bdbdbd"
            },
            button: {
            fontWeight: 600,
            letterSpacing: "0.3px"
            },
    },


    components: {
        MuiCard: {
        styleOverrides: {
            root: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            }
        }
        },

        MuiPaper: {
        styleOverrides: {
            root: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            }
        }
        },

        MuiChip: {
        styleOverrides: {
            root: {
            color: "#fff",
            background: "rgba(255,255,255,0.12)",
            }
        }
        },

        MuiButton: {
        styleOverrides: {
            root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            }
        }
        }
    }
});
