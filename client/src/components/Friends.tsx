import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./friends.css";
import IMAGES from "../images/images";
import axios, { AxiosError } from "axios";
import { Loading } from "./Loading";
import useIsBackgroundDisabled from "../hooks/useIsBackgroundDisabled";

type friendRequestType = {
  id: string;
  receiverUsername: string;
  senderUsername: string;
};

type friendDataType = {
  id: string;
  username: string;
  profilePicture: number;
};

export const Friends = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setIsBackgroundDisabled } = useIsBackgroundDisabled();
  const [username, setUsername] = useState<string>("");
  const [friendRequests, setFriendRequests] = useState<
    friendRequestType[] | null
  >();
  const [friendData, setFriendData] = useState<friendDataType[] | null>();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [friendRequestResMsg, setFriendRequestResMsg] = useState<string>("");
  const [friendRequestResMsgErr, setFriendRequestResMsgErr] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displaySubmitSpinner, setDisplaySubmitSpinner] =
    useState<boolean>(false);

  useEffect(() => {
    const getFriendRequestData = async () => {
      try {
        const friendRequests = await axiosPrivate.get(
          "/users/get-friend-requests",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setFriendRequests(friendRequests.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getFriendData = async () => {
      try {
        const friendData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setFriendData(friendData.data.friends);
      } catch (err) {
        console.log(err);
      }
    };

    try {
      getFriendRequestData();
      getFriendData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFriendRequestResMsg("");
    setDisplaySubmitSpinner(true);
    try {
      const friendRequestResponse = await axiosPrivate.post(
        "/users/send-friend-request",
        { receiverUsername: username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setFriendRequestResMsg(friendRequestResponse.data.msg);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setFriendRequestResMsgErr(err.response!.data.msg);
      } else {
        setFriendRequestResMsgErr("Error");
      }
    } finally {
      setDisplaySubmitSpinner(false);
    }
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
        profilePicture: responseData.senderProfilePicture,
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

  const handleOpenPopup = () => {
    setShowPopup(true);
    setIsBackgroundDisabled(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setUsername("");
    setFriendRequestResMsg("");
    setFriendRequestResMsgErr("");
    setIsBackgroundDisabled(false);
  };

  const handleUsernameChange = (target: EventTarget & HTMLInputElement) => {
    setUsername(target.value);
    setFriendRequestResMsgErr("");
    setFriendRequestResMsg("");
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const removeFriend = await axiosPrivate.post(
        "/users/remove-friend",
        { friendId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update friend state
      const updatedFriends = friendData?.filter(
        (friend) => friend.id !== friendId
      );
      console.log("Updated data: ", updatedFriends);

      setFriendData(updatedFriends);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={showPopup ? "add-friend-popup" : "add-friend-popup-hide"}>
        <img src={IMAGES.closeWindow} onClick={handleClosePopup}></img>
        <div className="popup-content">
          <h1>Add Friend</h1>
          <form onSubmit={handleSubmit}>
            {/* <label htmlFor="search">Search friends by username</label> */}
            <input
              type="text"
              placeholder="Search friends by username"
              name="search"
              value={username}
              onChange={({ target }) => handleUsernameChange(target)}
            ></input>
            <button
              type="submit"
              className={`${displaySubmitSpinner ? "cursor-loading" : ""}`}
            >
              Go
            </button>
          </form>
          {friendRequestResMsgErr ? (
            <div className="error-msg">{friendRequestResMsgErr}</div>
          ) : (
            <></>
          )}
          {friendRequestResMsg ? (
            <div className="success-msg">{friendRequestResMsg}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="friends-page">
        <div className="friends-card-wrapper">
          <div className="friends-card">
            <div className="friends-card-inner-upper">
              <div className="your-friends-title">
                Your Friends ({friendData && friendData.length})
              </div>
              <div className="add-friend-button" onClick={handleOpenPopup}>
                <img
                  src={IMAGES.addFriendsIcon}
                  className="add-friend-icon"
                ></img>
                <span>Add a friend</span>
              </div>
            </div>
            <div className="friends-card-inner-lower">
              <div className="friends-card-data">
                {isLoading && <Loading isFullPage={false} />}
                {friendData &&
                  friendData.map((user: any) => (
                    <div key={user.id} className="friend">
                      <div className="friend-left">
                        <img
                          src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${user.profilePicture}.png`}
                          alt="avatar"
                          className="friend-avatar"
                        ></img>

                        <div>{user.username}</div>
                      </div>
                      <div className="friend-right">
                        <button onClick={() => handleRemoveFriend(user.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="friend-request-card-wrapper">
          <div className="friends-card-inner-upper">Friend Requests</div>
          <div className="friends-card-inner-lower">
            <div className="friend-request-card-data">
              {isLoading && <Loading isFullPage={false} />}
              {friendRequests &&
                friendRequests.map((request: any) => (
                  <div key={request.id}>
                    <>
                      <h2>{request.senderUsername}</h2>
                      <div className="friend-request-buttons">
                        <button
                          className="accept"
                          onClick={() =>
                            handleAccept(request.id, request.senderUsername)
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="reject"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </div>

                      <div className="request-divider"></div>
                    </>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
