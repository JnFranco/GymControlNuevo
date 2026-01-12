import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert
} from "@mui/material";

import api from "../../../api/axios";

// ===============================
// ESTILO GLASS
// ===============================
const glassStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    p: 3,
    color: "white"
};

export default function ReportesView() {
    const [tipo, setTipo] = useState("");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    // ===============================
    // GENERAR REPORTE
    // ===============================
    const generarReporte = async () => {
        if (!tipo) {
        setError("Selecciona un tipo de reporte");
        return;
        }

        try {
        setError("");
        const res = await api.get(`/admin/reportes/${tipo}`);
        setData(res.data || []);
        } catch (err) {
        console.error(err);
        setError("No se pudo generar el reporte");
        setData([]);
        }
    };

    // ===============================
    // EXPORTAR PDF
    // ===============================
    const exportarPDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF();

    // ==========================
    // MARCA DE AGUA
    // ==========================
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setTextColor(200, 200, 200); // gris claro
    doc.setFontSize(50);

    doc.text(
        "GYM CONTROL",
        pageWidth / 2,
        pageHeight / 2,
        {
        align: "center",
        angle: 45
        }
    );

    // ==========================
    // TÍTULO
    // ==========================
    doc.setTextColor(0, 0, 0); // vuelve a negro
    doc.setFontSize(16);
    doc.text(`Reporte de ${tipo}`, 14, 15);

    // ==========================
    // TABLA
    // ==========================
    autoTable(doc, {
        startY: 25,
        head: [Object.keys(data[0])],
        body: data.map(obj => Object.values(obj)),
        styles: { fontSize: 9 },
        didDrawPage: () => {
        // Marca de agua en cada página
        doc.setTextColor(220, 220, 220);
        doc.setFontSize(50);
        doc.text(
            "GYM CONTROL",
            pageWidth / 2,
            pageHeight / 2,
            { align: "center", angle: 45 }
        );
        }
    });

    doc.save(`reporte_${tipo}.pdf`);
    };



    // ===============================
    // EXPORTAR CSV (EXCEL)
    // ===============================
    const exportarCSV = () => {
        if (data.length === 0) return;

        const columnas = Object.keys(data[0]);
        const filas = data.map(obj =>
        columnas.map(c => `"${obj[c] ?? ""}"`).join(",")
        );

        const csv = [columnas.join(","), ...filas].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_${tipo}.csv`;
        link.click();
    };

    return (
        <Box>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
            Reportes
        </Typography>

        <Paper sx={{ ...glassStyle, mb: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
            Generar Reporte
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
            <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Tipo de reporte</InputLabel>
                <Select
                value={tipo}
                label="Tipo de reporte"
                onChange={(e) => setTipo(e.target.value)}
                >
                <MenuItem value="usuarios">Usuarios</MenuItem>
                <MenuItem value="entrenadores">Entrenadores</MenuItem>
                <MenuItem value="clases">Clases</MenuItem>
                <MenuItem value="membresias">Membresías</MenuItem>
                </Select>
            </FormControl>

            <Button variant="contained" onClick={generarReporte}>
                Generar
            </Button>

            <Button variant="outlined" onClick={exportarPDF}>
                PDF
            </Button>

            <Button variant="outlined" onClick={exportarCSV}>
                Excel
            </Button>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {data.length > 0 && (
            <Table size="small">
                <TableHead>
                <TableRow>
                    {Object.keys(data[0]).map(col => (
                    <TableCell key={col}>{col}</TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row, i) => (
                    <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                        <TableCell key={j}>
                        {val === 1 ? "Activo" : val === 0 ? "Inactivo" : val}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </Paper>
        </Box>
    );
}
