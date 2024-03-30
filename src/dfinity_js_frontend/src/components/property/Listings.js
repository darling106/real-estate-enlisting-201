import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
  addPropertyListing,
  getPropertyListings as getListingList,
  getProperties,
} from "../../utils/realestateManager";
import Property from "./Property";
import ListProperty from "./AddToListing";
import PropertyListing from "./Listing";

const PropertiesListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getListing = useCallback(async () => {
    try {
      const listing = await getListingList();
      setListings(listing);
      setLoading(false);
    } catch (error) {
      NotificationError(error);
    }
  });

  const addProperty = async (propertyId) => {
    try {
      setLoading(true);
      addPropertyListing(propertyId).then(() => {
        getProperties();
      });
      toast(<NotificationSuccess text="Listing sucessfull." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to list." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListing();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Listings</h1>
            <Link
              to="/"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Properties
            </Link>
            <Link
              to="/users"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Users
            </Link>
          </div>
          <Row xs={1} sm={2} lg={3}>
            {listings.map((_listing, index) => (
              <PropertyListing
                key={index}
                listing={{
                  ..._listing,
                }}
                //update={update}
              />
            ))}
          </Row>
          <div>
            <ListProperty save={addProperty} />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default PropertiesListings;
