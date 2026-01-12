import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";

const DIAS_SEMANA = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

export default function ClaseForm({ open, onClose, clase, recargar }) {
    // ===============================
    // ESTADOS
    // ===============================
    const [form, setForm] = useState({
        nombre: "",
        dias: [],
        hora_inicio: "",
        hora_fin: "",
        id_entrenador: "",
        cupos: "",
        activo: 1
    });

    const [entrenadores, setEntrenadores] = useState([]);
    const [clasesExistentes, setClasesExistentes] = useState([]);
    const [usarClaseExistente, setUsarClaseExistente] = useState(true);

    // ===============================
    // CARGAR ENTRENADORES
    // ===============================
    useEffect(() => {
        const cargarEntrenadores = async () => {
        try {
            const res = await api.get("/usuarios");

            const soloEntrenadores = res.data.filter(
            u => u.id_rol === 2 && u.activo === 1
            );

            setEntrenadores(soloEntrenadores);
        } catch (error) {
            console.error("Error cargando entrenadores", error);
        }
        };

        cargarEntrenadores();
    }, []);

    // ===============================
    // CARGAR CLASES EXISTENTES
    // ===============================
    useEffect(() => {
        api.get("/clases")
        .then(res => setClasesExistentes(res.data))
        .catch(() => setClasesExistentes([]));
    }, []);

    // ===============================
    // CARGAR DATOS AL EDITAR
    // ===============================
        // 🔹 CARGAR DATOS AL EDITAR
    useEffect(() => {
    if (!clase) return;

    setTimeout(() => {
        setForm({
        nombre: clase.nombre || "",
        dias: clase.dias || [],
        hora_inicio: clase.hora_inicio || "",
        hora_fin: clase.hora_fin || "",
        id_entrenador: clase.id_entrenador || "",
        cupos: clase.cupos || "",
        activo: clase.activo ?? 1
        });
    }, 0);
    }, [clase]);

    // ===============================
    // HANDLERS
    // ===============================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ===============================
    // GUARDAR CLASE
    // ===============================
    const guardarClase = async () => {
    // 🔴 VALIDAR DUPLICADO EN FRONT
    const duplicado = clasesExistentes.some(c =>
        c.nombre === form.nombre &&
        c.hora_inicio === form.hora_inicio &&
        c.hora_fin === form.hora_fin &&
        c.dias?.some(d => form.dias.includes(d))
    );

    if (duplicado) {
        alert("Esta clase ya existe en ese día y horario");
        return;
    }

    try {
        if (clase) {
        await api.put(`/clases/${clase.id}`, form);
        } else {
        await api.post("/clases", form);
        }

        recargar();
        onClose();

    } catch (error) {
        console.error("Error guardando clase", error);

        // ✅ MOSTRAR MENSAJE REAL DEL BACKEND
        if (error.response && error.response.data?.mensaje) {
        alert(error.response.data.mensaje);
        } else {
        alert("Ocurrió un error al guardar la clase");
        }
    }
    };


    // ===============================
    // RENDER
    // ===============================
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
            {clase ? "Editar Clase" : "Nueva Clase"}
        </DialogTitle>

        <DialogContent>

            {/* USAR EXISTENTE O NUEVA */}
            <TextField
            select
            label="Tipo de clase"
            fullWidth
            margin="dense"
            value={usarClaseExistente ? "existente" : "nueva"}
            onChange={(e) => setUsarClaseExistente(e.target.value === "existente")}
            >
            <MenuItem value="existente">Usar clase existente</MenuItem>
            <MenuItem value="nueva">Crear nueva clase</MenuItem>
            </TextField>

            {/* NOMBRE */}
            {usarClaseExistente ? (
            <TextField
                select
                label="Clase"
                name="nombre"
                fullWidth
                margin="dense"
                value={form.nombre}
                onChange={handleChange}
            >
                {[...new Set(clasesExistentes.map(c => c.nombre))].map(nombre => (
                <MenuItem key={nombre} value={nombre}>
                    {nombre}
                </MenuItem>
                ))}
            </TextField>
            ) : (
            <TextField
                label="Nombre de nueva clase"
                name="nombre"
                fullWidth
                margin="dense"
                value={form.nombre}
                onChange={handleChange}
            />
            )}

            {/* DÍAS */}
            <TextField
            select
            label="Días"
            name="dias"
            fullWidth
            margin="dense"
            SelectProps={{
                multiple: true,
                renderValue: (selected) => selected.join(", ")
            }}
            value={form.dias}
            onChange={handleChange}
            >
            {DIAS_SEMANA.map(dia => (
                <MenuItem key={dia} value={dia}>
                <Checkbox checked={form.dias.includes(dia)} />
                <ListItemText primary={dia} />
                </MenuItem>
            ))}
            </TextField>

            {/* HORARIO */}
            <TextField
            label="Hora inicio"
            type="time"
            name="hora_inicio"
            fullWidth
            margin="dense"
            value={form.hora_inicio}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            />

            <TextField
            label="Hora fin"
            type="time"
            name="hora_fin"
            fullWidth
            margin="dense"
            value={form.hora_fin}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            />

            {/* ENTRENADOR */}
            <TextField
            select
            label="Instructor"
            name="id_entrenador"
            fullWidth
            margin="dense"
            value={form.id_entrenador}
            onChange={handleChange}
            >
            {entrenadores.map(e => (
                <MenuItem key={e.id} value={e.id}>
                {e.nombre} {e.apellido}
                </MenuItem>
            ))}
            </TextField>

            {/* CUPOS */}
            <TextField
            label="Cupos"
            name="cupos"
            type="number"
            fullWidth
            margin="dense"
            value={form.cupos}
            onChange={handleChange}
            />

            {/* ESTADO */}
            <TextField
            select
            label="Estado"
            name="activo"
            fullWidth
            margin="dense"
            value={form.activo}
            onChange={handleChange}
            >
            <MenuItem value={1}>Activa</MenuItem>
            <MenuItem value={0}>Inactiva</MenuItem>
            </TextField>

        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={guardarClase}>
            Guardar
            </Button>
        </DialogActions>
        </Dialog>
    );
}
