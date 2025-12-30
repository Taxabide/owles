import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { studentApi } from '../../api/studentApi';
import { API_BASE_URL, APP_ROUTES } from '../../constants/routes';
import { clearUser } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';

const StudentSideBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<{ name?: string; email?: string; profileImageUri?: string } | null>({
    name: authUser?.name,
    email: authUser?.email,
    profileImageUri: authUser?.profileImage,
  });

  const formatImageUri = (uri?: string | null) => {
    if (!uri) return '';
    if (uri.startsWith('http') || uri.startsWith('file://') || uri.startsWith('data:')) return uri;
    if (uri.startsWith('/')) return `${API_BASE_URL}${uri}`;
    return `${API_BASE_URL}/${uri}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        // Use exact u_id endpoint to populate sidebar
        const data = await studentApi.getOwnProfileByUId(String(userId));
        setStudentData((prev) => ({
          name: data.u_name || data.name || prev?.name,
          email: data.u_email || data.email || prev?.email,
          profileImageUri: formatImageUri(
            data.u_profile_photo || data.profile_photo || prev?.profileImageUri || authUser?.profileImage || ''
          ),
        }));
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, authUser?.profileImage]);

  useEffect(() => {
    if (!authUser?.profileImage) return;
    setStudentData((prev) => ({
      ...prev,
      profileImageUri: formatImageUri(authUser.profileImage),
    }));
  }, [authUser?.profileImage]);

  const handleDashboardPress = () => {
    router.push(APP_ROUTES.STUDENT_DASHBOARD); // Assuming a student dashboard route
  };

  const handleStudentAttendancePress = () => {
    router.push(APP_ROUTES.STUDENT_ATTENDANCE as any);
  };

  const handleAttendanceListPress = () => {
    router.push('/student/attendance/list' as any);
  };

  const handleProfilePress = () => {
    router.push(APP_ROUTES.STUDENT_PROFILE as any);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace('/');
  };

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.profileSection}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.STUDENT_PROFILE)}>
            {studentData?.profileImageUri ? (
              <Image source={{ uri: studentData.profileImageUri }} style={styles.profileImage} />
            ) : (
              <Image source={require("../../../assets/images/owles-logo1.webp")} style={styles.profileImage} />
            )}
            <Text style={styles.brandName}>O.W.L.E.S</Text>
            <Text style={styles.studentRole}>{studentData?.name || 'Student'}</Text>
            <Text style={styles.studentEmail}>{studentData?.email || ''}</Text>
            {error ? <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text> : null}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleDashboardPress}>
          <Ionicons name="home-outline" size={24} color="#495057" />
          <Text style={styles.menuItemText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleStudentAttendancePress}>
          <Ionicons name="person-circle-outline" size={24} color="#495057" />
          <Text style={styles.menuItemText}>Student Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleAttendanceListPress}>
          <Ionicons name="person-circle-outline" size={24} color="#495057" />
          <Text style={styles.menuItemText}>Attendance List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={24} color="#495057" />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          <Text style={[styles.menuItemText, { color: '#DC2626', fontWeight: '700' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 250,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    height: '100%',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  studentRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    color: '#6C757D',
  },
  menuSection: {
    // Styles for menu items container
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutItem: {
    backgroundColor: '#FEF2F2',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#495057',
  },
});

export default StudentSideBar;
