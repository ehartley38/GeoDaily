import { useState } from "react";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Press");
    try {
      const res = await axios.post(
        "/users/register",
        { email, username, password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
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
          Already have an account?
          <a
            className="no-underline border-b border-blue text-blue"
            href="../login/"
          >
            Log in
          </a>
          .
        </div>
      </div>
    </div>
  );
};
