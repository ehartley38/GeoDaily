import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "../../services/axios";
import useAuth from "../../hooks/useAuth";
import IMAGES from "../../images/images";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const [persist, setPersist] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayLoginSuccessMsg, setDisplayLoginSuccessMsg] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const displaySuccessMsg = searchParams.get("displaySuccessMsg");

    setDisplayLoginSuccessMsg(Boolean(displaySuccessMsg));
  }, []);

  useEffect(() => {
    localStorage.setItem("persist", persist.toString());
  }, [persist]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = res?.data?.accessToken;
      const roleList = res?.data?.roleList;

      setAuth({ email, password, roleList, accessToken });

      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.response.data.message);
      setDisplayLoginSuccessMsg(false);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <img src={IMAGES.logo} className="w-2/4 mb-6"></img>
        {errorMsg && <div className="error-msg">Error: {errorMsg}</div>}
        {displayLoginSuccessMsg && (
          <div className="success-msg">Registration successful!</div>
        )}
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Login</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            onChange={({ target }) => {
              setEmail(target.value);
              setErrorMsg(null);
            }}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            onChange={({ target }) => {
              setPassword(target.value);
              setErrorMsg(null);
            }}
          />

          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setPersist((prev) => !prev)}
              checked={persist}
            />

            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Stay logged in?
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>

        <div className="text-grey-dark mt-6">
          <span className="no-underline border-b border-blue text-blue">
            <Link to="/register">Create an account</Link>
          </span>
          <span> or </span>
          <span className="no-underline border-b border-blue text-blue">
            <Link to="/play-demo">Try the demo</Link>
          </span>
        </div>
        <a
          className="flex justify-center mt-4 mb-4"
          href="https://github.com/ehartley38"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-7 w-7"
            style={{
              color: "#333",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
