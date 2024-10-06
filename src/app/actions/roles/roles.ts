import axios from "axios";

export const getRoles = async () => {
  const res = await axios.get("/api/role");
  return res.data;
};
