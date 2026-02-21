import { useState } from "react";
import uploadToCloudinary from "../services/upload.js";

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadMedia = async (file) => {
    setUploading(true);
    const res = await uploadToCloudinary(file);
    setUploading(false);
    return res;
  };

  return { uploadMedia, uploading };
};
