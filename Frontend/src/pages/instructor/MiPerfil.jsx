import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock
} from "@mui/icons-material";
import api from "../../services/api";
import "./MiPerfil.css";

export default function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: ""
  });

  const [formPassword, setFormPassword] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: ""
  });

  const [mostrarPasswords, setMostrarPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });

  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    if (usuarioStorage?.id) {
      try {
        const res = await api.get(`/usuarios/${usuarioStorage.id}`);
        console.log("✅ Usuario obtenido:", res.data);
        setUsuario(res.data);
        setForm({
          nombre: res.data.nombre || "",
          apellido: res.data.apellido || "",
          telefono: res.data.telefono || ""
        });
      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
        setMensaje({
          tipo: 'error',
          texto: 'Error al cargar el perfil'
        });
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormPassword({ ...formPassword, [e.target.name]: e.target.value });
  };

  const toggleMostrarPassword = (campo) => {
    setMostrarPasswords({
      ...mostrarPasswords,
      [campo]: !mostrarPasswords[campo]
    });
  };

  const handleGuardarDatos = async () => {
    try {
      setLoading(true);
      setMensaje({ tipo: '', texto: '' });

      console.log("📤 Actualizando datos personales:", form);

      await api.put(`/usuarios/${usuarioStorage.id}`, {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono
      });

      // Actualizar localStorage
      const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
      localStorage.setItem("usuario", JSON.stringify({
        ...usuarioLS,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono
      }));

      setUsuario({ ...usuario, ...form });
      setEditando(false);
      setMensaje({
        tipo: 'success',
        texto: '✅ Datos actualizados correctamente'
      });

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);

    } catch (error) {
      console.error("❌ Error al actualizar datos:", error);
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.mensaje || 'Error al actualizar datos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPassword = async () => {
    try {
      setLoading(true);
      setMensaje({ tipo: '', texto: '' });

      // Validaciones
      if (!formPassword.passwordActual || !formPassword.passwordNueva || !formPassword.passwordConfirmar) {
        setMensaje({
          tipo: 'error',
          texto: 'Por favor completa todos los campos'
        });
        setLoading(false);
        return;
      }

      if (formPassword.passwordNueva.length < 6) {
        setMensaje({
          tipo: 'error',
          texto: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
        setLoading(false);
        return;
      }

      if (formPassword.passwordNueva !== formPassword.passwordConfirmar) {
        setMensaje({
          tipo: 'error',
          texto: 'Las contraseñas nuevas no coinciden'
        });
        setLoading(false);
        return;
      }

      console.log("📤 Cambiando contraseña...");

      // Primero verificar la contraseña actual
      try {
        await api.post('/usuarios/login', {
          correo: usuario.correo,
          password: formPassword.passwordActual
        });
      } catch (error) {
        setMensaje({
          tipo: 'error',
          texto: 'La contraseña actual es incorrecta'
        });
        setLoading(false);
        return;
      }

      // Si la contraseña actual es correcta, actualizar
      await api.put(`/usuarios/${usuarioStorage.id}`, {
        password: formPassword.passwordNueva
      });

      setCambiandoPassword(false);
      setFormPassword({
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: ""
      });

      setMensaje({
        tipo: 'success',
        texto: '✅ Contraseña actualizada correctamente'
      });

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);

    } catch (error) {
      console.error("❌ Error al cambiar contraseña:", error);
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.mensaje || 'Error al cambiar contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: 'white' }}>Cargando perfil...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Person sx={{ fontSize: 40, color: '#ffd700' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
          Mi Perfil
        </Typography>
      </Box>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 3 }}>
          {mensaje.texto}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA – DATOS PERSONALES */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person sx={{ color: '#ffd700' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Datos Personales
                </Typography>
              </Box>

              {!editando ? (
                <>
                  <PerfilItem label="Nombre" value={usuario.nombre} />
                  <PerfilItem label="Apellido" value={usuario.apellido || "No registrado"} />
                  <PerfilItem label="Correo" value={usuario.correo} />
                  <PerfilItem label="Teléfono" value={usuario.telefono || "No registrado"} />
                  <PerfilItem label="Rol" value={usuario.rol} />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setEditando(true)}
                    sx={{
                      mt: 3,
                      bgcolor: '#ffd700',
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#ffc700' }
                    }}
                  >
                    Editar Datos
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#ffd700' },
                        '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                      }
                    }}
                  />

                  <TextField
                    label="Apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#ffd700' },
                        '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                      }
                    }}
                  />

                  <TextField
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#ffd700' },
                        '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleGuardarDatos}
                      disabled={loading}
                      sx={{
                        bgcolor: '#4caf50',
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setEditando(false);
                        setForm({
                          nombre: usuario.nombre,
                          apellido: usuario.apellido || "",
                          telefono: usuario.telefono || ""
                        });
                      }}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: '#f44336',
                          bgcolor: 'rgba(244,67,54,0.1)'
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA – CAMBIAR CONTRASEÑA */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Lock sx={{ color: '#f44336' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Seguridad
                </Typography>
              </Box>

              {!cambiandoPassword ? (
                <>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Protege tu cuenta cambiando tu contraseña regularmente
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setCambiandoPassword(true)}
                    sx={{
                      borderColor: '#f44336',
                      color: '#f44336',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#f44336',
                        bgcolor: 'rgba(244,67,54,0.1)'
                      }
                    }}
                  >
                    Cambiar Contraseña
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    label="Contraseña Actual"
                    name="passwordActual"
                    type={mostrarPasswords.actual ? 'text' : 'password'}
                    value={formPassword.passwordActual}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleMostrarPassword('actual')}
                            edge="end"
                            sx={{ color: 'rgba(255,255,255,0.7)' }}
                          >
                            {mostrarPasswords.actual ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#f44336' },
                        '&.Mui-focused fieldset': { borderColor: '#f44336' }
                      }
                    }}
                  />

                  <TextField
                    label="Nueva Contraseña"
                    name="passwordNueva"
                    type={mostrarPasswords.nueva ? 'text' : 'password'}
                    value={formPassword.passwordNueva}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleMostrarPassword('nueva')}
                            edge="end"
                            sx={{ color: 'rgba(255,255,255,0.7)' }}
                          >
                            {mostrarPasswords.nueva ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#f44336' },
                        '&.Mui-focused fieldset': { borderColor: '#f44336' }
                      }
                    }}
                  />

                  <TextField
                    label="Confirmar Nueva Contraseña"
                    name="passwordConfirmar"
                    type={mostrarPasswords.confirmar ? 'text' : 'password'}
                    value={formPassword.passwordConfirmar}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleMostrarPassword('confirmar')}
                            edge="end"
                            sx={{ color: 'rgba(255,255,255,0.7)' }}
                          >
                            {mostrarPasswords.confirmar ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: '#f44336' },
                        '&.Mui-focused fieldset': { borderColor: '#f44336' }
                      }
                    }}
                  />

                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
                    La contraseña debe tener al menos 6 caracteres
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCambiarPassword}
                      disabled={loading}
                      sx={{
                        bgcolor: '#f44336',
                        '&:hover': { bgcolor: '#d32f2f' }
                      }}
                    >
                      {loading ? 'Cambiando...' : 'Cambiar'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setCambiandoPassword(false);
                        setFormPassword({
                          passwordActual: "",
                          passwordNueva: "",
                          passwordConfirmar: ""
                        });
                      }}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.5)',
                          bgcolor: 'rgba(255,255,255,0.05)'
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

