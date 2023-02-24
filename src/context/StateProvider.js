import { createContext, useContext, useReducer } from "react";
import { dataReducer } from "./dataReducer";

const DataContext = createContext();

export const StateProvider = ({ children }) => {
  const [data, dataDispatch] = useReducer(dataReducer, {});

  return (
    <DataContext.Provider value={{ data, dataDispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
