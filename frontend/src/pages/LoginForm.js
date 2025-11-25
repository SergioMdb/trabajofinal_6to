import React from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginForm() {
    return (
    <div className="d-flex align-items-center justify-content-center vh-100 text-white">
        <ParticlesBackground />

        <div
        className="p-4 shadow-lg text-white"
        style={{
            width: "400px",
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        backdropFilter: "blur(10px)",          
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        >
        <h2 className="text-center mb-4">Iniciar sesión 🔑</h2>
        <form>
            <div className="mb-3">
            <label className="form-label text-white">
                Correo electrónico o teléfono
            </label>
            <input
                type="text"
                className="form-control"
                style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                placeholder="ejemplo@gmail.com"
            />
            </div>
            <div className="mb-3">
            <label className="form-label text-white">Contraseña</label>
            <input
                type="password"
                className="form-control"
                style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                placeholder="******"
            />
            </div>
            <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">
                Ingresar
            </button>
            <Link to="/login" className="btn btn-secondary">
                Volver
            </Link>
            </div>
        </form>
        </div>
    </div>
    );
}
