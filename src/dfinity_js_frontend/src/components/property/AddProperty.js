import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddProperty = ({ save }) => {
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [propType, setPropType] = useState("");
  const [price, setPrice] = useState("");

  const isFormFilled = () =>
    size && description && address && propType && price;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Property
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingInput" label="Size">
              <Form.Control
                type="text"
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Description">
              <Form.Control
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Address">
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Type">
              <Form.Control
                type="text"
                placeholder="Type"
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Price">
              <Form.Control
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              
                save({ size, description, address, propType, price });
                handleClose();
            }}
            disabled={!isFormFilled()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddProperty.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddProperty;
