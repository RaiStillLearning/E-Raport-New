import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Button, Nav, Collapse } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaBook, FaUserCog, FaChartBar } from "react-icons/fa";
import Logo from "../assets/logo-ghamcak.png";

const Sidebar = ({ children }) => {
  const { userRole } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarIsOpen");
    return saved !== null ? JSON.parse(saved) : window.innerWidth >= 768;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownRefrensiOpen, setDropdownRefrensiOpen] = useState(false);
  const [dropdownNilaiOpen, setDropdownNilaiOpen] = useState(false);

  const location = useLocation();

  if (!userRole) return null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      localStorage.setItem("sidebarIsOpen", JSON.stringify(!prev));
      return !prev;
    });
  };

  const menuItems = [{ name: "Beranda", path: "/guru/beranda" }];
  const dropdownItems = [
    { name: "Profil Saya", path: "/profil" },
    { name: "Pengaturan", path: "/pengaturan" },
  ];
  const dropdownRefrensiItems = [
    { name: "Peserta Didik", path: "/guru/pesertadidik" },
    { name: "Tujuan Pembelajaran", path: "/guru/tujuanPembelajaran" },
    { name: "Lingkup Materi", path: "/guru/lingkup-materi" },
  ];
  const dropdownNilaiItems = [
    { name: "Asesmen Sumatif", path: "/guru/asesmen-sumatif" },
    { name: "Asesmen Formatif", path: "/guru/asesmen-formatif" },
    { name: "Nilai Akhir", path: "/guru/nilai-akhir" },
  ];

  const sidebarWidth = 220;
  const toggleWidth = 40;

  return (
    <>
      {/* Sidebar dan Toggle */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          display: "flex",
          zIndex: 1040,
        }}
      >
        {/* Sidebar */}
        <div
          className="bg-dark text-white p-3"
          style={{
            width: isOpen ? sidebarWidth : 0,
            overflow: "hidden",
            transition: "width 0.3s ease-in-out",
          }}
        >
          {/* Sidebar Content */}
          {isOpen && (
            <>
              <div className="text-center mb-4">
                <img src={Logo} alt="Logo" style={{ height: "140px" }} />
                <div className="mt-2">Role Kamu: {userRole}</div>
              </div>

              <Nav className="flex-column">
                {menuItems.map((item) => (
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    key={item.path}
                    active={location.pathname === item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className="text-white mb-2"
                  >
                    {item.name}
                  </Nav.Link>
                ))}

                {/* Dropdown Refrensi */}
                <Button
                  variant="link"
                  className="text-white text-start"
                  onClick={() => setDropdownRefrensiOpen(!dropdownRefrensiOpen)}
                  aria-controls="refrensi-collapse"
                  aria-expanded={dropdownRefrensiOpen}
                >
                  <FaBook className="me-2" /> Refrensi ▼
                </Button>
                <Collapse in={dropdownRefrensiOpen}>
                  <div id="refrensi-collapse">
                    {dropdownRefrensiItems.map((item) => (
                      <Nav.Link
                        as={Link}
                        to={item.path}
                        key={item.path}
                        onClick={() => isMobile && setIsOpen(false)}
                        className="text-white ms-3 mb-2"
                        active={location.pathname === item.path}
                      >
                        {item.name}
                      </Nav.Link>
                    ))}
                  </div>
                </Collapse>

                {/* Dropdown Nilai */}
                <Button
                  variant="link"
                  className="text-white text-start"
                  onClick={() => setDropdownNilaiOpen(!dropdownNilaiOpen)}
                  aria-controls="nilai-collapse"
                  aria-expanded={dropdownNilaiOpen}
                >
                  <FaChartBar className="me-2" /> Nilai ▼
                </Button>
                <Collapse in={dropdownNilaiOpen}>
                  <div id="nilai-collapse">
                    {dropdownNilaiItems.map((item) => (
                      <Nav.Link
                        as={Link}
                        to={item.path}
                        key={item.path}
                        onClick={() => isMobile && setIsOpen(false)}
                        className="text-white ms-3 mb-2"
                        active={location.pathname === item.path}
                      >
                        {item.name}
                      </Nav.Link>
                    ))}
                  </div>
                </Collapse>

                {/* Dropdown Pengguna */}
                <Button
                  variant="link"
                  className="text-white text-start"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-controls="dropdown-collapse"
                  aria-expanded={dropdownOpen}
                >
                  <FaUserCog className="me-2" /> Pengguna ▼
                </Button>
                <Collapse in={dropdownOpen}>
                  <div id="dropdown-collapse">
                    {dropdownItems.map((item) => (
                      <Nav.Link
                        as={Link}
                        to={item.path}
                        key={item.path}
                        onClick={() => isMobile && setIsOpen(false)}
                        className="text-white ms-3 mb-2"
                        active={location.pathname === item.path}
                      >
                        {item.name}
                      </Nav.Link>
                    ))}
                  </div>
                </Collapse>
              </Nav>
            </>
          )}
        </div>

        {/* Toggle Button (Selalu Tampil) */}
        <div
          style={{
            width: toggleWidth,
            backgroundColor: "#343a40",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Button
            variant="dark"
            onClick={toggleSidebar}
            style={{ padding: 0, width: "30px", height: "30px" }}
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          marginLeft: isOpen ? sidebarWidth + toggleWidth : toggleWidth,
          transition: "margin-left 0.3s ease-in-out",
          padding: "1rem",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
