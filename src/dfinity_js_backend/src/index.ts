import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Duration,
  Result,
  bool,
  Canister,
} from "azle";

//import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Property = Record({
  id: text,
  address: text, //address of the property
  propType: text, //type of property(home, land, office, etc)
  description: text, //description of the property
  size: nat64,
  price: text,
});

const PropertyPayload = Record({
  address: text,
  propType: text,
  description: text,
  size: nat64,
  price: text,
});

const ListingStatus = Variant({
  Active: text, //property is available for sale
  Sold: text, //property has been sold
  rented: text, //property has been rented
  PaymentPending: text, //payment for property is pending
});

const Listings = Record({
  id: text, //id of the property
  propAddress: text, //address of the property
  propType: text, //type of property(home, land, office, etc)
  propDescription: text, //description of the property
  propSize: nat64,
  propPrice: text,
  status: ListingStatus,
});

const User = Record({
  id: text,
  name: text,
  phoneNo: text,
  email: text,
  listing: Vec(text), //list of properties the user has listed
});

const UserPayload = Record({
  name: text,
  phoneNo: text,
  email: text,
});

const Message = Variant({
  NotFound: text,
  InvalidPayload: text,
});

/**
 * `productsStorage` - it's a key-value data structure used to store products listed by sellers in the marketplace.
 * {@link StableBTreeMap} is a self-balancing tree acting as durable data storage that preserves data across canister upgrades.
 * For this contract, we've chosen {@link StableBTreeMap} for several reasons:
 * - `insert`, `get`, and `remove` operations have a constant time complexity of O(1).
 * - Data stored in this map persists across canister upgrades, unlike using a HashMap where data is stored in the heap and can be lost after a canister upgrade.
 */

const propertyStorage = StableBTreeMap(0, text, Property);
const userStorage = StableBTreeMap(1, text, User);
const propertyListingStorage = StableBTreeMap(2, text, Listings);

export default Canister({
  //add property
  addProperty: update(
    [PropertyPayload],
    Result(Property, Message),
    (payload) => {
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
      }
      const propertyId = uuidv4();
      const property = {
        id: propertyId,
        ...payload,
      };
      propertyStorage.insert(propertyId, property);
      return Ok(property);
    }
  ),

  //get property
  getProperty: query([text], Opt(Property), (propertyId) => {
    return propertyStorage.get(propertyId);
  }),

  //get all properties
  getAllProperties: query([], Vec(Property), () => {
    return propertyStorage.values();
  }),

  //adduser
  addUser: update([UserPayload], Result(User, Message), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payoad" });
    }
    const userId = uuidv4();
    const user = {
      id: userId,
      listing: [],
      ...payload,
    };
    userStorage.insert(userId, user);
    return Ok(user);
  }),

  //get user
  getUser: query([text], Opt(User), (userId) => {
    return userStorage.get(userId);
  }),

  //get all users
  getAllUsers: query([], Vec(User), () => {
    return userStorage.values();
  }),

  //add property listing by adding property details to property listing storage
  addPropertyListing: update(
    [text],
    Result(Listings, Message),
    (propertyId) => {
      const propertyOpt = propertyStorage.get(propertyId);
      if (propertyOpt === null) {
        return Err({ NotFound: "property not found" });
      }
      const property = propertyOpt.Some;
      const listing = {
        id: propertyId,
        propAddress: property.address,
        propType: property.propType,
        propDescription: property.description,
        propSize: property.size,
        propPrice: property.price,
        status: { Active: "Active" },
      };
      propertyListingStorage.insert(propertyId, listing);
      return Ok(listing);
    }
  ),

  //get property listing
  getPropertyListing: query([text], Opt(Listings), (propertyId) => {
    return propertyListingStorage.get(propertyId);
  }),

  //get all property listings
  getAllPropertyListings: query([], Vec(Listings), () => {
    return propertyListingStorage.values();
  }),

  //user add property to listing
  makeBid: update([text, text], Result(text, Message), (userId, propertyId) => {
    const userOpt = userStorage.get(userId);
    if (userOpt === null) {
      return Err({ NotFound: "user not found" });
    }
    const propertyOpt = propertyStorage.get(propertyId);
    if (propertyOpt === null) {
      return Err({ NotFound: "property not found" });
    }

    const user = userOpt.Some;
    user.listing.push(propertyId);
    userStorage.insert(userId, user);

    const listingOpt = propertyListingStorage.get(propertyId);
    if (listingOpt === null) {
      return Err({ NotFound: "property listing not found" });
    }
    const listing = listingOpt.Some;
    listing.status = { PaymentPending: "Payment_Pending" };
    propertyListingStorage.insert(propertyId, listing);
    return Ok(
      `property ${propertyId} added to user ${userId}listing and status updated`
    );
  }),

  //get user listing
  getUserListing: query([text], Vec(text), (userId) => {
    const userOpt = userStorage.get(userId);
    if (userOpt === null) {
      return [];
    }
    const user = userOpt.Some;
    return user.listing;
  }),

  //update property listing status
  updatePropertyListingStatus: update(
    [text, text],
    Result(text, Message),
    (propertyId, status) => {
      const listingOpt = propertyListingStorage.get(propertyId);
      if (listingOpt === null) {
        return Err({ NotFound: "property listing not found" });
      }
      const listing = listingOpt.Some;
      listing.status = { [status]: status };
      propertyListingStorage.insert(propertyId, listing);
      return Ok(`property listing status updated to ${status}`);
    }
  ),

  //delete property
  deleteProperty: update([text], Result(text, Message), (propertyId) => {
    const propertyOpt = propertyStorage.get(propertyId);
    if (propertyOpt === null) {
      return Err({ NotFound: "property not found" });
    }
    propertyStorage.remove(propertyId);
    return Ok(`property ${propertyId} deleted`);
  }),

  //delete user
  deleteUser: update([text], Result(text, Message), (userId) => {
    const userOpt = userStorage.get(userId);
    if (userOpt === null) {
      return Err({ NotFound: "user not found" });
    }
    userStorage.remove(userId);
    return Ok(`user ${userId} deleted`);
  }),

  //delete property listing
  deletePropertyListing: update([text], Result(text, Message), (propertyId) => {
    const listingOpt = propertyListingStorage.get(propertyId);
    if (listingOpt === null) {
      return Err({ NotFound: "property listing not found" });
    }
    propertyListingStorage.remove(propertyId);
    return Ok(`property listing ${propertyId} deleted`);
  }),
});

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
