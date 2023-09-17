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
import { Leaderboards } from "./components/Leaderboards";
import { MainContent } from "./components/MainContent";
import { PlayDemo } from "./components/PlayDemo";
import { HowToPlay } from "./components/HowToPlay";
import { Loading } from "./components/Loading";

const App = () => {
  const { auth } = useAuth();
  const { setUserData } = useUserData();
  const authType = auth as AuthType;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const setUserDataContext = async () => {
      try {
        const userData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(userData.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (authType.accessToken) setUserDataContext();
  }, [auth]);

  return (
    <>
      {/* {authType.accessToken ? <SignOut /> : <></>} */}

      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="play-demo" element={<PlayDemo />} />

          {/* Private routes */}
          <Route element={<PersistLogin />}>
            <Route element={<MainContent />}>
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
                  <Route path="leaderboards" element={<Leaderboards />} />
                </Route>
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
