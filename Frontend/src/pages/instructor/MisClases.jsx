import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../services/api";

export default function MisClasesInstructor() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        
        if (!usuarioStr) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        const usuario = JSON.parse(usuarioStr);
        
        if (!usuario?.id) {
          setError("Usuario sin ID válido");
          setLoading(false);
          return;
        }

        console.log("🔍 Buscando clases para instructor ID:", usuario.id);

        const res = await api.get(`/clases/instructor/${usuario.id}`);
        
        console.log("✅ Clases obtenidas:", res.data);
        
        setClases(res.data);
        setError(null);
        
      } catch (error) {
        console.error("❌ Error al cargar mis clases:", error);
        console.error("❌ Detalles:", error.response?.data);
        setError(
          error.response?.data?.mensaje || 
          "Error al cargar las clases. Por favor intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, []);

  const handleVerDetalle = (clase) => {
    setClaseSeleccionada(clase);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setClaseSeleccionada(null);
  };

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <FitnessCenterIcon sx={{ fontSize: 40, color: "#FFD700" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>
            Mis Clases
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: 4, 
            backgroundColor: "rgba(255,0,0,0.1)", 
            borderRadius: 2,
            border: "2px solid #ff0000"
          }}
        >
          <Typography color="error" variant="h6" align="center">
            ⚠️ {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* TÍTULO */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <FitnessCenterIcon sx={{ fontSize: 40, color: "#f5f11aff" }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>
          Mis Clases
        </Typography>
      </Box>

      <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}>
        Lista de clases asignadas a ti como instructor
      </Typography>

      {/* TABLA */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 3
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                Clase
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                Cupos
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "white", py: 4 }}>
                  Cargando clases...
                </TableCell>
              </TableRow>
            ) : clases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <FitnessCenterIcon sx={{ fontSize: 60, color: "rgba(255,255,255,0.2)", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      No tienes clases asignadas
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Contacta al administrador para asignarte clases
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              clases.map((clase) => (
                <TableRow 
                  key={clase.id}
                  sx={{ 
                    '&:hover': { backgroundColor: "rgba(255,255,255,0.05)" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell sx={{ color: "white" }}>
                    <Typography variant="body1" fontWeight={600}>
                      {clase.nombre}
                    </Typography>
                    {clase.descripcion && (
                      <Typography variant="caption" color="text.secondary">
                        {clase.descripcion}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={clase.cupos}
                      sx={{ 
                        bgcolor: "#f5f11aff", 
                        color: "black",
                        fontWeight: 600
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={clase.activo ? "Activa" : "Inactiva"}
                      color={clase.activo ? "success" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleVerDetalle(clase)}
                      sx={{
                        bgcolor: "#f5f11aff",
                        color: "black",
                        fontWeight: 600,
                        '&:hover': { bgcolor: "#e5e10a" }
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* NOTA */}
      <Typography sx={{ mt: 3, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
        👉 Solo puedes visualizar tus clases. La creación y eliminación de clases es responsabilidad del administrador.
      </Typography>

      {/* MODAL DE DETALLE */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(30,30,30,0.98)",
            color: "white"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
          Detalle de la Clase
        </DialogTitle>
        <DialogContent dividers>
          {claseSeleccionada && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {claseSeleccionada.nombre}
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Descripción:
                </Typography>
                <Typography variant="body1">
                  {claseSeleccionada.descripcion || "Sin descripción"}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cupos disponibles:
                </Typography>
                <Chip 
                  label={claseSeleccionada.cupos}
                  sx={{ 
                    bgcolor: "#f5f11aff", 
                    color: "black",
                    fontWeight: 600,
                    fontSize: "1rem"
                  }}
                />
              </Box>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estado:
                </Typography>
                <Chip 
                  label={claseSeleccionada.activo ? "Activa" : "Inactiva"}
                  color={claseSeleccionada.activo ? "success" : "default"}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              bgcolor: "#f5f11aff",
              color: "black",
              fontWeight: 600,
              '&:hover': { bgcolor: "#e5e10a" }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Chip
// } from "@mui/material";

// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import api from "../../services/api";
// import "./MisClases.css";

// export default function MisClases() {
//   const [clases, setClases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchClases = async () => {
//       try {
//         // Obtener usuario del localStorage dentro del useEffect
//         const usuarioStr = localStorage.getItem("usuario");
        
//         if (!usuarioStr) {
//           setError("No hay sesión activa");
//           setLoading(false);
//           return;
//         }

//         const usuario = JSON.parse(usuarioStr);
        
//         if (!usuario?.id) {
//           setError("Usuario sin ID válido");
//           setLoading(false);
//           return;
//         }

//         console.log("🔍 Buscando clases para instructor ID:", usuario.id);

//         const res = await api.get(`/clases/instructor/${usuario.id}`);
        
//         console.log("✅ Clases obtenidas:", res.data);
        
//         setClases(res.data);
//         setError(null);
        
//       } catch (error) {
//         console.error("❌ Error al cargar mis clases:", error);
//         console.error("❌ Detalles:", error.response?.data);
//         setError(
//           error.response?.data?.error || 
//           "Error al cargar las clases. Por favor intenta de nuevo."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClases();
//   }, []); // ✅ Array vacío - solo se ejecuta una vez al montar el componente

//   // Mostrar error si existe
//   if (error) {
//     return (
//       <Box className="mis-clases-container">
//         <Box className="title-box">
//           <FitnessCenterIcon className="title-icon" />
//           <Typography variant="h4" className="title">
//             Mis Clases
//           </Typography>
//         </Box>
//         <Box className="error-box">
//           <Typography color="error" variant="h6" align="center">
//             ⚠️ {error}
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box className="mis-clases-container">
//       {/* TÍTULO */}
//       <Box className="title-box">
//         <FitnessCenterIcon className="title-icon" />
//         <Typography variant="h4" className="title">
//           Mis Clases
//         </Typography>
//       </Box>

//       <Typography className="subtitle">
//         Lista de clases asignadas a ti como instructor
//       </Typography>

//       {/* TABLA */}
//       <TableContainer component={Paper} className="table-container">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Clase</TableCell>
//               <TableCell align="center">Cupos</TableCell>
//               <TableCell align="center">Estado</TableCell>
//               <TableCell align="center">Acciones</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={4} align="center">
//                   Cargando clases...
//                 </TableCell>
//               </TableRow>
//             ) : clases.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={4} align="center">
//                   No tienes clases asignadas
//                 </TableCell>
//               </TableRow>
//             ) : (
//               clases.map((clase) => (
//                 <TableRow key={clase.id}>
//                   <TableCell>{clase.nombre}</TableCell>

//                   <TableCell align="center">
//                     {clase.cupos}
//                   </TableCell>

//                   <TableCell align="center">
//                     <Chip
//                       label={clase.activo ? "Activa" : "Inactiva"}
//                       className={
//                         clase.activo ? "chip-activa" : "chip-inactiva"
//                       }
//                     />
//                   </TableCell>

//                   <TableCell align="center">
//                     <Button
//                       variant="contained"
//                       className="ver-btn"
//                       onClick={() =>
//                         console.log("Ver clase:", clase.id)
//                       }
//                     >
//                       Ver
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* NOTA */}
//       <Typography className="note">
//         👉 Solo puedes visualizar tus clases.  
//         La creación y eliminación de clases es responsabilidad del administrador.
//       </Typography>
//     </Box>
//   );
// }
