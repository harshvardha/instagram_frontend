import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Post.css";
import {
    FavoriteBorderOutlined,
    BookmarkBorderOutlined,
    ShareOutlined,
    MapsUgcOutlined,
    Favorite,
    Bookmark
} from "@mui/icons-material";
import PostDetails from "../PostDetails/PostDetails";
import { postsApiRequests } from "../../apiRequests";

const Post = ({ post, accountOwnerId = "", setTimelinePosts }) => {
    const [isLikedPost, setIsLikedPost] = useState(false);
    const [noOfLikes, setNoOfLikes] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [openPostDetails, setOpenPostDetails] = useState(false);

    const likeOrDislikePost = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await postsApiRequests.likeOrDislikePost(post._id, accessToken);
            if (response.status === 200) {
                setNoOfLikes(prev => isLikedPost ? prev - 1 : prev + 1);
                setIsLikedPost(prev => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const bookmarkPost = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await postsApiRequests.putBookmarkPost(accessToken, post._id);
            if (response.status === 200) {
                setIsBookmarked(prev => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const isPostBookmarked = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await postsApiRequests.getIsPostBookmarked(accessToken, post?._id);
                if (response.status === 200) {
                    setIsBookmarked(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        isPostBookmarked();
        setNoOfLikes(post?.likes.length);
        const ownerId = localStorage.getItem("accountOwnerId");
        if (post?.likes.includes(ownerId)) {
            setIsLikedPost(true);
        }
    }, [])

    return (
        <>
            <div className="post">
                <div className="post--header">
                    <div className="header--info">
                        <img id="post_logo" src={post?.user.profilePictureUrl} alt="" />
                        <p><Link to={`/profile/${post?.user.username}`} style={{ textDecoration: "none", color: "black", fontWeight: "500" }}>{post?.user.username}</Link><span id="dot" /><span>1h</span></p>
                    </div>
                </div>
                <div className="post--image">
                    <img id="post_image" src={post?.url} alt="" />
                </div>
                <div className="post--actions">
                    <div className="like--comment--share">
                        {isLikedPost ?
                            <Favorite style={{ cursor: "pointer", color: "red" }} onClick={likeOrDislikePost} /> :
                            <FavoriteBorderOutlined style={{ cursor: "pointer" }} onClick={likeOrDislikePost} />}
                        <MapsUgcOutlined style={{ cursor: "pointer" }} onClick={() => setOpenPostDetails(true)} />
                        <ShareOutlined style={{ cursor: "pointer" }} />
                    </div>
                    {!isBookmarked ?
                        <BookmarkBorderOutlined style={{ cursor: "pointer" }} onClick={bookmarkPost} /> :
                        <Bookmark style={{ cursor: "pointer" }} onClick={bookmarkPost} />}
                </div>
                <div className="post--information">
                    <p id="post_likes">{noOfLikes} likes</p>
                    <p id="post_caption"> <Link to={`/profile/${post?.user.username}`} style={{ textDecoration: "none", color: "black" }}><span style={{ fontWeight: "bold" }}>{post?.user.username} </span></Link>{post?.caption}</p>
                </div>
                <div className="post--comments">
                    <p style={{ cursor: "pointer" }} onClick={() => setOpenPostDetails(true)}>View all {post?.comments.length} comments</p>
                </div>
            </div>
            {openPostDetails &&
                (accountOwnerId ?
                    <PostDetails setOpenPostDetails={setOpenPostDetails} postId={post?._id} accountOwnerId={accountOwnerId} setTimelinePosts={setTimelinePosts} /> :
                    <PostDetails setOpenPostDetails={setOpenPostDetails} postId={post?._id} />)
            }
        </>
    )
}

export default Post;