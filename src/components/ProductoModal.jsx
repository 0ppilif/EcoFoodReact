import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductoModal = ({ isOpen, onClose, producto, onGuardar }) => {
  const [form, setForm] = useState({
    nombre: '', descripcion: '', vencimiento: '', cantidad: '', precio: '', estado: 'disponible'
  });

  useEffect(() => {
    if (producto) {
      setForm(producto);
    } else {
      setForm({ nombre: '', descripcion: '', vencimiento: '', cantidad: '', precio: '', estado: 'disponible' });
    }
  }, [producto]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onGuardar({ ...form, id: producto?.id || Date.now().toString() });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{producto ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {['nombre', 'descripcion', 'vencimiento', 'cantidad', 'precio', 'estado'].map((campo) => (
            <Form.Group className="mb-3" key={campo}>
              <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
              <Form.Control
                type={campo === 'vencimiento' ? 'date' : 'text'}
                name={campo}
                value={form[campo]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductoModal;
