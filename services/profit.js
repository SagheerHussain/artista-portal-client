import axios from "axios";

export const getProfit = async (token) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/profit`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching profit:", error);
        return null;
    }
}
        