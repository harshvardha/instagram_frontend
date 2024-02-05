import Sidebar from "../../components/Sidebar/Sidebar";
import FollowingList from "../../components/FollowingList/FollowingList";
import Post from "../../components/Post/Post";
import "./Timeline.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApiRequests } from "../../apiRequests";

const Timeline = () => {
    const [timelinePosts, setTimelinePosts] = useState();
    const accountOwnerId = localStorage.getItem("accountOwnerId");
    const navigateTo = useNavigate();

    useEffect(() => {
        const getTimelinePosts = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await postsApiRequests.getTimeline(accessToken);
                if (response.status === 200) {
                    setTimelinePosts(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (!localStorage.getItem("accessToken") || !localStorage.getItem("accountOwnerId")) {
            navigateTo("/");
        } else {
            getTimelinePosts();
        }
    }, [])

    return (
        <div className="timeline">
            <Sidebar />
            <div className="timeline--feed">
                <div className="feed">
                    {timelinePosts?.map(post => (post?.user._id === accountOwnerId ?
                        <Post post={post} accountOwnerId={accountOwnerId} setTimelinePosts={setTimelinePosts} /> :
                        <Post post={post} />))}
                </div>
            </div>
        </div>
    )
}

export default Timeline;