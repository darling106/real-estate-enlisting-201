import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";


const Property = ({property }) => {
    const { id, size, description, address, propType, price} = property;
 
  return (
    <Col md={4} className="mb-4">
      <Card className=" position-relative">
        <Card.Body>
          <Card.Text>
            <Card.Title>{id}</Card.Title>
            <Stack direction="horizantal" gap={1}>
           <div className="d-flex">  
             <p>Size:</p>
              <span>{size}</span>
              </div>

              <div className="d-flex">
                  <Card.Text>Description:</Card.Text>
                <span>{description}</span>
              </div>

              <div className="d-flex">
                  <p>Address:</p>
                <span>{address}</span>
              </div>

               <div className="d-flex">
                 <p>Type:</p>
                <span>{propType}</span>
               </div>

             <div className="d-flex">
                 <p>Price:</p>
                <span>{price}</span>
             </div>


            </Stack>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Property.propTypes = {
  property: PropTypes.object.isRequired,
};

export default Property;
