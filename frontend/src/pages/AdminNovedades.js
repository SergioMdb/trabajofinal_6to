import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/panel.css';
import ParticlesBackground from "../components/ParticlesBackground";

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const NOVEDADES_API_URL = `${BASE_API_URL}/admin/novedades`;

export default function AdminNovedades() {
    const [novedades, setNovedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const navigate = useNavigate();
    const token = sessionStorage.getItem('adminToken');

 
    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        navigate('/login');
    };


    const fetchNovedades = async () => {
        if (!token) {
       
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(NOVEDADES_API_URL, {
                headers: {
            
                    Authorization: `Bearer ${token}` 
                }
            });
            
           
            if (Array.isArray(response.data)) {
                setNovedades(response.data);
            } else if (typeof response.data === 'object' && response.data !== null && Array.isArray(response.data.novedades)) {
             
                setNovedades(response.data.novedades);
            } else {
                console.error("El backend no devolvió un array de novedades. Posiblemente está devolviendo una vista HTML.");
                setError("Error de datos: El servidor no devolvió una lista de novedades válida (Comprueba que el backend devuelve JSON, no HTML).");
                setNovedades([]); 
            }


        } catch (err) {
            console.error("Error al cargar novedades en admin:", err);
            
            if (err.response && err.response.status === 401) {
                sessionStorage.removeItem('adminToken');
                navigate('/login', { state: { expired: true } });
            } else {
             
                setError("Error al cargar las novedades. Verifica conexión o que el backend devuelva JSON.");
                setNovedades([
                    { id: 1, titulo: '[TEST] PC Gamer Extrema', subtitulo: '¡Rendimiento sin límites!', cuerpo: 'Descubre nuestra PC de alto rendimiento...', imagen: 'https://placehold.co/800x50/000000/FFFFFF?text=TEST+DATA' },
                    { id: 2, titulo: '[TEST] Guía de Mantenimiento', subtitulo: 'Optimiza tu equipo...', cuerpo: 'Mantén tu PC fresca y limpia...', imagen: 'https://placehold.co/800x50/000000/FFFFFF?text=TEST+DATA' },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (id) => {

        if (!window.confirm("¿Estás seguro de que quieres eliminar esta novedad?")) {
            return;
        }

        try {
            await axios.delete(`${NOVEDADES_API_URL}/eliminar/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            setDeleteMessage(`Novedad con ID ${id} eliminada con éxito.`);
            
       
            fetchNovedades(); 

        } catch (err) {
            console.error("Error al eliminar novedad:", err);
            setError("Error al eliminar la novedad. Verifica la ruta en el backend.");
        }
   
        setTimeout(() => setDeleteMessage(''), 3000);
    };


    useEffect(() => {
        fetchNovedades();
    }, []); 

    if (loading && novedades.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-center text-xl font-semibold text-indigo-600">
                    Cargando Panel de Administración...
                </div>
            </div>
        );
    }

    return (
        <div className="cuerpo-1">
            <ParticlesBackground />
            <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-indigo-500">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Panel de Administración de Novedades
                   
                </h1>
                <div className="boton-1">
                    
                    <Link 
                        to="/novedades" 
                        className="text"
                    >
                        Ver Frontend
                    </Link>


                    <button
                        onClick={handleLogout}
                        className="text"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div className="text-link">
                <Link 
                    to="/admin/novedades/agregar"
                    className="text"
                >
                     Agregar Nueva Novedad
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <p className="mt-2 text-sm">
                        **SOLUCIÓN: Debes modificar tu backend `routes/admin/novedades.js`. La ruta GET `/` debe devolver `res.json(novedades)` en lugar de `res.render(...)` para que React pueda leer los datos.**
                    </p>
                </div>
            )}
            
            {deleteMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">¡Éxito!</strong>
                    <span className="block sm:inline"> {deleteMessage}</span>
                </div>
            )}


            <div className="formulario">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="texto">
                                ID
                            </th>
                            <th className="texto">
                                Título
                            </th>
                            <th className="texto">
                                Subtítulo
                            </th>
                            <th className="texto">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tbody">
                      
                        {Array.isArray(novedades) && novedades.length > 0 ? (
                            novedades.map((novedad) => (
                                <tr key={novedad.id}>
                                    
                                    <td className="texto">
                                        {novedad.id}
                                    </td>
                                    <td className="texto">
                                        {novedad.titulo}
                                    </td>
                                    <td className="texto">
                                        {novedad.subtitulo}
                                    </td>
                                    <td className="text">
                                        <Link 
                                            to={`/admin/novedades/modificar/${novedad.id}`} 
                                            className="text"
                                        >
                                            <i className="fas fa-edit"></i> Modificar
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(novedad.id)}
                                            className="text"
                                        >
                                            <i className="fas fa-trash-alt"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    {loading ? 'Cargando datos...' : 'No hay novedades cargadas.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}