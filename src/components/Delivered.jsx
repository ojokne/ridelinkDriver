import { useEffect, useState } from "react";
import { FaTimes, FaTruckMoving } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useOrders } from "../context/StateProvider";

const styles = {
  iconLarge: {
    color: "white",
    backgroundColor: "#32a885",
    opacity: 0.8,
    fontSize: "3em",
    padding: "6px",
    margin: "6px",
    borderRadius: "50%",
  },
};

const Delivered = () => {
  const { orders } = useOrders();
  const [delivered, setDelivered] = useState([]);

  useEffect(() => {
    for (let i = 0; i < orders.orders.length; i++) {
      let order = orders.orders[i];
      if (order.isDelivered) {
        const date = new Date(order.scheduleDate).toDateString();
        order = {
          ...order,
          scheduleDate: date,
        };
        setDelivered((prev) => [...prev, order]);
      }
    }
    return () => {
      setDelivered([]);
    };
  }, []);
  return (
    <div>
      <div className="mx-3 pt-3 lead text-muted d-flex justify-content-between align-items-center">
        <span>Delivered</span>
        <span>
          <Link to="/" className="text-decoration-none ridelink-color">
            <FaTimes
              className="icon iconSmall me-3"
              style={{ backgroundColor: "red" }}
            />
          </Link>
        </span>
      </div>
      <div className="d-flex flex-row flex-wrap">
        {delivered.map((order, index) => {
          return (
            <div
              className="d-flex flex-row m-3 p-4 bg-white shadow-sm rounded"
              style={{ width: "367px" }}
              key={index}
            >
              <span>
                <FaTruckMoving style={styles.iconLarge} />
              </span>
              <div className="d-flex flex-column justify-content-between">
                <div className="d-flex flex-column my-2">
                  <span className="px-1 lead">{order.productName}</span>
                  <span
                    className="px-1"
                    style={{ fontSize: ".7em", fontWeight: "lighter" }}
                  >
                    Product Name
                  </span>
                </div>
                <div className="d-flex flex-column my-2">
                  <span className="px-1 text-muted lead">
                    {order.productWeight}
                    <span className="px-1" style={{ fontSize: "0.7em" }}>
                      Tonnes
                    </span>
                  </span>
                  <span
                    className="px-1"
                    style={{ fontSize: ".7em", fontWeight: "lighter" }}
                  >
                    Weight
                  </span>
                </div>
                <div className="d-flex flex-column my-2">
                  <span className="px-1 text-muted lead">
                    {order.scheduleDate}
                  </span>
                  <span
                    className="px-1"
                    style={{ fontSize: ".7em", fontWeight: "lighter" }}
                  >
                    Date
                  </span>
                </div>
                <div className="d-flex flex-column my-2">
                  <span className="px-1 text-muted lead">
                    {order.pickupLocation}
                  </span>
                  <span
                    className="px-1"
                    style={{ fontSize: ".7em", fontWeight: "lighter" }}
                  >
                    Pick up
                  </span>
                </div>
                <div className="d-flex flex-column my-2">
                  <span className="px-1 text-muted lead">
                    {order.deliveryLocation}
                  </span>
                  <span
                    className="px-1"
                    style={{ fontSize: ".7em", fontWeight: "lighter" }}
                  >
                    Drop off
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Delivered;
