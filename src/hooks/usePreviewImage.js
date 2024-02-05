import { useState } from "react";

const usePreviewImage = () => {
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return { handleImageChange, imageFile, setImageFile };
}

export default usePreviewImage;