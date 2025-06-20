import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  tahunPelajaran: string;
  rememberMe: boolean;
}

const RegisterPage: React.FC = () => {
  const [formState, setFormState] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    tahunPelajaran: "2024/2025",
    rememberMe: false,
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        tahunPelajaran: formState.tahunPelajaran,
        rememberMe: formState.rememberMe,
      });
        console.log(response)


      // Bisa kamu arahkan ke login atau halaman lain
      navigate("/login");
    } catch (err: any) {
      // Tangani error dari backend, misal response error message
      setError(err.response?.data?.message || "Register gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row
        className="shadow rounded w-100 mx-2 mx-md-5 overflow-hidden"
        style={{ maxWidth: "900px" }}
      >
        <Col xs={12} md={6} className="p-0">
          <img
            src="/src/assets/login-form.png"
            alt="Register Visual"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </Col>

        <Col xs={12} md={6} className="bg-white p-4">
          <h3 className="mb-4 text-center">Register E-Rapor</h3>
          <Form onSubmit={handleSubmit}>
            {error && <div className="text-danger mb-3">{error}</div>}

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                name="password"
                value={formState.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTahun">
              <Form.Label>Tahun Pelajaran</Form.Label>
              <Form.Select
                name="tahunPelajaran"
                value={formState.tahunPelajaran}
                onChange={handleInputChange}
              >
                <option>2024/2025</option>
                <option>2023/2024</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCheckbox">
              <Form.Check
                type="checkbox"
                label="Ingat saya"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <div className="d-flex justify-content-between">
              <Link to="/login" className="text-primary text-decoration-none">
                Login
              </Link>
              <a href="#" className="text-muted text-decoration-none">
                Lupa password?
              </a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
