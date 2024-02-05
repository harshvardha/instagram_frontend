import { useContext, useEffect, useState } from "react";
import usePreviewImage from "../../hooks/usePreviewImage";
import useUploadPost from "../../hooks/useUploadPost";
import { postsApiRequests } from "../../apiRequests";
import {
    PanoramaOutlined,
    ArrowBack,
    Clear
} from "@mui/icons-material"
import logo from "../../images/profile_pic.jpg";
import "./CreatePost.css";
import { UserContext } from "../../context/UserContext";

const CreatePost = ({ setCreatePost }) => {
    const [caption, setCaption] = useState("");
    const { setUserPosts } = useContext(UserContext);
    const { handleImageChange, imageFile, setImageFile } = usePreviewImage();
    const { setFile, downloadUrl, uploadPercentage, isUploading, uploadPostImage, setUploadPercentage } = useUploadPost();

    useEffect(() => {
        const uploadPost = async () => {
            try {
                const postDetails = {
                    url: downloadUrl,
                    caption: caption
                }
                const accessToken = localStorage.getItem("accessToken");
                const response = await postsApiRequests.createPost(postDetails, accessToken);
                if (response.status === 201) {
                    const data = response.data;
                    setUserPosts(prevPosts => [...prevPosts, data.newPost]);
                    setCreatePost(false);
                }
            } catch (error) {
                setUploadPercentage(0);
                console.log(error);
            }
        }
        if (isUploading === false && uploadPercentage === 100) {
            uploadPost();
            setUploadPercentage(0);
        }
    }, [isUploading])

    return (
        <div className="createPost">
            <Clear
                style={{ position: "absolute", color: "white", top: "10", right: "10" }}
                onClick={() => setCreatePost(false)}
            />
            <div className="createPost--form">
                {!imageFile ? (
                    <div className="createPost--selectImage">
                        <h3>Create new post</h3>
                        <hr style={{ width: "100%", border: "1px solid #454444" }} />
                        <div className="selectImage">
                            <PanoramaOutlined style={{ width: "8rem", height: "8rem" }} />
                            <label id="select--file--from--computer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        setFile(event.target.files[0]);
                                        handleImageChange(event);
                                    }}
                                />
                                Select file from computer
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="createPost--newPost">
                        <ArrowBack
                            style={{ color: "black", position: "absolute", top: "10", left: "10" }}
                            onClick={() => {
                                setFile(null);
                                setImageFile("")
                            }}
                        />
                        <img id="newPost_image" src={imageFile} alt="" />
                        <div className="newPost--caption">
                            <div className="caption--header">
                                <img id="post_logo" src={logo} alt="" />
                                <p>harshvardhan28_04</p>
                            </div>
                            <textarea
                                id="caption"
                                rows={10}
                                value={caption}
                                placeholder="Write a caption..."
                                onChange={(event) => setCaption(event.target.value)}
                            />
                            <button type="button" id="post_button" onClick={uploadPostImage}>Post</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatePost;