import axios from "axios";

export const getRevenue = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/revenue`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getTotalExpance = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/expences/expense/total-expance`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getTotalRecievedAmount = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/total-received-amount`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getPendingAmount = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/pending-amount`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getClients = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/unique-clients`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


export const getRecievedAmountByEmployee = async (id, token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/employee/total-received-amount/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("Employee Recieved Amount", response.data);
  return response.data;
};

export const getPendingAmountByEmployee = async (id, token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/employee/pending-amount/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("Employee Pending Amount", response.data);
  return response.data;
};

export const getClientsByEmployee = async (id, token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/employee/unique-clients/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("Employee Clients", response.data);
  return response.data;
};

export const getMonthlySalesData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/monthly-sales-data`,
  );
  return response.data;
};

export const getYearlySalesData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/sales/yearly-sales-data`,
  );
  return response.data;
};

export const getMonthlySalaryData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/salaries/monthly-salaries`,
  );
  return response.data;
};

export const getYearlySalaryData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/salaries/yearly-salaries`,
  );
  return response.data;
};

export const getMonthlyExpenseData = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/expences/monthly-expenses`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getYearlyExpenseData = async (token) => {
  const response = await axios.get( 
    `${import.meta.env.VITE_BASE_URL}/api/expences/yearly-expenses`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};