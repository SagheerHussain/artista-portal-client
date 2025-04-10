import axios from "axios";

export const getTaxes = async (token) => {
    try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/tax`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching taxes:", error);
    }
};

export const getTaxById = async (token, id) => {
    try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/tax/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tax by id:", error);
    }
};

export const createTax = async (token, data) => {
    try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/tax`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating tax:", error);
    }
};

export const updateTax = async (token, id, data) => {
    try {
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/tax/update/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating tax:", error);
    }
};

export const deleteTax = async (token, id) => {
    try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/tax/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting tax:", error);
    }
};

