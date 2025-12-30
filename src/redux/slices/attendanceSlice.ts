import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { API_ROUTES } from '../../constants/routes';

export interface AttendanceRecord {
	date: string;
	status: 'present' | 'absent' | 'late' | string;
	in_time?: string;
	out_time?: string;
}

interface AttendanceState {
	isLoading: boolean;
	error: string | null;
	items: AttendanceRecord[];
	lastUId?: string;
	teachers?: any[];
	students?: any[];
	raw?: any;
	selectedUser?: { role: 'teacher' | 'student'; u_id: string } | null;
	calendarItems?: AttendanceRecord[];
}

const initialState: AttendanceState = {
	isLoading: false,
	error: null,
	items: [],
	selectedUser: null,
	calendarItems: [],
};

export const fetchAttendanceByUId = createAsyncThunk(
	'attendance/fetchByUId',
	async (u_id: string, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(API_ROUTES.admin.attendanceUsersApi, { params: { u_id } });
			return response.data;
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to fetch attendance';
			return rejectWithValue(message);
		}
	}
);

export const fetchAttendanceList = createAsyncThunk(
	'attendance/fetchAttendanceList',
	async ({ role, u_id }: { role: 'teacher' | 'student'; u_id: string }, { rejectWithValue }) => {
		try {
			const params: any = { u_id };
			if (role) params.role = role;
			const resp = await axiosInstance.get(API_ROUTES.admin.attendanceListApi, { params });
			return { role, u_id, data: resp.data };
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to fetch attendance list';
			return rejectWithValue(message);
		}
	}
);

export const updateAttendance = createAsyncThunk(
	'attendance/updateAttendance',
	async ({ u_id, attendance_status, date }: { u_id: string; attendance_status: string; date: string }, { rejectWithValue }) => {
		try {
			console.log('Updating attendance with endpoint: /api/admin/attendance/update');
			const response = await axiosInstance.post(API_ROUTES.admin.attendanceUpdateApi, {
				u_id,
				attendance_status,
				date
			});
			console.log('Attendance updated successfully:', response.data);
			return { u_id, attendance_status, date, data: response.data };
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to update attendance';
			console.error('Attendance update failed:', message);
			return rejectWithValue(message);
		}
	}
);

export const attendanceSlice = createSlice({
	name: 'attendance',
	initialState,
	reducers: {
		clearAttendance: (state) => {
			state.items = [];
			state.error = null;
			state.isLoading = false;
			state.teachers = [];
			state.students = [];
			state.raw = undefined;
			state.selectedUser = null;
			state.calendarItems = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAttendanceByUId.pending, (state, action) => {
				state.isLoading = true;
				state.error = null;
				state.lastUId = action.meta.arg;
			})
			.addCase(fetchAttendanceByUId.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				const raw = action.payload as any;
				state.raw = raw;
				const teachersPaginated = raw?.teachers || raw?.data?.teachers || raw?.teacher;
				const studentsPaginated = raw?.students || raw?.data?.students || raw?.student;
				const teachersData = Array.isArray(teachersPaginated?.data) ? teachersPaginated.data : (Array.isArray(teachersPaginated) ? teachersPaginated : []);
				const studentsData = Array.isArray(studentsPaginated?.data) ? studentsPaginated.data : (Array.isArray(studentsPaginated) ? studentsPaginated : []);
				state.teachers = teachersData;
				state.students = studentsData;
				const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
				state.items = list.map((r: any) => ({
					date: r.date || r.attendance_date || r.created_at || '',
					status: r.status || r.attendance_status || r.type || '',
					in_time: r.in_time || r.in || r.check_in || undefined,
					out_time: r.out_time || r.out || r.check_out || undefined,
				}));
			})
			.addCase(fetchAttendanceByUId.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) || 'Failed to fetch attendance';
			})
			.addCase(fetchAttendanceList.pending, (state, action) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAttendanceList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				const { role, u_id, data } = action.payload as any;
				state.selectedUser = { role, u_id };
				const raw = data;
				// Accept either array or object map of date -> status
				let list: any[] = [];
				if (Array.isArray(raw?.attendance)) {
					list = raw.attendance;
				} else if (raw?.attendance && typeof raw.attendance === 'object') {
					list = Object.entries(raw.attendance).map(([date, status]) => ({ date, status }));
				} else if (Array.isArray(raw?.data)) {
					list = raw.data;
				}
				state.calendarItems = list.map((r: any) => ({
					date: r.date || r.attendance_date || r.created_at || r.day || '',
					status: r.status || r.attendance_status || r.type || r.value || '',
					in_time: r.in_time || r.in || r.check_in || undefined,
					out_time: r.out_time || r.out || r.check_out || undefined,
				}));
			})
			.addCase(fetchAttendanceList.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) || 'Failed to fetch attendance list';
			})
			.addCase(updateAttendance.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateAttendance.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				const { u_id, attendance_status, date } = action.payload;
				
				// Update the calendar items with the new attendance status
				if (state.calendarItems) {
					const existingIndex = state.calendarItems.findIndex(item => item.date === date);
					if (existingIndex !== -1) {
						state.calendarItems[existingIndex].status = attendance_status;
					} else {
						state.calendarItems.push({
							date,
							status: attendance_status
						});
					}
				}
			})
			.addCase(updateAttendance.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) || 'Failed to update attendance';
			});
	},
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
