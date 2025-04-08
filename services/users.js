import axios from "axios";

// Get Employees
export const getEmployees = async (token) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// Get Employee by ID
export const getEmployeeById = async (id, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
  }
};

export const updateEmployee = async (id, data, token) => {
  try {
    console.log(data)
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/users/update/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// Delete Employee
export const deleteEmployee = async (id, token) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/users/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};
