import { useEffect, useState } from "react";
import { useOrders } from "../context/StateProvider";
import { FaClock, FaCheck } from "react-icons/fa";
import Loader from "./Loader";
import { ACTIONS } from "../context/actions";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { ordersDispatch } = useOrders();
  const [delivered, setDelivered] = useState(0);
  const [pending, setPending] = useState(0);
  const [display, setDisplay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubcribeFromFirestore;
    const unsubcribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const querySnapShot = query(
          collection(db, "eOrders"),
          "eOrders",
          where("driverId", "==", auth.currentUser.uid)
        );
        unsubcribeFromFirestore = onSnapshot(querySnapShot, (snapshot) => {
          if (snapshot.empty) {
            setDisplay(false);
            setLoading(false);
          } else {
            for (let i = 0; i < snapshot.docs.length; i++) {
              let order = snapshot.docs[i].data();
              if (order.isConfirmed) {
                if (order.isDelivered) {
                  setDelivered((prev) => prev + 1);
                } else {
                  setPending((prev) => prev + 1);
                }
              }
            }

            let ordersArray = [];
            for (let i = 0; i < snapshot.docs.length; i++) {
              const order = {
                ...snapshot.docs[i].data(),
                id: snapshot.docs[i].id,
              };
              ordersArray.push(order);
            }
            ordersDispatch({ type: ACTIONS.ADD_ORDERS, orders: ordersArray });
            setLoading(false);
            setDisplay(true);
          }
        });
      } else {
        navigate("/login");
        if (unsubcribeFromFirestore) {
          unsubcribeFromFirestore();
        }
      }
    });
    return () => {
      unsubcribeFromAuth();
      setDelivered(0);
      setPending(0);
      if (unsubcribeFromFirestore) {
        unsubcribeFromFirestore();
      }
    };
  }, [navigate, ordersDispatch]);
  if (loading) {
    return <Loader loading={loading} description="Please wait" />;
  }
  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted">
        <span>Dashboard</span>
      </div>
      {display && (
        <div>
          <div className="d-flex justify-content-center align-items-center flex-wrap">
            <div
              style={{ width: "367px" }}
              className="m-3 p-4 bg-white shadow-sm rounded"
            >
              <span className="text-muted" style={{ fontSize: "20px" }}>
                Pending
              </span>
              <div className="d-flex align-items-center">
                <span>
                  <FaClock
                    className="icon iconMenu me-3"
                    style={{ backgroundColor: "#ffc107" }}
                  />
                </span>
                <span className="me-3" style={{ fontSize: "30px" }}>
                  {pending}
                </span>
              </div>
              <div className="mt-3">
                {pending > 0 ? (
                  <Link
                    to="pending"
                    className="text-decoration-none ridelink-color"
                  >
                    View pending orders
                  </Link>
                ) : (
                  <span className="text-muted">No orders on trip</span>
                )}
              </div>
            </div>
            <div
              style={{ width: "367px" }}
              className="m-3 p-4 bg-white shadow-sm rounded"
            >
              <span className="text-muted" style={{ fontSize: "20px" }}>
                Delivered
              </span>
              <div className="d-flex align-items-center">
                <span>
                  <FaCheck className="icon iconMenu me-3" />
                </span>
                <span className="me-3" style={{ fontSize: "30px" }}>
                  {delivered}
                </span>
              </div>
              <div className="mt-3">
                {delivered > 0 ? (
                  <Link
                    to="delivered"
                    className="text-decoration-none ridelink-color"
                  >
                    View orders delivered
                  </Link>
                ) : (
                  <span className="text-muted">
                    No orders have been delivered
                  </span>
                )}
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      )}
      {!display && (
        <div className="d-flex justify-content-center align-items-center flex-wrap p-4 m-3 bg-white shadow-sm rounded">
          <div className="lead text-muted text-center">
            <p>You have not made and deliveries yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
