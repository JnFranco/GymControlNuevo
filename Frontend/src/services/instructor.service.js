import api from "./api";

export const getMisClases = (idInstructor) => {
  return api.get(`/clases/instructor/${idInstructor}`);
};
