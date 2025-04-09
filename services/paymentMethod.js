import axios from "axios";

export const getPaymentMethods = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/payment-method`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

export const createPaymentMethod = async (paymentMethod, token) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/payment-method`,
      paymentMethod,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error;
  }
};

export const updatePaymentMethod = async (id, paymentMethod, token) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/payment-method/update/${id}`,
      paymentMethod,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
};

export const deletePaymentMethod = async (id, token) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/payment-method/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error;
  }
};
