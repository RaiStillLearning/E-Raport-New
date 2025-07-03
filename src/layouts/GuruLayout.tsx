import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const sidebarWidth = 220; // Lebar sidebar ketika terbuka
const toggleWidth = 40; // Lebar tombol toggle

export default function GuruLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={handleToggleSidebar}
        style={{
          position: "fixed", // Agar sidebar tetap pada posisi yang sama
          top: 0,
          left: 0,
          height: "100vh", // Memastikan sidebar memenuhi tinggi layar
          transition: "transform 0.3s ease-in-out",
          transform: sidebarOpen ? "translateX(0)" : `translateX(-100%)`, // Animasi pergerakan sidebar
        }}
      />

      {/* Konten utama */}
      <div
        style={{
          marginLeft: sidebarOpen ? sidebarWidth + toggleWidth : toggleWidth, // Memberi margin saat sidebar terbuka
          transition: "margin-left 0.3s ease-in-out", // Transisi halus saat sidebar dibuka/tutup
          padding: "1rem",
          minHeight: "100vh",
          flex: 1,
          overflowX: "hidden", // Menghindari scroll horizontal saat sidebar ditutup
        }}
      >
        <Outlet />
      </div>

      {/* Tombol toggle untuk membuka/menutup sidebar di layar kecil */}
      <button
        onClick={handleToggleSidebar}
        style={{
          position: "fixed",
          top: "20px",
          left: sidebarOpen ? sidebarWidth : toggleWidth, // Posisi tombol berdasarkan status sidebar
          zIndex: 1000,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Toggle Sidebar"
      >
        <span
          style={{
            fontSize: "24px",
            color: "#000", // Sesuaikan dengan warna tema
          }}
        >
          {sidebarOpen ? "☰" : "×"} {/* Simbol untuk toggle */}
        </span>
      </button>
    </div>
  );
}
