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
import { v4 as uuidv4 } from "uuid";

// Define property record structure
const Property = Record({
  id: text,
  address: text,
  propType: text,
  description: text,
  size: text,
  price: nat64,
});

// Define payload structure for adding property
const PropertyPayload = Record({
  address: text,
  propType: text,
  description: text,
  size: text,
  price: nat64,
});

// Define possible listing statuses
const ListingStatus = Variant({
  Active: text,
  Sold: text,
  Rented: text,
  PaymentPending: text,
});

// Define property listing record structure
const Listings = Record({
  propertyId: text,
  date: text,
  agent: Principal,
  status: ListingStatus,
});

// Define user record structure
const User = Record({
  id: text,
  name: text,
  phoneNo: nat64,
  email: text,
  listing: Vec(text),
});

// Define payload structure for adding user
const UserPayload = Record({
  name: text,
  phoneNo: nat64,
  email: text,
});

// Define possible error messages
const Message = Variant({
  NotFound: text,
  InvalidPayload: text,
});

// Create stable B-tree maps for storing data
const propertyStorage = StableBTreeMap(0, text, Property);
const userStorage = StableBTreeMap(1, text, User);
const propertyListingStorage = StableBTreeMap(2, text, Listings);

// Export canister interface
export default Canister({
  // Add property to the system
  addProperty: update(
    [PropertyPayload],
    Result(Property, Message),
    (payload) => {
      // Validate payload
      if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ InvalidPayload: "Invalid payload" });
      }

      // Generate unique ID for the property
      const propertyId = uuidv4();

      // Create property object
      const property = {
        id: propertyId,
        ...payload,
      };

      // Store property in the storage
      propertyStorage.insert(propertyId, property);
      return Ok(property);
    }
  ),

  // Get property by ID
  getProperty: query([text], Opt(Property), (propertyId) => {
    return propertyStorage.get(propertyId);
  }),

  // Get all properties
  getAllProperties: query([], Vec(Property), () => {
    return propertyStorage.values();
  }),

  // Add user to the system
  addUser: update([UserPayload], Result(User, Message), (payload) => {
    // Validate payload
    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "Invalid payload" });
    }

    // Generate unique ID for the user
    const userId = uuidv4();

    // Create user object
    const user = {
      id: userId,
      listing: [],
      ...payload,
    };

    // Store user in the storage
    userStorage.insert(userId, user);
    return Ok(user);
  }),

  // Get user by ID
  getUser: query([text], Opt(User), (userId) => {
    return userStorage.get(userId);
  }),

  // Get all users
  getAllUsers: query([], Vec(User), () => {
    return userStorage.values();
  }),

  // Add property listing
  addPropertyListing: update(
    [text],
    Result(Listings, Message),
    (propertyId) => {
      // Check if property exists
      const property = propertyStorage.get(propertyId);
      if (!property) {
        return Err({ NotFound: "Property not found" });
      }

      // Create listing object
      const listing = {
        propertyId,
        date: new Date().toISOString(),
        agent: ic.caller(),
        status: { Active: "For sale" },
      };

      // Store listing in the storage
      propertyListingStorage.insert(propertyId, listing);
      return Ok(listing);
    }
  ),

  // Get property listing by property ID
  getPropertyListing: query([text], Opt(Listings), (propertyId) => {
    return propertyListingStorage.get(propertyId);
  }),

  // Get all property listings
  getAllPropertyListings: query([], Vec(Listings), () => {
    return propertyListingStorage.values();
  }),

  // Make bid on a property
  makeBid: update(
    [text, text],
    Result(text, Message),
    (userId, propertyId) => {
      // Check if user exists
      const user = userStorage.get(userId);
      if (!user) {
        return Err({ NotFound: "User not found" });
      }

      // Check if property exists
      const property = propertyStorage.get(propertyId);
      if (!property) {
        return Err({ NotFound: "Property not found" });
      }

      // Add property to user's listing
      user.listing.push(propertyId);
      userStorage.insert(userId, user);

      // Update property listing status
      const listing = propertyListingStorage.get(propertyId);
      if (!listing) {
        return Err({ NotFound: "Property listing not found" });
      }
      listing.status = { PaymentPending: "Payment Pending" };
      propertyListingStorage.insert(propertyId, listing);

      return Ok(`Property ${propertyId} added to user ${userId} listing and status updated`);
    }
  ),

  // Get user's property listings
  getUserListing: query([text], Vec(text), (userId) => {
    const user = userStorage.get(userId);
    return user ? user.listing : [];
  }),
});
