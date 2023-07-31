import { useState } from "react";

export const Friends = () => {
  const [username, setUsername] = useState<string>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <h1>Friends</h1>
      <h2>Add new friend</h2>
      <form onSubmit={handleSubmit}>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700"
          id="username"
          type="text"
          placeholder="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Send invite
        </button>
      </form>
      <h2>Your invitations</h2>
      <h2>Your friends</h2>
    </>
  );
};
