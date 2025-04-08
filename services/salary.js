import axios from "axios";

// Get Salaries
export const getSalaries = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/salaries`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching salaries:", error);
  }
};

// Get Salary By Id
export const getSalaryById = async (id, token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/salaries/salary/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching salary by id:", error);
  }
};

// Create Salary
export const createSalary = async (token, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/salaries`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating salary:", error);
  }
};

// Update Salary
export const updateSalary = async (token, id, data) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/salaries/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating salary:", error);
  }
};

// Delete Salary
export const deleteSalary = async (token, id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/salaries/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting salary:", error);
  }
};

// Filter Salaries
export const filterSalaries = async (token, month, year, status, employee) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/salaries/search-employee`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month,
          year,
          status,
          employeeId: employee,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered salaries:", error);
  }
};
