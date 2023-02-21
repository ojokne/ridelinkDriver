import { createContext, useContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import { dataReducer } from "./dataReducer";

const AuthenticationContext = createContext();
const DataContext = createContext();

export const StateProvider = ({ children }) => {
  const [auth, authDispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    id: null,
  });

  const [data, dataDispatch] = useReducer(dataReducer, {});

  return (
    <AuthenticationContext.Provider value={{ auth, authDispatch }}>
      <DataContext.Provider value={{ data, dataDispatch }}>
        {children}
      </DataContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export const useData = () => {
  return useContext(DataContext);
};
