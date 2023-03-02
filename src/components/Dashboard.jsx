import { useEffect, useState } from "react";
import { useData } from "../context/StateProvider";
import { FaClock, FaCheck } from "react-icons/fa";
import Loader from "./Loader";
import { ACTIONS } from "../context/actions";
import useId from "../utils/useId";
import useToken from "../utils/useToken";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { dataDispatch } = useData();
  const [delivered, setDelivered] = useState(0);
  const [pending, setPending] = useState(0);
  const [display, setDisplay] = useState(false);
  let id = useId();
  const token = useToken();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_HOST}/driver/trips/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const data = await res.json();
        dataDispatch({ type: ACTIONS.ADD_ORDERS, data: data.data });
        if (data.hasOwnProperty("data")) {
          if (data.data.length) {
            for (let i = 0; i < data.data.length; i++) {
              let trip = data.data[i].trip;
              if (trip.isDelivered) {
                setDelivered((prev) => prev + 1);
              } else {
                setPending((prev) => prev + 1);
              }
            }
            setDisplay(true);
          }
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchTrips();
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
  }, [id, token, dataDispatch]);

  if (loading) {
    return <Loader loading={loading} description="Please wait" />;
  }
  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted">
        <span>Dashboard</span>
      </div>
      {display && (
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
          </div>
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
