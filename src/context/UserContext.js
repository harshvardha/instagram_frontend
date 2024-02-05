import { useState } from "react";
import React from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
    const [username, setUsername] = useState("");
    const [userProfilePic, setUserProfilePic] = useState("");
    const [userId, setUserId] = useState();
    const [userPosts, setUserPosts] = useState(null);

    return (
        <UserContext.Provider
            value={{
                username,
                userId,
                userPosts,
                userProfilePic,
                setUsername,
                setUserId,
                setUserPosts,
                setUserProfilePic
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };