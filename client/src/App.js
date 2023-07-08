import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    // <div className="min-h-screen grid place-content-center radial-blue">
    <>
      <Routes>
        <Route path="/">
          {/* Public routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Private routes */}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
