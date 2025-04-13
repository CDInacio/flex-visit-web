import axios from 'axios'

// const refreshAccessToken = async () => {
//   const response = await axios.post("/users/refresh-token", {}, { withCredentials: true });
//   return response.data.accessToken;
// };

// baseURL: 'http://localhost:3001',
export const api = axios.create({
  baseURL: 'http://localhost:3002',
})

export const privateRequest = axios.create({
  baseURL: 'http://localhost:3002',
})
// baseURL: 'https://flexvisit-api-1.onrender.com',

privateRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// privateRequest.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newToken = await refreshAccessToken();
//         localStorage.setItem("accessToken", newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Erro ao renovar o token:", err);
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );
