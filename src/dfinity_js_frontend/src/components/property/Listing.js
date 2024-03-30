import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const PropertyListing = ({ listing }) => {
  const { id, propSize, propDescription, propAddress, propType, propPrice } =
    listing;

  return (
    <Col md={4} className="mb-4">
      <Card className=" position-relative">
        <Card.Body>
          <Card.Text>
            <Card.Title>{id}</Card.Title>
            <Stack direction="" gap={3}>
              <span>Size:</span>
              <Badge>{propSize}</Badge>

              <span>Description:</span>
              <Badge>{propDescription}</Badge>

              <span>Address:</span>
              <Badge>{propAddress}</Badge>

              <span>Type:</span>
              <Badge>{propType}</Badge>

              <span>Price:</span>
              <Badge>{propPrice}</Badge>
            </Stack>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

PropertyListing.propTypes = {
  listing: PropTypes.instanceOf(Object).isRequired,
};

export default PropertyListing;
