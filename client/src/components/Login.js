import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("login response:", res);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Login</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            onChange={({ target }) => setEmail(target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
          />

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>

        <div className="text-grey-dark mt-6">
          <a
            className="no-underline border-b border-blue text-blue"
            href="../login/"
          >
            Create an account
          </a>
          .
        </div>
      </div>
    </div>
  );
};
