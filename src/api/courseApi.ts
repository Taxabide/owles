import axiosInstance from './axiosInstance';

export interface AddCoursePayload {
  course_name: string;
  course_c_id: string | number;
  course_code: string;
  course_image?: string | null; 
  course_description: string;
}

export const courseApi = {
  addCourse: async (payload: AddCoursePayload): Promise<any> => {
    const { course_image, ...rest } = payload;

    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (course_image && typeof course_image === 'string') {
      const fileName = course_image.split('/').pop() || 'course.jpg';
      const ext = fileName.split('.').pop()?.toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
      const file: any = { uri: course_image, name: fileName, type: mime };
      formData.append('course_image', file);
    }

    const response = await axiosInstance.post('/api/admin/add-courses-api', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: undefined,
    });
    return response.data;
  },
};


