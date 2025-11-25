import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import ParticlesBackground from "../components/ParticlesBackground";

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const LOGIN_API_URL = `${BASE_API_URL}/api/login`; 

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        setLoading(true);
        try {
    
            const response = await axios.post(LOGIN_API_URL, {
                usuario: username, 
                password: password,
            });

            const token = response.data.token; 
            
       
            sessionStorage.setItem('adminToken', token);
            
       
            navigate('/admin/novedades');

        } catch (err) {
            console.error('Error de autenticación:', err.response ? err.response.data : err.message);
            setError('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <div className="cuerpo">
            <div className="w-full max-w-md rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-indigo-300">
                
                <h2 className="acceso">
                    Acceso de Administrador
                </h2>
                <p className="credenciales">
                    Ingresa tus credenciales para gestionar el contenido de Novedades.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                 
                        <label htmlFor="username" className="rellenar">
                            Usuario
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Nombre de usuario"
                            disabled={loading}
                        />
                    </div>
<ParticlesBackground />
                    <div>
                        <label htmlFor="password" className="rellenar">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="boton">
                    <Link to="/" className="boton">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
