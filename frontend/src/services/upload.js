import axios from "axios";

const API = "http://localhost:4000/api/upload";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token"); // must exist

  const res = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default uploadToCloudinary;
