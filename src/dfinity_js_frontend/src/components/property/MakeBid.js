import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const MakeDid = ({ save }) => {
  const [userId, setUserId] = useState("");
 const [propertyId, setPropertyId] = useState

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const isFormFilled = () => userId && propertyId

 return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Make a Bid
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Make a Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userId">
              <FloatingLabel controlId="userId" label="User ID">
                <Form.Control
                  type="text"
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="propertyId">
              <FloatingLabel controlId="propertyId" label="Property ID">
                <Form.Control
                  type="text"
                  placeholder="Enter Property ID"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
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
                save(userId, propertyId);
                handleClose();
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
 )
};

MakeDid.propTypes = {
  save: PropTypes.func.isRequired,
};
export default MakeDid;
