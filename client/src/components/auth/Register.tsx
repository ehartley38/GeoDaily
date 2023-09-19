import { useEffect, useState } from "react";
import axios from "../../services/axios";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import IMAGES from "../../images/images";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displaySignupMsg, setDisplaySignupMsg] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const displaySignupMsg = searchParams.get("displayRegMsg");
    setDisplaySignupMsg(Boolean(displaySignupMsg));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const demoToken = localStorage.getItem("demoToken");

    try {
      const res = await axios.post(
        "/register",
        { email, username, password, confirmPassword, demoToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <img src={IMAGES.logo} className="w-2/4 mb-6"></img>
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <div className="flex justify-center">
            <a
              onClick={() => navigate("/play-demo")}
              className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-[rgb(51,157,255)] border border-transparent rounded-full md:w-auto cursor-pointer hover:bg-[rgb(71,177,255)] focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Play Demo
            </a>
          </div>

          {/* Divider */}
          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold">OR</p>
          </div>

          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          {displaySignupMsg ? (
            <h2 className="text-center text-amber-300 mb-4">
              You must create an account to continue playing!
            </h2>
          ) : (
            <></>
          )}
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            onChange={({ target }) => setEmail(target.value)}
          />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="username"
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={({ target }) => setConfirmPassword(target.value)}
          />

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            onClick={handleSubmit}
          >
            Create Account
          </button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the Terms of Service and Privacy Policy
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          <p className="no-underline border-b border-blue text-blue">
            Already have an account?
            <Link to="/login"> Log in.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
