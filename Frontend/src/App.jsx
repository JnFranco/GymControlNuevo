import { Routes, Route } from "react-router-dom";
import InstructorLayout from './layouts/InstructorLayout';
import Layout from "./layouts/Layout";

// PAGES - auth
import Login from "./pages/Login";
import Register from "./pages/Register";

//Pages - cliente
import DashboardCliente from "./pages/cliente/DashboardCliente";

//Pages - instructor
import DashboardInstructor from "./pages/instructor/DashboardInstructor";
// import MyClasses from "./pages/instructor/MyClasses";
import MisClases from "./pages/instructor/MisClases";
import Horarios from "./pages/instructor/Horarios";
import Asistencias from "./pages/instructor/Asistencias"
import Alumnos from "./pages/instructor/Alumnos"
import MiPerfil from "./pages/instructor/MiPerfil"

//Pages - admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ReportesView from "./pages/admin/views/ReportesView";

export default function App() {
  return (
    <Routes>

      {/* LOGIN sin layout */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* REGISTER
      <Route path="/register" element={<Register />} /> */}

      {/* RUTAS CON LAYOUT */}
      <Route element={<Layout />}>

        {/* CLIENTE */}
        <Route path="/cliente" element={<DashboardCliente />} />


        {/* RUTAS INSTRUCTOR */}
        <Route path="/entrenador" element={<InstructorLayout />}>
          <Route index element={<DashboardInstructor />} />
          <Route path="mis-clases" element={<MisClases/>} />
          <Route path="horarios" element={<Horarios/>} />
          <Route path="asistencias" element={<Asistencias/>} />
          <Route path="alumnos" element={<Alumnos/>} />
          <Route path="perfil" element={<MiPerfil/>} />
        </Route> {/* AGREGAR */}
        {/* <Route path="/entrenador/mis-clases" element={<MyClasses />} /> */}
        
        {/* REDIRECT para mantener compatibilidad */}
        {/* <Route path="/instructor" element={<Navigate to="/entrenador" replace />} /> */}
    

        {/* ADMIN */}
        <Route path="/administrador" element={<DashboardAdmin />} />

        {/* REDIRECT para mantener compatibilidad
        <Route path="/admin" element={<Navigate to="/administrador" replace />} /> */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1 style={{color:"white"}}>404</h1>} />

    </Routes>
  );
}


// import { Routes, Route } from 'react-router-dom';

// import Login from './pages/Login';

// // CLIENTE
// import DashboardCliente from "./pages/DashboardCliente";
// import MisReservas from './pages/MisReservas';
// import ClasesDisponibles from './pages/ClasesDisponibles';
// import MiMembresia from './pages/MiMembresia';

// // INSTRUCTOR
// import DashboardInstructor from "./pages/DashboardInstructor";
// import MarcarAsistencia from './pages/MarcarAsistencia';

// // ADMIN
// import DashboardAdmin from "./pages/DashboardAdmin";
// import HorariosCrud from './pages/HorariosCrud';
// import InstructoresCrud from './pages/InstructoresCrud';
// import Reportes from './pages/Reportes';

// export default function App() {
//   return (
//     <Routes>

//       {/* LOGIN */}
//       <Route path="/" element={<Login />} />

//       {/* CLIENTE */}
//       <Route path="/cliente" element={<DashboardCliente />} />
//       <Route path="/cliente/reservas" element={<MisReservas />} />
//       <Route path="/cliente/clases" element={<ClasesDisponibles />} />
//       <Route path="/cliente/membresia" element={<MiMembresia />} />

//       {/* INSTRUCTOR */}
//       <Route path="/entrenador" element={<DashboardInstructor />} />
//       <Route path="/entrenador/asistencia" element={<MarcarAsistencia />} />

//       {/* ADMIN */}
//       <Route path="/administrador" element={<DashboardAdmin />} />
//       <Route path="/administrador/horarios" element={<HorariosCrud />} />
//       <Route path="/administrador/instructores" element={<InstructoresCrud />} />
//       <Route path="/administrador/reportes" element={<Reportes />} />

//       {/* 404 */}
//       <Route path="*" element={<h1 style={{color:"white"}}>404 - Página no encontrada</h1>} />

//     </Routes>

//   );

// }
