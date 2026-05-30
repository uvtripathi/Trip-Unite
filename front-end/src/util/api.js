const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "" 
  : "http://localhost:8000";

export const getApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default API_BASE_URL;
