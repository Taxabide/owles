import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { studentApi } from '../../api/studentApi';
import { RootState } from '../../redux/store';
import { globalStyles } from '../../styles/globalStyles';

const StudentDashboard: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const userId = authUser?.id;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getProfileByUserId(userId);
        setProfile(data);
      } catch (e: any) {
        const status = e?.response?.status;
        // Fallback: if backend fails (e.g., 500 table missing), use auth user info
        if (status === 500 && authUser) {
          setProfile({
            u_id: authUser.id,
            u_email: authUser.email,
            u_name: authUser.name,
            u_role: authUser.role,
          });
          setError(null);
        } else {
          setError(e?.response?.data?.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (!userId) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>No user logged in.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={[globalStyles.text, { color: 'red' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Student Profile</Text>
      {profile && (
        <View style={styles.card}>
          {profile?.profile_photo ? (
            <Image source={{ uri: profile.profile_photo }} style={styles.avatar} />
          ) : null}
          <View style={styles.row}><Text style={styles.label}>Name: </Text><Text style={styles.value}>{profile.u_name || profile.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email: </Text><Text style={styles.value}>{profile.u_email || profile.email}</Text></View>
          <View style={styles.row}><Text style={styles.label}>User ID: </Text><Text style={styles.value}>{profile.u_id || userId}</Text></View>
          {profile.u_role || profile.role ? (
            <View style={styles.row}><Text style={styles.label}>Role: </Text><Text style={styles.value}>{profile.u_role || profile.role}</Text></View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
  },
  value: {
    flex: 1,
  },
});
