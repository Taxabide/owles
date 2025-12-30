import { API_ROUTES } from "../constants/routes";
import axiosInstance from "./axiosInstance";

export const signUp = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.auth.register, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
