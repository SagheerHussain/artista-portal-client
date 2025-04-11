import axios from "axios";

export const getAnnouncements = async (token) => {  
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/announcements`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { success: false, message: error.message };
  }
};

export const getActiveAnnouncements = async (token) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/announcements/active/announcement`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return { success: false, message: error.message };
  }
};

export const getAnnouncementById = async (token, id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/announcements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching announcement by ID:", error);
    return { success: false, message: error.message };
  }
};

export const createAnnouncement = async (token, data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/announcements`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, message: error.message };
  }
};

export const updateAnnouncement = async (token, id, data) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/announcements/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, message: error.message };
  }
};

export const deleteAnnouncement = async (token, id) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/announcements/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, message: error.message };
  }
};