import React from 'react';
// Importaciones de estilos y librerías de Bootstrap. 
// Han sido comentadas para evitar errores de compilación en este entorno.
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.min.js"
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ----------------------------------------------------------------
// Componentes de Layout y Públicos
// ----------------------------------------------------------------
import Layout from "./components/Layout"; // Mantengo esta importación
import Home from "./pages/Home"; 
import Contact from "./pages/Contact"; 
import NovedadesPage from './pages/NovedadesPage'; 

// ----------------------------------------------------------------
// Componentes de Administración (Nuevos y Login)
// ----------------------------------------------------------------
import Login from "./pages/Login"; // Formulario de login
import AdminNovedades from './pages/AdminNovedades'; // Listado y gestión principal
import NovedadesAgregar from './pages/NovedadesAgregar'; // Formulario universal (Agregar y Modificar)

// Componentes que tenías o de ejemplo (mantengo la importación)
import LoginForm from "./pages/LoginForm";
import LoginTest from "./pages/LoginTest"; 

export default function App() {
  return (
    <BrowserRouter>
      {/* Si el componente Layout envuelve toda la aplicación, puedes anidar las rutas:
        <Route path="/" element={<Layout />}>
           ... Rutas públicas y privadas aquí ...
        </Route>
        
        Por simplicidad, mantendré la estructura plana y asumiré que el Navbar se renderiza
        directamente en Home, Contact y NovedadesPage.
      */}
      <Routes>
        
        {/* ==========================================================
            RUTAS PÚBLICAS
        ========================================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contact />} /> 
        <Route path="/novedades" element={<NovedadesPage />} />
        
        {/* ==========================================================
            RUTA DE LOGIN (ACCESO ADMIN)
        ========================================================== */}
        <Route path="/login" element={<Login />} />
        
        {/* ==========================================================
            RUTAS DE ADMINISTRACIÓN PROTEGIDAS 
            (La verificación del token ocurre dentro de cada componente Admin)
        ========================================================== */}
        
        {/* 1. Panel Principal: Listado y botones de acción */}
        <Route path="/admin/novedades" element={<AdminNovedades />} />
        
        {/* 2. Agregar Novedad: Usa el componente NovedadesAgregar */}
        <Route path="/admin/novedades/agregar" element={<NovedadesAgregar />} />
        
        {/* 3. Modificar Novedad: Usa NovedadesAgregar con el flag isEdit=true */}
        <Route 
          path="/admin/novedades/modificar/:id" 
          element={<NovedadesAgregar isEdit={true} />} 
        /> 
        
        {/* ==========================================================
            RUTAS DE PRUEBA / LEGACY
        ========================================================== */}
        <Route path="/login-test" element={<LoginTest />} />
        <Route path="/loginform" element={<LoginForm />} />

      </Routes>
    </BrowserRouter>
  );
}