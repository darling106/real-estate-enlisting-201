import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
  addPropertyListing,
  getPropertyListings as getListingList,
  makeBid,
  getUsers,
} from "../../utils/realestateManager";
import Property from "./Property";
import ListProperty from "./AddToListing";
import PropertyListing from "./Listing";

const PropertiesListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setListings(await getListingList());
    } catch (error) {
      NotificationError("Error", error.message);
    } finally {
      setLoading(false);
    }
  });

  const addProperty = async ({ propertyId }) => {
    try {
      setLoading(true);
      addPropertyListing(propertyId).then((res) => {
        fetchListings();
      });
      toast(<NotificationSuccess text="Property added." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add property." />);
    } finally {
      setLoading(false);
    }
  };

  const bidForProperty = async (bid) => {
    try {
      setLoading(true);
      makeBid(bid).then(() => {
        getUsers();
      });
       toast(<NotificationSuccess text="Bid was successfully added" />);
    } catch (error) {
      toast(<NotificationError text="Failed to Bid." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Listings</h1>
            <Link
              to="/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Properties
            </Link>
            <Link
              to="/users?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
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
                bidForProperty={bidForProperty}
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
