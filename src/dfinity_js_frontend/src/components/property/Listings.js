import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import {
 addPropertyListing,
  getPropertyListings as getListingList,
} from "../../utils/realestateManager";
import Property from "./Property";
import AddProperty from "./AddProperty";
import ListProperty from "./AddToListing";
import PropertyListing from "./Listing";

const  PropertiesListings = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);

  const getListing = useCallback(async () => {
    try {
      const listing = await getListingList();
      setListing(listing);
      setLoading(false);
    } catch (error) {
      NotificationError(error);
    }
  });

    const addProperty = async (property) => {
    try {
      await addPropertyListing(property.id);
      NotificationSuccess("Property added successfully");
      getProperties();
    } catch (error) {
      NotificationError(error);
    }
    }



  useEffect(() => {
    getListing();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <h1>Properties</h1>
        <Link
              to="/"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Users
            </Link>
        <Link
              to="/"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Listings
            </Link>
         <Row xs={1} sm={2} lg={3}>
          {listing.map((_listing, index) => (
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
       <AddProperty save={addProperty} />
     </div>
      </>
      ) : (
         <Loader />
             )}
    </>
  );
};

export default  PropertiesListings;
