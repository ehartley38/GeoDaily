import { Link } from "react-router-dom";

export const Missing = () => {
  return (
    <>
      <h1> Page not found</h1>
      <Link to="/"> Home </Link>
    </>
  );
};
