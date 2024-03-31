import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";

//import UpdateUser from "./UpdateUser";

const User = ({ user }) => {
  const { id, name, phoneNo, email, listing } = user;

  return (
    <Col key={id}>
      <Card className=" h-100 position-relative">
        <Card.Body className="d-flex  flex-column">
          <Stack>
            <Card.Text>Id: {id}</Card.Text>
            <Card.Title>Name: {name}</Card.Title>
          </Stack>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">Phone: {phoneNo}</Card.Text>
          <Card.Text className="flex-grow-1 ">Biddings </Card.Text>
          <Card.Text className="flex-grow-1 ">{listing.join(", ")}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

User.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
};

export default User;
