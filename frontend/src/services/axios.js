import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})



export const login = async(formData) => {
    try {
        const response = await axiosInstance.post(
            "/auth/login",
            formData,
            {
                headers:{
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

