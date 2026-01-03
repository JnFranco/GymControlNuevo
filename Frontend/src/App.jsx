import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import InstructorLayout from "./layouts/InstructorLayout"; // 👈 Nuevo

// PAGES - auth
import Login from "./pages/Login";
import Register from "./pages/Register";



// Pages - cliente
import DashboardCliente from "./pages/cliente/DashboardCliente";

// Pages - instructor
import DashboardInstructor from "./pages/instructor/DashboardInstructor";
import MisClases from "./pages/instructor/MisClases";
import Horarios from "./pages/instructor/Horarios";

// Pages - admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";

export default function App() {
  return (
    <Routes>
      {/* LOGIN sin layout */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* RUTAS CON LAYOUT GENERAL */}
      <Route element={<Layout />}>
        {/* CLIENTE */}
        <Route path="/cliente" element={<DashboardCliente />} />

        {/* ADMIN */}
        <Route path="/administrador" element={<DashboardAdmin />} />
      </Route>

      {/* RUTAS DEL INSTRUCTOR CON SU PROPIO LAYOUT */}
      <Route element={<InstructorLayout />}>
        <Route path="/entrenador" element={<DashboardInstructor />} />
        <Route path="/entrenador/mis-clases" element={<MisClases />} />
        <Route path="/entrenador/horarios" element={<Horarios />} />
        {/* Aquí agregarás más rutas: horarios, asistencias, etc. */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1 style={{color:"white"}}>404</h1>} />
    </Routes>
  );
}

// import { Routes, Route } from "react-router-dom";
// import Layout from "./layouts/Layout";

// // PAGES - auth
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// //Pages - cliente
// import DashboardCliente from "./pages/cliente/DashboardCliente";

// //Pages - instructor
// import DashboardInstructor from "./pages/instructor/DashboardInstructor";
// import MisClases from "./pages/instructor/MisClases";

// //Pages - admin
// import DashboardAdmin from "./pages/admin/DashboardAdmin";

// export default function App() {
//   return (
//     <Routes>

//       {/* LOGIN sin layout */}
//       <Route path="/" element={<Login />} />
//        <Route path="/register" element={<Register />} />

//        {/* REGISTER
//       <Route path="/register" element={<Register />} /> */}

//       {/* RUTAS CON LAYOUT */}
//       <Route element={<Layout />}>

//         {/* CLIENTE */}
//         <Route path="/cliente" element={<DashboardCliente />} />


//         {/* RUTAS INSTRUCTOR */}
//         <Route path="/entrenador" element={<DashboardInstructor />} />
//         <Route path="/entrenador/mis-clases" element={<MisClases />}/>
//         {/* <Route path="/entrenador/mis-clases" element={<MyClasses />} /> */}
        
//         {/* REDIRECT para mantener compatibilidad */}
//         {/* <Route path="/instructor" element={<Navigate to="/entrenador" replace />} /> */}
       

//         {/* ADMIN */}
//         <Route path="/administrador" element={<DashboardAdmin />} />

//         {/* REDIRECT para mantener compatibilidad
//         <Route path="/admin" element={<Navigate to="/administrador" replace />} /> */}
//       </Route>

//       {/* 404 */}
//       <Route path="*" element={<h1 style={{color:"white"}}>404</h1>} />

//     </Routes>
//   );
// }

