import { useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Route, Routes, useLocation } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import useAuth from "./hooks/useAuth";
import { SignOut } from "./components/auth/SignOut";
import { Layout } from "./components/auth/Layout";
import { PersistLogin } from "./components/auth/PersistLogin";
import { Unauthorized } from "./components/auth/Unauthorized";
import { Missing } from "./components/auth/Missing";
import { AuthType } from "./customTypings/auth";
import { PlayDaily } from "./components/PlayDaily";
import { SpecificChallengeSummary } from "./components/SpecificChallengeSummary";
import { History } from "./components/History";
import { Friends } from "./components/Friends";
import { NavBar } from "./components/NavBar";
import useUserData from "./hooks/useUserData";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

const App = () => {
  const { auth } = useAuth();
  const { setUserData, userData } = useUserData();
  const authType = auth as AuthType;
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const isNotPlayDailyRoute = !location.pathname.startsWith("/play-daily");

  useEffect(() => {
    const setUserDataContext = async () => {
      try {
        const userData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(userData.data);
      } catch (err) {}
    };

    if (authType.accessToken) setUserDataContext();
  }, [auth]);

  return (
    <>
      {authType.accessToken ? <SignOut /> : <></>}
      {/* Navbar */}
      {userData && isNotPlayDailyRoute && (
        <NavBar username={userData?.username} />
      )}
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
                <Route path="play-daily/:challengeId">
                  <Route index element={<PlayDaily />} />
                </Route>
                <Route path="challenge-history">
                  <Route index element={<History />} />
                  <Route
                    path=":challengeId"
                    element={<SpecificChallengeSummary />}
                  />
                </Route>
                <Route path="friends" element={<Friends />} />
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
