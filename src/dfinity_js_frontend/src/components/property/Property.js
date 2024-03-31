import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import ListProperty from "./AddToListing";

const Property = ({ property }) => {
  const { id, size, description, address, propType, price } = property;

  return (
    <Col md={4} className="mb-4">
      <Card className=" position-relative">
        <Card.Body>
          <>
            <Card.Title>{id}</Card.Title>
            <Stack direction="horizantal" gap={1}>
              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Size:</p>
                <p className="fs-4 pt-1 px-2">{size}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Description:</p>
                <p className="fs-4 pt-1 px-2">{description}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Address:</p>
                <p className="fs-4 pt-1 px-2">{address}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Type:</p>
                <p className="fs-4 pt-1 px-2">{propType}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Price:</p>
                <p className="fs-4 pt-1 px-2">{price}</p>
              </div>

              
            </Stack>
          </>
        </Card.Body>
      </Card>
    </Col>
  );
};

Property.propTypes = {
  property: PropTypes.object.isRequired,
};

export default Property;
