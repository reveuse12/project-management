import axios from "axios";

export const getUser = async () => {
  const res = await axios.get("/api/users");
  return res.data.users;
};

export const getUserProfile = async () => {
  const res = await axios.get("/api/user");
  return res.data.user;
};
