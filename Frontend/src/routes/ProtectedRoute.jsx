import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolPermitido }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // ❌ No está logueado
    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    // 🔐 Debe cambiar la contraseña antes de continuar
    if (usuario.debe_cambiar_password) {
        return <Navigate to="/cambiar-password" replace />;
    }

    // ❌ Rol incorrecto
    if (rolPermitido && usuario.rol !== rolPermitido) {
        return <Navigate to="/" replace />;
    }

    // ✅ Todo OK
    return children;
}
