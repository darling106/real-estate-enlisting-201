import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createProperty(property) {
  return window.canister.realestateManager.addProperty(property);
}

//create user
export async function createUser(user) {
  return window.canister.realestateManager.addUser(user);
}

//get all users
export async function getUsers() {
  try {
    return await window.canister.realestateManager.getAllUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

//get all properties
export async function getProperties() {
  try {
    return await window.canister.realestateManager.getAllProperties();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

//get property listings
export async function getPropertyListings() {
  try {
    return await window.canister.realestateManager.getAllPropertyListings();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

//add property to listing
export async function addPropertyListing(propertyId) {
  return window.canister.realestateManager.addPropertyListing(propertyId);
}

//get property by id
export async function getProperty(propertyId) {
  try {
    return await window.canister.realestateManager.getProperty(propertyId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

//get property listings
export async function getPropertyListing(propertyId) {
  try {
    return await window.canister.realestateManager.getAllPropertyListing(propertyId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

//make a bid
export async function makeBid(bid) {
  return window.canister.realestateManager.makeBid(bid);
}

export async function buyProperty(property) {
  const realestateManagerCanister = window.canister.realestateManager;
  const orderResponse = await realestateManagerCanister.payForProperty(property.id);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await realestateManagerCanister.getAddressFromPrincipal(
    sellerPrincipal
  );
  const block = await transferICP(
    sellerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );realestateManagerCanister.completePurchase(
    sellerPrincipal,
    property.id,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
