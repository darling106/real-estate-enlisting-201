import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const PropertyListing = ({ property }) => {
  const { id, size, description, address, propType, price } = property;

  return (
    <Col md={4} className="mb-4">
      <Card className=" position-relative">
        <Card.Body>
          <Card.Text>
            <Card.Title>{id}</Card.Title>
            <Stack direction="" gap={3}>
              <span>Size:</span>
              <Badge>{size}</Badge>

              <span>Description:</span>
              <Badge>{description}</Badge>

              <span>Address:</span>
              <Badge>{address}</Badge>

              <span>Type:</span>
              <Badge>{propType}</Badge>

              <span>Price:</span>
              <Badge>{price}</Badge>
            </Stack>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

PropertyListing.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyListing;
