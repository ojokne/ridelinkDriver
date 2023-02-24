import { FaTruckMoving } from "react-icons/fa";
import useAuth from "../utils/useAuth";

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

const ProductCard = ({ order, action, trip }) => {
  const id = useAuth();
  const date = new Date(order.proposedScheduleDate).toDateString();
  const text = trip.isLoaded ? "Product Delivered" : "Product Loaded";
  return (
    <div>
      <div className="d-flex flex-row">
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
            <span className="px-1 text-muted lead">{date}</span>
            <span
              className="px-1"
              style={{ fontSize: ".7em", fontWeight: "lighter" }}
            >
              Date
            </span>
          </div>
          <div className="d-flex flex-column my-2">
            <span className="px-1 text-muted lead">{order.pickupLocation}</span>
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
          <div className="px-1 my-2">
            <button
              className="btn ridelink-background text-white "
              onClick={() => action(id, order.id)}
            >
              {text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
