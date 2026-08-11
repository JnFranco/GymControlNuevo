import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export function useNotify() {
    return useContext(NotificationContext);
}

export default function NotificationProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [severity, setSeverity] = useState("success");

    const notify = useCallback((msg, sev = "success") => {
        setMensaje(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const cerrar = (e, razon) => {
        if (razon === "clickaway") return;
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={cerrar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity={severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {mensaje}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}
