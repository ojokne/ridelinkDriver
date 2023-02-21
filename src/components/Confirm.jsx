import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useData } from "../context/StateProvider";
import Loader from "./Loader";

const Confirm = () => {
  const { data } = useData();
  const [order, setOrder] = useState({});
  const [trip, setTrip] = useState({});
  const [element, setElement] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
  });

  const handleLoading = useCallback(
    async (driverId, orderId) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_HOST}/driver/load?driverId=${driverId}&orderId=${orderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        setLoading(false);
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
  const handleDelivering = useCallback(
    async (driverId, orderId) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_HOST}/driver/deliver?driverId=${driverId}&orderId=${orderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        setLoading(false);
        if (data.isDelivered) {
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
  useEffect(() => {
    if (!effectRan.current) {
      let displayOrder = {};
      let displayTrip = {};
      for (let i = 0; i < data.data.length; i++) {
        let trip = data.data[i].trip;
        if (!trip.isDelivered || !trip.isLoaded) {
          let item = data.data[i].order;
          // setOrder(item);
          // setTrip(trip);
          displayOrder = item;
          displayTrip = trip;
          break;
        }
      }
      setOrder(displayOrder);
      setTrip(displayTrip);
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

      return () => {
        setOrder({});
        setTrip({});
        setText("");
        setElement(null);
      };
    }
    // eslint-disable-next-line
  }, [handleDelivering, handleLoading]);

  if (loading) {
    return <Loader loading={loading} description="Please wait" />;
  }

  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted">
        <span>Confirm</span>
      </div>
      {alert.alert && (
        <div>
          <div
            className="alert alert-danger alert-dismissible fade show m-3"
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
      {order?.id && (
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <div className="bg-white rounded shadow-sm m-3 p-3">
            <p className="text-muted m-1 p-1">{text}</p>
            {element}
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirm;
