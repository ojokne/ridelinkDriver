import { createContext, useContext, useReducer } from "react";
import { orderReducer } from "./orderReducer";

const OrdersContext = createContext();

export const StateProvider = ({ children }) => {
  const [orders, ordersDispatch] = useReducer(orderReducer, {});

  return (
    <OrdersContext.Provider value={{ orders, ordersDispatch }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrdersContext);
};
