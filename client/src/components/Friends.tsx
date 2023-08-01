import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const Friends = () => {
  const axiosPrivate = useAxiosPrivate();
  const [username, setUsername] = useState<string>();
  const [friendRequests, setFriendRequests] = useState<any>(); //Tidy up type
  const [friendData, setFriendData] = useState<any>(); // Tidy up type

  useEffect(() => {
    const getFriendRequestData = async () => {
      const friendRequests = await axiosPrivate.get(
        "/users/get-friend-requests",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setFriendRequests(friendRequests.data);
    };

    const getFriendData = async () => {
      const friendData = await axiosPrivate.get("/users/data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setFriendData(friendData.data.friends);
      console.log(friendData.data.friends);
    };

    getFriendRequestData();
    getFriendData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const friendRequestResponse = await axiosPrivate.post(
      "/users/send-friend-request",
      { receiverUsername: username },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log(friendRequestResponse);
  };

  const handleAccept = async (requestId: string, senderUsername: string) => {
    try {
      const acceptFriendResponse = await axiosPrivate.post(
        "/users/accept-friend-request",
        { requestId: requestId, senderUsername: senderUsername },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
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
      {friendRequests &&
        friendRequests.map((request: any) => (
          <div key={request.id} className="bg-slate-400 my-2">
            <h2>From: {request.senderUsername}</h2>
            <button
              onClick={() => handleAccept(request.id, request.senderUsername)}
            >
              Accept
            </button>
            <button>Reject</button>
          </div>
        ))}
      <h2>Your friends</h2>
    </>
  );
};
