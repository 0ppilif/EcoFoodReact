import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const regiones = [
  {
    nombre: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Vicuña", "Ovalle"],
  },
  {
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Puente Alto", "Maipú", "Las Condes"],
  },
];

export default function EmpresaModal({ show, handleClose, empresa, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    telefono: ""
  });

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre || "",
        direccion: empresa.direccion || "",
        comuna: empresa.comuna || "",
        telefono: empresa.telefono || ""
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...empresa, ...formData });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              minLength={5}
              maxLength={50}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Comuna</Form.Label>
            <Form.Select
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione Comuna</option>
              {regiones.map((region, i) => (
                <optgroup key={i} label={region.nombre}>
                  {region.comunas.map((comuna, j) => (
                    <option key={j} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="telefono"
              type="number"
              value={formData.telefono}
              onChange={handleChange}
              maxLength={15}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
