import React from "react";
import { Outlet } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

export default function Layout() {
    return (
    <>
        <ParticlesBackground />

        <Outlet />
    
    </>
    );
}
