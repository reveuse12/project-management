import axios from "axios";

export const getOgranizations = async () => {
  const res = await axios.get("/api/organization");
  return res.data.organizations;
};
