import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const ListProperty = ({ save }) => {
 const [propertyId, setPropertyId] = useState("");

    const isFormFilled = () => propertyId;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        List Property
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>List Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingInput" label="Property ID">
              <Form.Control
                type="text"
                placeholder="Property ID"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
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
              if (isFormFilled()) {
                save({ propertyId });
                handleClose();
              }
            }}
          >
            List Property
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ListProperty.propTypes = {
  save: PropTypes.func.isRequired,
};

export default ListProperty;
