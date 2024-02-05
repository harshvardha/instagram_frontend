import { useState } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import app from "../firebase";

export const useDeleteImage = () => {
    const [url, setUrl] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteImageFile = () => {
        setIsDeleting(true)
        const storage = getStorage(app);
        const fileRef = ref(storage, url)
        deleteObject(fileRef).then(() => {
            setIsDeleting(false);
        }).catch(error => {
            console.log(error);
        });
    }

    return { setUrl, isDeleting, url, deleteImageFile };
}