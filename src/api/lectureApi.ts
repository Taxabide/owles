import { Platform } from 'react-native';
import { API_BASE_URL, API_ROUTES } from '../constants/routes';
import axiosInstance from './axiosInstance';

export interface AddLecturePayload {
  course_id: number;
  link: string;
  status: 'active' | 'inactive';
  description: string;
}

export const lectureApi = {
  addLecture: async (payload: AddLecturePayload) => {
    const absoluteOverride = process.env.EXPO_PUBLIC_LECTURE_API_URL as string | undefined;
    const hostOverride = process.env.EXPO_PUBLIC_LOCAL_API_HOST as string | undefined;

    let url = '';
    if (absoluteOverride && /^(http|https):\/\//.test(absoluteOverride)) {
      url = absoluteOverride;
    } else if (hostOverride && /^(http|https):\/\//.test(hostOverride)) {
      url = `${hostOverride.replace(/\/$/, '')}/api/admin/add-lecture-api`;
    } else {
      const localHost = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
      const base = API_BASE_URL?.startsWith('http') ? API_BASE_URL : localHost;
      url = `${base.replace(/\/$/, '')}/api/admin/add-lecture-api`;
    }
    const res = await axiosInstance.post(url, payload);
    return res.data;
  },
  getLecturesByCourse: async (courseId: string | number) => {
    // Backend expects key 'id' per spec
    const handle = async (url: string) => {
      try {
        const response = await axiosInstance.get(url);
        const data = response.data as any;
        if (data && data.success === false && /not\s*found/i.test(data.message || '')) {
          return { html: [] };
        }
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) {
          return { html: [] };
        }
        throw err;
      }
    };

    const primary = await handle(`${API_ROUTES.admin.lecturesListApi}?id=${courseId}`);
    // If primary worked (including empty), return it; otherwise try fallback
    if (primary) return primary;
    return handle(`/api/admin/view-lecture-api?id=${courseId}`);
  },
};


