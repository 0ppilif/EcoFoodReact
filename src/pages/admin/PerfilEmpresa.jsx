import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getUsuarioPorId, actualizarUsuario } from "../../services/usuarioFirebase";

const PerfilEmpresa = () => {
  const { user } = useContext(AuthContext);
  const [perfil, setPerfil] = useState({
    nombre: "",
    correo: "",
    ubicacion: ""
  });

  const cargarPerfil = async () => {
    if (user?.uid) {
      const datos = await getUsuarioPorId(user.uid);
      if (datos) {
        setPerfil({
          nombre: datos.nombre || "",
          correo: datos.correo || "",
          ubicacion: datos.ubicacion || ""
        });
      }
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actualizarUsuario(user.uid, {
      nombre: perfil.nombre,
      ubicacion: perfil.ubicacion
    });
    alert("Perfil actualizado correctamente");
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header><h3>Perfil de Empresa</h3></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={perfil.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Correo (no editable)</Form.Label>
                  <Form.Control
                    type="email"
                    value={perfil.correo}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ubicacion"
                    value={perfil.ubicacion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button type="submit">Guardar cambios</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PerfilEmpresa;
