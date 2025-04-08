import axios from "axios";

export const createExpanceCategory = async (data, token) => {
  console.log(data, token);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/expance-category`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense category:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to create expense category",
    };
  }
};

export const getExpanceCategories = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/expance-category`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch expense categories",
    };
  }
};

export const updateExpanceCategory = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/expance-category/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense category:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update expense category",
    };
  }
};

export const deleteExpanceCategory = async (id, token) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/expance-category/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting expense category:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete expense category",
    };
  }
};


export const getExpenses = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/expences`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch expenses",
    };
  }
}

export const getExpenseById = async (id, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/expences/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching expense by ID:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch expense by ID",
    };
  }
};

export const getFilteredExpense = async (month, year, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/expences/search-expense`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month,
          year
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search expenses:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch search expenses",
    };
  }
}

export const createExpense = async (data, token) => {
  try {
    console.log("data inside ===>", data)
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/expences`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create expense",
    };
  }
};

export const updateExpense = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/expences/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update expense",
    };
  }
};

export const deleteExpense = async (id, token) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/expences/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete expense",
    };
  }
};