import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    GridOnOutlined,
    BookmarkBorderOutlined,
    AssignmentIndOutlined,
    CameraAltOutlined
} from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import { postsApiRequests, userApiRequests } from "../../apiRequests";
import Sidebar from "../../components/Sidebar/Sidebar";
import CreatePost from "../../components/CreatePost/CreatePost";
import PostDetails from "../../components/PostDetails/PostDetails";
import blankProfilePic from "../../images/blank-profile-picture.png";
import "./Profile.css";

const Profile = () => {
    const [createPost, setCreatePost] = useState(false);
    const [openPostDetails, setOpenPostDetails] = useState(false);
    const [followingUser, setFollowingUser] = useState(false);
    const [postId, setPostId] = useState();
    const [userInfo, setUserInfo] = useState(null);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [showPosts, setShowPosts] = useState(true);
    const { userId, userPosts, setUserPosts } = useContext(UserContext);
    const params = useParams();
    const navigateTo = useNavigate();
    const accountOwnerId = localStorage.getItem("accountOwnerId");

    const followAndUnfollowUser = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            let response;
            if (followingUser) {
                response = await userApiRequests.unfollowUser(userId, accessToken);
                if (response.status === 200) {
                    setFollowingUser(false);
                }
            } else {
                response = await userApiRequests.followUser(userId, accessToken);
                if (response.status === 200) {
                    setFollowingUser(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getBookmarkedPosts = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await postsApiRequests.getBookmarkedPosts(accessToken);
            if (response.status === 200) {
                setBookmarkedPosts(response.data);
                setShowPosts(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getUserByUsername = async () => {
            try {
                const username = params.username;
                const response = await userApiRequests.getUserByUsername(username);
                if (response.status === 200) {
                    setUserInfo(response.data.user);
                    setUserPosts(response.data.posts);
                    const findUser = response.data.user.followers.find(user => user._id === accountOwnerId);
                    if (findUser) {
                        setFollowingUser(true);
                    }
                } else {
                    return window.alert("something went wrong.");
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (!localStorage.getItem("accessToken") || !localStorage.getItem("accountOwnerId")) {
            navigateTo("/");
        } else {
            getUserByUsername();
        }
    }, [params.username]);

    return (
        <>
            <div className="profile">
                <Sidebar />
                <div className="profile--page">
                    <div className="profile--page--about">
                        <img src={userInfo?.profilePictureUrl || blankProfilePic} className="about--profilePic" />
                        <div className="profile--page--about--details">
                            <div className="details--username">
                                <p>{userInfo?.username}</p>
                                {
                                    userInfo?._id === accountOwnerId ? (
                                        <div className="buttons">
                                            <Link to={"/editProfile"}><button type="button" id="editProfileButton">Edit Profile</button></Link>
                                            {userPosts?.length > 0 && <button id="create_post_button" type="button" onClick={() => setCreatePost(prev => !prev)}>Create Post</button>}
                                        </div>
                                    ) : (
                                        <div className="buttons">
                                            <button
                                                type="button"
                                                id="followUnfollowButton"
                                                onClick={followAndUnfollowUser}
                                            >{followingUser ? "UnFollow" : "Follow"}</button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="details--metrics">
                                <p>{userPosts?.length} posts</p>
                                <p>{userInfo?.followers.length} followers</p>
                                <p>{userInfo?.following.length} following</p>
                            </div>
                            <div className="details--bio">
                                <p>{userInfo?.name}</p>
                                <p>{userInfo?.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className="profile--media">
                        <div className="profile--media--tabs">
                            <p style={{ marginTop: "0.625rem", cursor: "pointer" }} onClick={() => setShowPosts(true)}><GridOnOutlined style={{ verticalAlign: "top" }} /> POSTS</p>
                            <p style={{ marginTop: "0.625rem", cursor: "pointer" }} onClick={getBookmarkedPosts}><BookmarkBorderOutlined style={{ verticalAlign: "top" }} /> SAVED</p>
                            <p style={{ marginTop: "0.625rem" }}><AssignmentIndOutlined style={{ verticalAlign: "top" }} /> TAGGED</p>
                        </div>
                        {
                            showPosts ? (
                                userPosts?.length > 0 ? (
                                    <div className="profile--media--content">
                                        {
                                            userPosts?.map(
                                                post => <img
                                                    src={post.url}
                                                    style={{ width: "21.3rem", cursor: "pointer" }}
                                                    onClick={() => {
                                                        setPostId(post._id);
                                                        setOpenPostDetails(true)
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className="profile--media--upload">
                                        <CameraAltOutlined />
                                        <h1>Share Photos</h1>
                                        <p>When you share photos, they will appear on your profile</p>
                                        <button
                                            type="button"
                                            className="custom--file--upload"
                                            onClick={() => setCreatePost(prev => !prev)}
                                        >Share your first photo</button>
                                    </div>
                                )
                            ) : (
                                bookmarkedPosts?.length > 0 ? (
                                    <div className="profile--media--content">
                                        {
                                            bookmarkedPosts?.map(
                                                post => <img
                                                    src={post.url}
                                                    style={{ width: "21.3rem", cursor: "pointer" }}
                                                    onClick={() => {
                                                        setPostId(post._id);
                                                        setOpenPostDetails(true)
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className="profile--noSavedPost">
                                        <h2>No Saved Posts</h2>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
            {createPost && <CreatePost setCreatePost={setCreatePost} />}
            {openPostDetails &&
                (userInfo?._id === accountOwnerId ?
                    <PostDetails setOpenPostDetails={setOpenPostDetails} postId={postId} accountOwnerId={accountOwnerId} setBookmarkedPosts={setBookmarkedPosts} /> :
                    <PostDetails setOpenPostDetails={setOpenPostDetails} postId={postId} />
                )
            }
        </>
    )
}

export default Profile;

// (showPosts ?
//     <PostDetails setOpenPostDetails={setOpenPostDetails} postId={postId} accountOwnerId={accountOwnerId} />:
//     <PostDetails setOpenPostDetails={setOpenPostDetails} postId={postId} />
// ):
// <PostDetails setOpenPostDetails={setOpenPostDetails} postId={postId} />