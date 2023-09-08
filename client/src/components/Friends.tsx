import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./friends.css";
import IMAGES from "../images/images";

type friendRequestType = {
  id: string;
  receiverUsername: string;
  senderUsername: string;
};

type friendDataType = {
  id: string;
  username: string;
};

export const Friends = () => {
  const axiosPrivate = useAxiosPrivate();
  const [username, setUsername] = useState<string>();
  const [friendRequests, setFriendRequests] = useState<
    friendRequestType[] | null
  >();
  const [friendData, setFriendData] = useState<friendDataType[] | null>();

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
    };

    getFriendRequestData();
    getFriendData();
    console.log(friendRequests);
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

      // Update friend data state
      const responseData = acceptFriendResponse.data;
      let updatedFriendData = friendData?.map((user) => {
        return user;
      });
      updatedFriendData?.push({
        id: responseData.senderId,
        username: senderUsername,
      });

      setFriendData(updatedFriendData);

      // Update friend requests state
      const updatedFriendRequests = friendRequests?.filter(
        (request) => request.id !== requestId
      );
      setFriendRequests(updatedFriendRequests);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const rejectRequest = await axiosPrivate.post(
        "/users/reject-friend-request",
        { requestId: requestId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update friend requests state
      const updatedFriendRequests = friendRequests?.filter(
        (request) => request.id !== requestId
      );
      setFriendRequests(updatedFriendRequests);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="friends-page">
      <div className="friends-card-wrapper">
        <div className="friends-card">
          <div className="friends-card-inner-upper">
            <div>Your Friends</div>
            <div className="add-friend-button">
              <img
                src={IMAGES.addFriendsIcon}
                className="add-friend-icon"
              ></img>
              <span>Add a friend</span>
            </div>
          </div>
          <div className="friends-card-inner-lower">
            <div className="friends-card-data">
              {friendData &&
                friendData.map((user: any) => (
                  <div key={user.id} className="friend">
                    <img src={IMAGES.profilePicture} alt="avatar"></img>
                    <div>{user.username}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="recommended-friends-card-wrapper">
        <div className="friends-card">
          <div className="friends-card-inner-upper">Friend Requests</div>
          <div className="friends-card-inner-lower">
            <div className="friends-card-data">
              {friendRequests &&
                friendRequests.map((request: any) => (
                  <div key={request.id} className="bg-slate-400 ">
                    <h2>From: {request.senderUsername}</h2>
                    <button
                      onClick={() =>
                        handleAccept(request.id, request.senderUsername)
                      }
                    >
                      Accept
                    </button>
                    <button onClick={() => handleReject(request.id)}>
                      Reject
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    // <>
    //   <h1>Friends</h1>
    //   <h2>Add new friend</h2>
    //   <form onSubmit={handleSubmit}>
    //     <label
    //       className="block text-gray-700 text-sm font-bold mb-2"
    //       htmlFor="username"
    //     >
    //       Username
    //     </label>
    //     <input
    //       className="shadow appearance-none border rounded py-2 px-3 text-gray-700"
    //       id="username"
    //       type="text"
    //       placeholder="Username"
    //       onChange={({ target }) => setUsername(target.value)}
    //     />
    //     <button
    //       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //       type="submit"
    //     >
    //       Send invite
    //     </button>
    //   </form>
    //   <h2>Your invitations</h2>

    // </>
  );
};
