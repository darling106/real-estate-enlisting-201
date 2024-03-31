import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PropertiesPage from "./pages/PropertiesPage";
import UsersPage from "./pages/UsersPage";
import ListingPage from "./pages/ListingsPage";


const App = function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<PropertiesPage />}
        />
        <Route
          path="/users"
          element={<UsersPage />}
        />
        <Route
          path="/listings"
          element={<ListingPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
