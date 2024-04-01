import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
  createProperty,
  getProperty,
  getProperties as getPropertyList,
} from "../../utils/realestateManager";
import Property from "./Property";
import AddProperty from "./AddProperty";

const Properties = () => {
  const [properties, setProperties] = useState([]);
 const [loading, setLoading] = useState(false);

  const getProperties = useCallback(async () => {
    try {
      setLoading(true);
      setProperties(await getPropertyList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addProperty = async (data) => {
    try {
      setLoading(true);
      createProperty(data).then((res) => {
        getProperties();
      });
      toast(<NotificationSuccess text="Property added." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add property." />);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Properties</h1>
            <Link
              to="/users?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Users
            </Link>
            <Link
              to="/listings?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Listings
            </Link>
          </div>
          <Row xs={1} sm={2} lg={3}>
            {properties.map((_property, index) => (
              <Property
                key={index}
                property={{
                  ..._property,
                }}
              />
            ))}
          </Row>

          <AddProperty save={addProperty} />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Properties;
