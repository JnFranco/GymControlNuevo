import { useEffect, useRef } from "react";
import api from "../api/axios";

export default function SessionGuard() {
    const lastActivity = useRef(Date.now());
    const tiempoSesion = useRef(0);

    useEffect(() => {
        const haySesion = () => !!localStorage.getItem("usuario");
        if (!haySesion()) return;

        let activo = true;

        // Cargar tiempo de sesión desde la configuración
        api.get("/config")
            .then((res) => {
                if (!activo) return;
                const minutos = Number(res.data?.tiempoSesion) || 0;
                tiempoSesion.current = minutos > 0 ? minutos : 0;
            })
            .catch(() => {});

        const actualizarActividad = () => {
            lastActivity.current = Date.now();
        };

        const eventos = ["mousedown", "keydown", "touchstart", "scroll"];
        eventos.forEach((ev) => window.addEventListener(ev, actualizarActividad));

        // Revisar inactividad cada 30 segundos
        const intervalo = setInterval(() => {
            if (!haySesion()) return;

            const minutos = tiempoSesion.current;
            if (minutos > 0 && Date.now() - lastActivity.current > minutos * 60000) {
                localStorage.removeItem("usuario");
                window.location.href = "/";
            }
        }, 30000);

        return () => {
            activo = false;
            clearInterval(intervalo);
            eventos.forEach((ev) => window.removeEventListener(ev, actualizarActividad));
        };
    }, []);

    return null;
}
