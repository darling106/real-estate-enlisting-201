import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
  createProperty,
  getProperties as getPropertyList,
} from "../utils/../utils/realestateManager";
import Property from "./Property";
import AddProperty from "./AddProperty";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProperties = useCallback(async () => {
    try {
      const properties = await getPropertyList();
      setProperties(properties);
      setLoading(false);
    } catch (error) {
      NotificationError(error);
    }
  });

  const addProperty = async (property) => {
    try {
      await createProperty(property);
      NotificationSuccess("Property added successfully");
      getProperties();
    } catch (error) {
      NotificationError(error);
    }
  };

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <div>
      <h1>Properties</h1>
      <Link to="/users" className="btn btn-primary">
       users
      </Link>
      {loading ? (
        <Loader />
      ) : (
        <Row>
          {properties.map((property) => (
            <Property key={property.id} property={property} />
          ))}
        </Row>
      )}
      <AddProperty save={addProperty} />
    </div>
  );
};

export default Properties;
