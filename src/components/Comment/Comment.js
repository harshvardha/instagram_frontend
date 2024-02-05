import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Comment.css";
import { Favorite, FavoriteBorderOutlined, DeleteForeverOutlined } from "@mui/icons-material";
import { timeAgo } from "../../utils/timeAgo";
import { commentsApiRequests } from "../../apiRequests";

const Comment = ({ comment, post, accountOwnerId, setPost }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [noOfLikes, setNoOfLikes] = useState(0);

    const likeOrDislikeComment = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await commentsApiRequests.likeOrDislikeComment(comment?._id, accessToken);
            if (response.status === 200) {
                setNoOfLikes(prev => isLiked ? prev - 1 : prev + 1);
                setIsLiked(prev => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteComment = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accountOwnerId) {
                const deleteDetails = {
                    commentId: comment._id,
                    postId: post._id
                };
                const response = await commentsApiRequests.deleteComment(deleteDetails, accessToken);
                if (response.status === 200) {
                    const newCommentsArray = post.comments.filter(cmnt => {
                        if (cmnt._id !== comment._id) {
                            return cmnt;
                        }
                    });
                    setPost({ ...post, comments: newCommentsArray });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setNoOfLikes(comment?.likes.length);
        const ownerId = localStorage.getItem("accountOwnerId");
        if (comment?.likes.includes(ownerId)) {
            setIsLiked(true);
        }
    }, [])

    return (
        <div className="comment">
            <div className="comment--user">
                <img id="comment_user_logo" src={comment?.user.profilePictureUrl} alt="" />
                <div className="comment--details">
                    <p style={{ wordBreak: "break-all" }} >
                        <Link
                            to={`/profile/${comment?.user.username}`}
                            style={{ textDecoration: "none", color: "white", wordBreak: "keep-all", fontWeight: "bold" }}
                        >{comment?.user.username}
                        </Link> {comment?.description}</p>
                    <div className="information">
                        <p>{timeAgo(comment?.createdAt)}</p>
                        <p>{noOfLikes} likes</p>
                    </div>
                </div>
            </div>
            <div className="comment--actions">
                {accountOwnerId && <DeleteForeverOutlined onClick={deleteComment} />}
                {isLiked ?
                    <Favorite
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={likeOrDislikeComment}
                    /> :
                    <FavoriteBorderOutlined
                        style={{ cursor: "pointer" }}
                        onClick={likeOrDislikeComment}
                    />
                }
            </div>
        </div>
    )
}

export default Comment;