import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // nếu cần
  withCredentials: true, // nếu có dùng cookie
  transformResponse: [
    (data) => {
      try {
        const parsed = JSON.parse(data, (key, value) => {
          if (typeof key === "string" && key.endsWith("At")) {
            return new Date(value);
          }
          return value;
        });
        return parsed;
      // } catch (err) {
      } catch {
        return data; // fallback nếu không phải JSON
        // throw err
      }
    },
  ],
});

export default axiosInstance;
