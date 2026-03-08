const LOCAL_URL = "http://localhost:3000";
const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

export const API_BASE_URL =
  window.location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;
