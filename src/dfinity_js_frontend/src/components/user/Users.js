import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddUser from "./AddUser";
import User from "./User";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getUsers as getUserList,
  createUser
} from "../../utils/realestateManager";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        await getUserList();
      } catch (error) {
        console.log({ error });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // function to get the list of users
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await getUserList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {
        getUsers();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Users</h1>
            <Link
              to="/"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Properties
            </Link>
            <Link
              to="/listings"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Listings
            </Link>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {users.map((_user, index) => (
              <User
                key={index}
                user={{
                  ..._user,
                }}
                update={update}
              />
            ))}
          </Row>
          <div className="d-flex align-items-center mb-4">
            <AddUser save={addUser} />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Users;
