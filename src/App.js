import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Confirm from "./components/Confirm";
import Pending from "./components/Pending";
import Delivered from "./components/Delivered";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}></Route>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />}>
            <Route path="pending" element={<Pending />} />
            <Route path="delivered" element={<Delivered />} />
          </Route>
          <Route path="/confirm" element={<Confirm />} />
        </Route>
        <Route path="*" element={<p>Error page</p>} />
      </Routes>
    </div>
  );
}

export default App;
