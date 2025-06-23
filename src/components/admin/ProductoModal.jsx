import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

const ProductoModal = ({ show, handleClose, onSave, productoInicial }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    vencimiento: '',
    cantidad: 0,
    precio: 0,
    estado: 'activo'
  });

  useEffect(() => {
    if (productoInicial) {
      setForm(productoInicial);
    }
  }, [productoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{productoInicial?.id ? "Editar" : "Crear"} Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Descripción</Form.Label>
            <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha Vencimiento</Form.Label>
            <Form.Control type="date" name="vencimiento" value={form.vencimiento} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control type="number" name="cantidad" value={form.cantidad} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" name="precio" value={form.precio} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="estado" value={form.estado} onChange={handleChange}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">Guardar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductoModal;
