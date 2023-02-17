import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { ACTIONS } from "../context/actions";
import { useAuthentication, useOrders } from "../context/StateProvider";
import useAuth from "../utils/useAuth";

const Dashboard = () => {
  useAuth();
  const { auth } = useAuthentication();
  const { ordersDispatch } = useOrders();
  const [loading, setLoading] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/driver/trips/${auth.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        ordersDispatch({ type: ACTIONS.ADD_ORDERS, data: data.data });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    if (!effectRan.current) {
      fetchTrips();
      return () => {
        effectRan.current = true;
        ordersDispatch({ type: ACTIONS.CLEAR_ORDERS });
      };
    }
  }, [auth.id, ordersDispatch]);

  if (loading) {
    return <Loader loading={loading} description="Loading" />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/confirm">Confirm</Link>
    </div>
  );
};

export default Dashboard;
