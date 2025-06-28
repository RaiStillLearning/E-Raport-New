// App.tsx
import { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import NavbarComponent from "./components/navbar";
import { UserContext, UserProvider } from "./context/UserContext";

// Layout
import GuruLayout from "./layouts/GuruLayout";

// Pages Guru
import BerandaGuru from "./pages/guru/Beranda";
import LandingPage from "./pages/guest/Beranda";
import LoginPage from "./LoginForm/LoginPage";
import RegisterPage from "./LoginForm/Register/Register";
import PesertaDidik from "./pages/guru/PesertaDidik";
import TujuanPembelajaran from "./pages/guru/TujuanPembelajaran";
import LingkupMateri from "./pages/guru/LingkupMateri";
import AsesmenSumatif from "./pages/guru/AsesmenSumatif";
import AsesmenFormatif from "./pages/guru/AsesmenFormatif";


function App() {
  const location = useLocation();
  const { userRole } = useContext(UserContext);

  const isGuruRoute = location.pathname.startsWith("/guru");

  const RedirectBasedOnRole = () => {
    if (!userRole || userRole === "guest") return <Navigate to="/login" />;
    if (userRole === "guru") return <Navigate to="/guru/beranda" />;
    return <Navigate to="/login" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isGuruRoute && <NavbarComponent />}

      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Guru route tetap dirender */}
          <Route path="/guru" element={<GuruLayout />}>
            <Route path="beranda" element={<BerandaGuru />} />
            <Route path="pesertadidik" element={<PesertaDidik />} />
            <Route path="tujuanPembelajaran" element={<TujuanPembelajaran />} />
            <Route path="lingkup-materi" element={<LingkupMateri />} />
            <Route path="asesmen-sumatif" element={<AsesmenSumatif />} />
            <Route path="asesmen-formatif" element={<AsesmenFormatif />} />
          </Route>

          <Route path="/" element={<RedirectBasedOnRole />} />
          <Route path="*" element={<div>404 - Halaman tidak ditemukan</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}
