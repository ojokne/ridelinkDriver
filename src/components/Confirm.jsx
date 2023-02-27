import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useData } from "../context/StateProvider";
import Loader from "./Loader";

const Confirm = () => {
  const { data } = useData();
  const [element, setElement] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);

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
    if (data.hasOwnProperty("data")) {
      if (data.data.length) {
        for (let i = 0; i < data.data.length; i++) {
          let trip = data.data[i].trip;
          if (!trip.isDelivered || !trip.isLoaded) {
            let order = data.data[i].order;
            setElement(() => {
              return trip.isLoaded ? (
                <ProductCard
                  order={order}
                  trip={trip}
                  action={handleDelivering}
                />
              ) : (
                <ProductCard order={order} trip={trip} action={handleLoading} />
              );
            });
            setText(() => {
              return trip.isLoaded
                ? "Please confirm if Product has been Delivered"
                : "Please confirm if product has been Loaded onto the truck";
            });
            setDisplay(true);
            break;
          }
        }
      }
    } else {
      console.log("No data");
    }
    // let displayOrder = {};
    // let displayTrip = {};
    // for (let i = 0; i < data.data.length; i++) {
    //   let trip = data.data[i].trip;
    //   if (!trip.isDelivered || !trip.isLoaded) {
    //     let item = data.data[i].order;
    //     displayOrder = item;
    //     displayTrip = trip;
    //     break;
    //   }
    // }
    // setOrder(displayOrder);
    // setTrip(displayTrip);
    // setElement(() => {
    //   return trip.isLoaded ? (
    //     <ProductCard order={order} trip={trip} action={handleDelivering} />
    //   ) : (
    //     <ProductCard order={order} trip={trip} action={handleLoading} />
    //   );
    // });
    // setText(() => {
    //   return trip.isLoaded
    //     ? "Please confirm if Product is Delivered"
    //     : "Please confirm if product is Loaded onto the truck";
    // });
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
      {display && (
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <div className="bg-white rounded shadow-sm m-3 p-3">
            <p className="text-muted m-1 p-1">{text}</p>
            {element}
          </div>
        </div>
      )}
      {!display && (
        <div className="d-flex justify-content-center align-items-center flex-wrap p-4 m-3 bg-white shadow-sm rounded">
          <div className="lead text-muted text-center">
            <p>No data to display</p>
            <Link to="/" className="text-decoration-none">
              Back home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirm;
