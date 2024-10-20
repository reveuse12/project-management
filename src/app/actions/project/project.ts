import axios from "axios";

export const getProjects = async () => {
  const res = await axios.get(`/api/project`);
  return res.data.projects;
};