/* COMPONENTE REUTILIZABLE */
function PerfilItem({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
        {value}
      </Typography>
      <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
    </Box>
  );
}


// import { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Grid
// } from "@mui/material";
// import api from "../../services/api";
// import "./MiPerfil.css";

// export default function MiPerfil() {
//   const [usuario, setUsuario] = useState(null);
//   const [editando, setEditando] = useState(false);

//   const [form, setForm] = useState({
//     nombre: "",
//     telefono: ""
//   });

//   const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

//   useEffect(() => {
//     if (usuarioStorage?.id) {
//       api.get(`/usuarios/${usuarioStorage.id}`)
//         .then(res => {
//           setUsuario(res.data);
//           setForm({
//             nombre: res.data.nombre,
//             telefono: res.data.telefono || ""
//           });
//         })
//         .catch(err => console.error("❌ Error cargando perfil", err));
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleGuardar = async () => {
//     try {
//       await api.put(`/usuarios/${usuarioStorage.id}`, {
//         nombre: form.nombre,
//         telefono: form.telefono
//       });
//       alert("✅ Perfil actualizado");
//       setEditando(false);
//       setUsuario({ ...usuario, ...form });
//     } catch (error) {
//       alert("❌ Error al actualizar perfil");
//     }
//   };

//   if (!usuario) return null;

//   return (
//     <Box>
//       <Typography variant="h4" className="perfil-title">
//         👤 Mi Perfil
//       </Typography>

//       <Grid container spacing={3}>

//         {/* COLUMNA IZQUIERDA – DATOS ACTUALES */}
//         <Grid item xs={12} md={6}>
//           <Card className="perfil-card">
//             <CardContent>
//               <Typography className="perfil-section-title">
//                 Datos actuales
//               </Typography>

//               <PerfilItem label="Nombre" value={usuario.nombre} />
//               <PerfilItem label="Apellido" value={usuario.apellido} />
//               <PerfilItem label="Correo" value={usuario.correo} />
//               <PerfilItem label="Teléfono" value={usuario.telefono || "No registrado"} />

//               <Button
//                 variant="outlined"
//                 className="editar-btn"
//                 onClick={() => setEditando(true)}
//               >
//                 Editar perfil
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* COLUMNA DERECHA – EDITAR */}
//         {editando && (
//           <Grid item xs={12} md={6}>
//             <Card className="perfil-card">
//               <CardContent>
//                 <Typography className="perfil-section-title">
//                   Editar información
//                 </Typography>

//                 <TextField
//                   label="¿Cómo quieres que te llamemos?"
//                   name="nombre"
//                   value={form.nombre}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />

//                 <TextField
//                   label="Número de celular"
//                   name="telefono"
//                   value={form.telefono}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />

//                 <Button
//                   variant="contained"
//                   className="guardar-btn"
//                   onClick={handleGuardar}
//                 >
//                   Guardar cambios
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}

//       </Grid>
//     </Box>
//   );
// }

// /* COMPONENTE REUTILIZABLE */
// function PerfilItem({ label, value }) {
//   return (
//     <Box className="perfil-item">
//       <Typography className="perfil-label">{label}</Typography>
//       <Typography className="perfil-value">{value}</Typography>
//     </Box>
//   );
// }
