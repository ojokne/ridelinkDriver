import { createContext, useContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import { tripReducer } from "./tripReducer";

const AuthenticationContext = createContext();
const TripContext = createContext();

export const StateProvider = ({ children }) => {
  const [auth, authDispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    id: null,
  });

  const [trips, tripsDispatch] = useReducer(tripReducer, []);

  return (
    <AuthenticationContext.Provider value={{ auth, authDispatch }}>
      <TripContext.Provider value={{ trips, tripsDispatch }}>
        {children}
      </TripContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export const useTrips = () => {
  return useContext(TripContext);
};
