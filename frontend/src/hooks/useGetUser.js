import { useEffect, useState } from "react";
import { getUserById } from "../services/api";

export const useGetUser = () => {
  const [localUser, setLocalUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      const parsed = JSON.parse(stored);
      setLocalUser(parsed);

      fetchApiUser(parsed._id || parsed.id);
    } catch (err) {
      setError(err);
    }
  }, []);

  const fetchApiUser = async (userId) => {
    try {
      const res = await getUserById(userId);
      setApiUser(res.data ?? res); // handles axios or fetch
    } catch (err) {
      setError(err);
    }
  };

  return { localUser, apiUser, error };
};

export default useGetUser;
