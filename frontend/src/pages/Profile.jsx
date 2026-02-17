import React, { useState, useEffect } from "react";
import { updateProfile } from "../services/api.js"; // your api.js

export const Profile=()=> {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load name from localStorage when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setName(storedUser.name);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
         const formData = new FormData();

  if (name) formData.append("name", name);
  if (avatar) formData.append("avatar", avatar);

      const updatedUser = await updateProfile(formData);

      // Update localStorage after successful update
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name Input */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block mb-1">Avatar</label>
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
}

export default Profile;
