import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
  addPropertyListing,
  getPropertyListings as getListingList,
  //getProperties as getPropertyList,
  makeBid,
} from "../../utils/realestateManager";
import Property from "./Property";
import ListProperty from "./AddToListing";
import PropertyListing from "./Listing";

const PropertiesListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      const _listings = await getListingList();
      setListings(_listings);
      setLoading(false);
    } catch (error) {
      NotificationError("Error", error.message);
      setLoading(false);
    }
  }
  , []);

  useEffect(() => {
    fetchListings();
  }
  , [fetchListings]);

  const addProperty = async ({ propertyId }) => {
    try {
      await addPropertyListing(propertyId);
      NotificationSuccess("Success", "Property added to listing");
      fetchListings();
    }
    catch (error) {
      NotificationError("Error", "Error adding property to listing");
    }

  };

  //make a bid
  // const makeBid = async (makeBid) => {
  //   try {
  //     await makeBid(makeBid);
  //     NotificationSuccess("Success", "Bid made successfully");
  //   } catch (error) {
  //     NotificationError("Error", error.message);
  //   }
  // };

    const bidForProperty = async (bid) => {
      try {
        setLoading(true);
        makeBid(bid).then((resp) => {
          fetchListings();
          toast(
            <NotificationSuccess text="Bid was successfully added" />
          );
        });
      } catch (error) {
        toast(<NotificationError text="Failed to Bid." />);
      } finally {
        setLoading(false);
      }
    };



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
                //update={update}
                //remove={remove}
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
