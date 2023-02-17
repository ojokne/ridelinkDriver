import { useCallback, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuthentication, useOrders } from "../context/StateProvider";

let orde = {
  id: 1,
  productName: "Beans",
  amountQuoted: "200000",
  proposedScheduleDate: new Date(),
  productWeight: 25,
  pickupLocation: "Jinja, Uganda",
  deliveryLocation: "Kampala, Uganda",
  isConfirmed: true,
};

const Confirm = () => {
  const { auth } = useAuthentication();
  const { orders } = useOrders();
  const [order, setOrder] = useState();
  const [element, setElement] = useState();
  const [text, setText] = useState();
  const handleLoading = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/driver/load?driverId=${auth.id}&orderId=${order.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }, [auth.id, order.id]);
  const handleDelivering = useCallback(async () => {
    console.log("Delivering");
  }, []);
  useEffect(() => {
    // element = orde.isConfirmed ? (
    //   <ProductCard order={orde} action={handleDelivering} />
    // ) : (
    //   <ProductCard order={orde} action={handleLoading} />
    // );
    setElement(() => {
      return order.isConfirmed ? (
        <ProductCard order={order} action={handleDelivering} />
      ) : (
        <ProductCard order={order} action={handleLoading} />
      );
    });

    setText(() => {
      return orde.isConfirmed
        ? "Please confirm if Product is Delivered"
        : "Please confirm if product is Loaded onto the truck";
    });
    // text = orde.isConfirmed
    //   ? "Please confirm if Product is Delivered"
    //   : "Please confirm if product is Loaded onto the truck";
    for (let i = 0; i < orders.length; i++) {
      let trip = orders[i].trip;
      if (!trip.isLoaded || !trip.isConfirmed) {
        console.log(trip);
        setOrder(trip);
        break;
      }
    }
  }, [orders, order, handleDelivering, handleLoading]);
  return (
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <div className="bg-white rounded  shadow-sm m-3 p-3">
        <h1 className="lead">{text}</h1>
        {element}
      </div>
    </div>
  );
};

export default Confirm;
