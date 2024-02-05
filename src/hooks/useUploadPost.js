import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const useUploadPost = () => {
    const [file, setFile] = useState();
    const [downloadUrl, setDownloadUrl] = useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadPostImage = () => {
        setIsUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadPercentage(Math.round(progress));
                switch (snapshot.state) {
                    case "canceled":
                        setIsUploading(false);
                        console.log("Upload is canceled.");
                        break;
                    case "error":
                        setIsUploading(false);
                        console.log("There is an error uploading the image.");
                        break;
                    case "paused":
                        console.log("Upload is paused.");
                        break;
                    case "running":
                        console.log("Upload is running.");
                        break;
                    case "success":
                        console.log("Upload successfull.");
                        break;
                }
            },
            (error) => {
                setIsUploading(false);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setDownloadUrl(downloadURL);
                    setIsUploading(false);
                });
            }
        );
    }

    return { setFile, downloadUrl, uploadPercentage, isUploading, uploadPostImage, setUploadPercentage };
}

export default useUploadPost;