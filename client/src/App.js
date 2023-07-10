import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";
import { SignOut } from "./components/SignOut";
import { Layout } from "./components/Layout";
import { PersistLogin } from "./components/PersistLogin";
import { Unauthorized } from "./components/Unauthorized";
import { Missing } from "./components/Missing";

const App = () => {
  const { auth } = useAuth();

  return (
    <>
      {auth.accessToken ? <SignOut /> : <></>}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Private routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["BASIC"]} />}>
              <Route path="/">
                <Route index element={<Dashboard />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
