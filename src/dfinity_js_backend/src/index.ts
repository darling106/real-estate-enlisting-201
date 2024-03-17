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
import {
  Ledger,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
//import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Property = Record({
  id: text,
  address: text,//address of the property
  propType: text, //type of property(home, land, office, etc)
  description: text,//description of the property
  size: text,
  price: nat64,
});

const PropertyPayload = Record({
  address: text,
  propType: text,
  description: text,
  size: text,
  price: nat64,
});

const ListingStatus = Variant({
  Active: text,//property is available for sale
  Sold: text,//property has been sold
  rented: text,//property has been rented
  PaymentPending: text,//payment for property is pending
});

const Listings = Record({
  propertyId: text,//id of the property
  date: text,//date the property was listed
  agent: Principal, //agent who listed the property
  status: ListingStatus,//status of the property listing
});

const User = Record({
  id: text,
  name: text,
  phoneNo: nat64,
  email: text,
  listing: Vec(text),//list of properties the user has listed
});

const UserPayload = Record({
  name: text,
  phoneNo: nat64,
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
      const propety = {
        id: propertyId,
        ...payload,
      };
      propertyStorage.insert(propertyId, propety);
      return Ok(propety);
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

  //add property listing
  addPropertyListing: update(
    [text],
    Result(Listings, Message),
    (propertyId) => {
      const propertyOpt = propertyStorage.get(propertyId);
      if (propertyOpt === null) {
        return Err({ NotFound: "property not found" });
      }

      const listing = {
        propertyId: propertyId,
        date: new Date().toISOString(),
        agent: ic.caller(),
        status: { Active: "For sale" },
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
  makeBid: update(
    [text, text],
    Result(text, Message),
    (userId, propertyId) => {
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
      return Ok(`property ${propertyId} added to user ${userId}listing and status updated`);
    }
  ),

  //get user listing
  getUserListing: query([text], Vec(text), (userId) => {
    const userOpt = userStorage.get(userId);
    if (userOpt === null) {
      return [];
    }
    const user = userOpt.Some;
    return user.listing;
  }),
});
