import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import MakeDid from "./MakeBid";

const PropertyListing = ({ listing, bidForProperty }) => {
  const { id, propSize, propDescription, propAddress, propType, propPrice } =
    listing;

  const triggerBid = (userId) => {
    bidForProperty({ propertyId: id, userId });
  };
  return (
    <Col md={4} className="mb-4">
      <Card className=" position-relative">
        <Card.Body>
          <>
            <Card.Title>{id}</Card.Title>
            <Stack>
              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Size:</p>
                <p className="fs-4 pt-1 px-2">{propSize}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Description:</p>
                <p className="fs-4 pt-1 px-2">{propDescription}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Address:</p>
                <p className="fs-4 pt-1 px-2">{propAddress}</p>
              </div>

              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Type:</p>
                <p className="fs-4 pt-1 px-2">{propType}</p>
              </div>
              <div className="d-flex align-content-center">
                <p className="text-primary fs-3">Price:</p>
                <p className="fs-4 pt-1 px-2">{propPrice}</p>
              </div>

            </Stack>
          </>
          <Card.Footer>
            <MakeDid bidForProperty={triggerBid} />
          </Card.Footer>
        </Card.Body>
      </Card>
    </Col>
  );
};

PropertyListing.propTypes = {
  listing: PropTypes.instanceOf(Object).isRequired,
  bidForProperty: PropTypes.func.isRequired,
};

export default PropertyListing;
