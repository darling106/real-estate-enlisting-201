# Real Estate Enlisting System Documentation

## Overview

The Real Estate Enlisting System is a comprehensive platform designed to facilitate the listing, bidding, and management of real estate properties. Built on the Internet Computer blockchain using TypeScript, this system provides features for property owners, buyers, and administrators, demonstrating the potential of blockchain technology in real estate applications. Key functionalities include property listing creation, bid submission, user management, and property tracking.

## Structure

### 1. Data Structures

- **Property**: Represents a real estate property with properties like `id`, `description`, `address`, `propType`, `price`, , and `status`.
- **User**: Represents a user with properties like `id`, `name`, `email`, and `listings`.
- **Property Listing**: Represents a property listing with properties like `id`, `propertyId`, `agent` and `status`.

- **ErrorType**: Variant type representing different error scenarios.

### 2. Storage

- `propertiesStorage`: A `StableBTreeMap` to store properties by their IDs.
- `usersStorage`: A `StableBTreeMap` to store users by their IDs.
- `propertyListingsStorage`: A `StableBTreeMap` to store property listings by their IDs.

### 3. Canister Functions

- **Make Bid**: Allows a user to make a bid on a property listing.
- **Add Property**: Adds a new property to the system.
- **Get Property**: Retrieves a property by its ID.
- **Add User**: Adds a new user to the system.
- **Add Property Listing**: Adds a new property listing to the system.
- **Get Property Listing**: Retrieves a property listing by its ID.
- **Get User Listing**: Retrieves property listings associated with a user.

### 4. Helper Functions


### 5. Dependencies

- Imports necessary modules from the "azle" library.
- Utilizes IC APIs like ic.call for blockchain interaction.

### 6. Miscellaneous

- Uses globalThis.crypto for generating random values.
- Uses custom correlation IDs for tracking interactions.
  
### 7. Error Handling

- Functions return `Result` types to handle success or different error scenarios.

## Things to be explained in the course

1. What is Internet Identity? More details here: [Internet Identity](https://internetcomputer.org/internet-identity)
2. What is Principal, Identity, Address? [Internet Identity](https://internetcomputer.org/internet-identity)
3. Canister-to-canister communication and how multi-canister development is done? [Explore Backend Multi-Canister Development on IC](https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320)

## How to deploy canisters implemented in the course

### Backend canister

To deploy the backend canister where the business logic is implemented, use the following command:

```
dfx deploy backend
```

Ensure to run `dfx generate backend` whenever you add/remove functions in the canister or change the signatures. Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### Frontend canister

To deploy the frontend app for the backend canister on IC, use the following command:

```
dfx deploy frontend
```