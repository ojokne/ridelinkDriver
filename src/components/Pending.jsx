import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { useOrders } from "../context/StateProvider";
import Loader from "./Loader";
import ProductCard from "./ProductCard";

const Pending = () => {
  const { orders } = useOrders();
  const [element, setElement] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState("");
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
  });
  const navigate = useNavigate();

  const handleLoading = useCallback(
    (id) => {
      setLoading(true);
      updateDoc(doc(db, "eOrders", id), {
        isLoaded: true,
      })
        .then((res) => {
          setLoading(false);
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
          setAlert((prev) => {
            return {
              ...prev,
              alert: true,
              message: "Could not process request ",
            };
          });
        });
    },
    [navigate]
  );
  const handleDelivering = useCallback(
    (id) => {
      setLoading(true);
      updateDoc(doc(db, "eOrders", id), {
        isDelivered: true,
      })
        .then((res) => {
          setLoading(false);
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
          setAlert((prev) => {
            return {
              ...prev,
              alert: true,
              message: "Could not process request ",
            };
          });
        });
    },
    [navigate]
  );
  useEffect(() => {
    for (let i = 0; i < orders.orders.length; i++) {
      let order = orders.orders[i];
      if (order.isConfirmed && (!order.isLoaded || !order.isDelivered)) {
        setText(() => {
          return order.isLoaded
            ? "Please confirm if Product has been Delivered"
            : "Please confirm if product has been Loaded onto the truck";
        });

        setElement(() => {
          return order.isLoaded ? (
            <ProductCard order={order} action={handleDelivering} />
          ) : (
            <ProductCard order={order} action={handleLoading} />
          );
        });
        break;
      }
    }
  }, [orders, handleLoading, handleDelivering]);

  if (loading) {
    return <Loader loading={loading} description="Please wait" />;
  }

  return (
    <div>
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
      <div className="mx-3 pt-3 lead text-muted d-flex justify-content-between align-items-center">
        <span>Pending</span>
        <span>
          <Link to="/" className="text-decoration-none ridelink-color">
            <FaTimes
              className="icon iconSmall me-3"
              style={{ backgroundColor: "red" }}
            />
          </Link>
        </span>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-wrap">
        <div className="bg-white rounded shadow-sm m-3 p-3">
          <p className="text-muted m-1 p-1">{text}</p>
          {element}
        </div>
      </div>
    </div>
  );
};

export default Pending;
