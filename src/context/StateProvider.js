import { createContext, useContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import { orderReducer } from "./orderReducer";

const AuthenticationContext = createContext();
const OrderContext = createContext();

export const StateProvider = ({ children }) => {
  const [auth, authDispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    id: null,
  });

  const [orders, ordersDispatch] = useReducer(orderReducer, []);

  return (
    <AuthenticationContext.Provider value={{ auth, authDispatch }}>
      <OrderContext.Provider value={{ orders, ordersDispatch }}>
        {children}
      </OrderContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export const useOrders = () => {
  return useContext(OrderContext);
};
