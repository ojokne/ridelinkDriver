import { useEffect, useRef, useState } from "react";
import { useTrips } from "../context/StateProvider";

import { ACTIONS } from "../context/actions";
import Loader from "./Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  // const { auth } = useAuthentication();
  const { trips, tripsDispatch } = useTrips();
  const effectRan = useRef(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_HOST}/driver/trips/1`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        tripsDispatch({ type: ACTIONS.ADD_ORDERS, data: data.data });
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    if (!effectRan.current) {
      fetchTrips();
      return () => {
        effectRan.current = true;

        tripsDispatch({ type: ACTIONS.CLEAR_TRIPS });
      };
    }
    // for (let i = 0; i < trips.length; i++) {
    //   console.log(trips);
    //   let trip = trips[i].order;
    //   if (!trip.isDelivered || !trip.isLoaded) {
    //     console.log(trip.id);
    //     let or = trips[i].order;
    //     console.log(or.id);
    //     break;
    //   }
    // }
  }, [trips, tripsDispatch]);

  if (loading) {
    return <Loader loading={loading} description="Please wait" />;
  }
  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted">
        <span>Dashboard</span>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-wrap"></div>
    </div>
  );
};

export default Dashboard;
