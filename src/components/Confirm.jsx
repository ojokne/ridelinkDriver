import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useTrips } from "../context/StateProvider";

const Confirm = () => {
  const { trips } = useTrips();
  const [order, setOrder] = useState({});
  const [trip, setTrip] = useState({});
  const [element, setElement] = useState();
  const [text, setText] = useState();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
  });

  const handleLoading = useCallback(
    async (driverId, orderId) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_HOST}/driver/load?driverId=${driverId}&orderId=${orderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.isLoaded) {
          navigate("/");
        } else {
          setAlert((prev) => {
            return {
              ...prev,
              alert: true,
              message: "Could not process request, try again",
            };
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    [navigate]
  );
  const handleDelivering = useCallback(async () => {
    console.log("Delivering");
  }, []);
  useEffect(() => {
    for (let i = 0; i < trips.length; i++) {
      let trip = trips[i].order;
      if (!trip.isDelivered || !trip.isLoaded) {
        let item = trips[i].trip;
        setOrder(trip);
        setTrip(item);
        break;
      }
    }
    setElement(() => {
      return trip.isLoaded ? (
        <ProductCard order={order} trip={trip} action={handleDelivering} />
      ) : (
        <ProductCard order={order} trip={trip} action={handleLoading} />
      );
    });

    setText(() => {
      return trip.isLoaded
        ? "Please confirm if Product is Delivered"
        : "Please confirm if product is Loaded onto the truck";
    });
  }, [trips, order, handleDelivering, handleLoading, trip]);
  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted">
        <span>Dashboard</span>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-wrap">
        {alert.alert && (
          <div>
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {alert.message}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          </div>
        )}

        <div>
          <h1 className="lead">{text}</h1>
          {element}
        </div>
      </div>
    </div>
  );
};

export default Confirm;
