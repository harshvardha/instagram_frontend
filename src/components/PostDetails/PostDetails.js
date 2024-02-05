import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Clear,
    Favorite,
    FavoriteBorderOutlined,
    MapsUgcOutlined,
    ShareOutlined,
    Bookmark,
    BookmarkBorderOutlined,
    AddOutlined
} from "@mui/icons-material";
import "./PostDetails.css";
import { timeAgo } from "../../utils/timeAgo";
import Comment from "../Comment/Comment";
import { commentsApiRequests, postsApiRequests } from "../../apiRequests";
import { UserContext } from "../../context/UserContext";
import { useDeleteImage } from "../../hooks/useDeleteImage";

const PostDetails = ({ setOpenPostDetails, postId, accountOwnerId = "", setTimelinePosts, setBookmarkedPosts }) => {
    const { setUserPosts } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const { setUrl, isDeleting, url, deleteImageFile } = useDeleteImage();
    const [isLikedPost, setIsLikedPost] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [noOfLikes, setNoOfLikes] = useState(0);
    const [comment, setComment] = useState("")

    const deletePost = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await postsApiRequests.deletePost(postId, accessToken);
            if (response.status === 200) {
                if (setTimelinePosts) {
                    setTimelinePosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                } else if (setBookmarkedPosts) {
                    setBookmarkedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                    setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                } else {
                    setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const likeOrDislikePost = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await postsApiRequests.likeOrDislikePost(postId, accessToken);
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
            const response = await postsApiRequests.putBookmarkPost(accessToken, postId);
            if (response.status === 200) {
                setIsBookmarked(prev => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addComment = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const commentDetails = {
                description: comment
            };
            const response = await commentsApiRequests.addComment(commentDetails, postId, accessToken);
            if (response.status === 201) {
                setComment("");
                post.comments.unshift(response.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isDeleting === false && url !== "") {
            deletePost();
            setUrl("");
            setOpenPostDetails(false);
        }
    }, [isDeleting])

    useEffect(() => {
        const getPost = async () => {
            try {
                let response = await postsApiRequests.getPostById(postId);
                if (response.status === 200) {
                    setPost(response.data);
                    setNoOfLikes(response.data.likes.length);
                    const accountOwnerId = localStorage.getItem("accountOwnerId");
                    if (response.data.likes.includes(accountOwnerId)) {
                        setIsLikedPost(true);
                    }
                    if (response.data.user._id === accountOwnerId) {
                        setUrl(response.data.url);
                    }
                    const accessToken = localStorage.getItem("accessToken");
                    response = await postsApiRequests.getIsPostBookmarked(accessToken, response.data._id);
                    if (response.status === 200) {
                        setIsBookmarked(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        getPost();
    }, [postId]);

    return (
        <div className="overlay">
            <Clear
                style={{ position: "absolute", color: "white", top: "10", right: "10" }}
                onClick={() => setOpenPostDetails(prev => !prev)}
            />
            <div className="postDetails">
                <img id="postDetails--image" src={post?.url} alt="" />
                <div className="postDetails--details">
                    <div className="postDetails--header">
                        <div style={{ display: "flex", alignItems: "center", columnGap: "1rem" }}>
                            <img id="post_logo" src={post?.user.profilePictureUrl} alt="" />
                            <p><Link
                                to={`/profile/${post?.user.username}`}
                                style={{ textDecoration: "none", color: "white", fontWeight: "500" }}
                            >{post?.user.username}</Link></p>
                        </div>
                        {post?.user._id === accountOwnerId && <button
                            type="button"
                            id="delete_post_button"
                            onClick={deleteImageFile}
                        >Delete Post</button>}
                    </div>
                    <div className="postDetails--comments">
                        <div className="postDetails--caption">
                            <img id="post_logo" src={post?.user.profilePictureUrl} alt="" />
                            <div className="caption--about">
                                <p
                                    style={{ display: "flex", columnGap: "1rem" }}
                                ><Link
                                    to={`/profile/${post?.user.username}`}
                                    style={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
                                >{post?.user.username}</Link>{post?.caption}</p>
                                <p style={{ fontSize: "0.75rem" }}>{timeAgo(post?.createdAt)}</p>
                            </div>
                        </div>
                        {post?.comments.map(comment => <Comment
                            comment={comment}
                            post={post}
                            setPost={setPost}
                            accountOwnerId={comment?.user._id === localStorage.getItem("accountOwnerId") ? localStorage.getItem("accountOwnerId") : ""}
                        />)}
                    </div>
                    <div className="postDetails--actions">
                        <div className="like--bookmark">
                            <div className="like">
                                {isLikedPost ?
                                    <Favorite style={{ cursor: "pointer", color: "red" }} onClick={likeOrDislikePost} /> :
                                    <FavoriteBorderOutlined style={{ cursor: "pointer" }} onClick={likeOrDislikePost} />
                                }
                                <MapsUgcOutlined />
                                <ShareOutlined />
                            </div>
                            {isBookmarked ?
                                <Bookmark style={{ cursor: "pointer" }} onClick={bookmarkPost} /> :
                                <BookmarkBorderOutlined style={{ cursor: "pointer" }} onClick={bookmarkPost} />
                            }
                        </div>
                        <div>
                            <p>{noOfLikes} likes</p>
                            <p>{new Date(post?.createdAt).toDateString()}</p>
                        </div>
                    </div>
                    <div className="postComment">
                        <textarea
                            id="postDetail--comment"
                            rows="2"
                            value={comment}
                            placeholder="Add a comment..."
                            onChange={(event) => setComment(event.target.value)}
                        />
                        {comment && <AddOutlined
                            style={{ cursor: "pointer", color: "white", marginRight: "1rem" }}
                            onClick={addComment}
                        />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails;