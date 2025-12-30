import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { studentApi } from '../../src/api/studentApi';
import { API_BASE_URL } from '../../src/constants/routes';
import { updateUser } from '../../src/redux/slices/authSlice';
import { fetchStudentAdminProfile, updateStudentAdminProfile } from '../../src/redux/slices/studentSlice';
import { RootState } from '../../src/redux/store';

const { width, height } = Dimensions.get('window');

export default function StudentProfileScreen() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const u_id = useMemo(() => (authUser?.id ?? '').toString(), [authUser?.id]);
  const rtkProfile = useSelector((state: RootState) => state.student.adminProfile);

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const successAnim = useState(new Animated.Value(0))[0];
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const modalOpacity = useState(new Animated.Value(0))[0];
  const modalScale = useState(new Animated.Value(0.9))[0];
  const shimmerAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const formatImageUri = (uri?: string | null) => {
    if (!uri) return '';
    if (uri.startsWith('file://') || uri.startsWith('data:')) return uri;
    if (uri.startsWith('http')) return uri;
    if (uri.startsWith('/')) return `${API_BASE_URL}${uri}`;
    return `${API_BASE_URL}/${uri}`;
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const fetchAndSetProfile = useCallback(async () => {
      if (!u_id) return;
      dispatch(fetchStudentAdminProfile(u_id) as any);
      setLoading(true);
      setError(null);
      try {
        const res = await studentApi.getOwnProfileByUId(u_id);
        const userObj = res?.user || res?.data?.user || {};
        const studentObj = res?.student || res?.data?.student || {};

        if (__DEV__) {
          try { console.log('StudentProfile keys user:', Object.keys(userObj || {}), 'student:', Object.keys(studentObj || {})); } catch {}
        }

        const normalized = {
          u_id: userObj.u_id ?? '',
          u_name: userObj.u_name ?? '',
          u_email: userObj.u_email ?? '',
          u_phone: userObj.u_phone ?? '',
          u_role: userObj.u_role ?? 'student',
          u_password: userObj.u_password ?? '',
          u_gender: userObj.u_gender ?? '',
        u_profile_photo: formatImageUri(
          userObj.u_profile_photo ||
            studentObj.u_profile_photo ||
            studentObj.profile_photo ||
            authUser?.profileImage ||
            ''
        ),
          u_created_at: userObj.u_created_at ?? '',
          u_updated_at: userObj.u_updated_at ?? '',
          s_id: studentObj.s_id ?? '',
          s_u_id: studentObj.s_u_id ?? userObj.u_id ?? '',
          s_date_of_birth: studentObj.s_date_of_birth ?? '',
          s_father_name: studentObj.s_father_name ?? '',
          s_address: studentObj.s_address ?? '',
          s_city: studentObj.s_city ?? '',
          s_country: studentObj.s_country ?? '',
          s_created_at: studentObj.s_created_at ?? '',
          s_updated_at: studentObj.s_updated_at ?? '',
        } as const;
        setData(normalized);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
  }, [u_id, dispatch, fadeAnim]);

  useEffect(() => {
    fetchAndSetProfile();
  }, [fetchAndSetProfile]);

  const lastSyncedProfileImageRef = useRef<string | null>(null);
  const lastSyncedNameRef = useRef<string | null>(null);
  const lastSyncedEmailRef = useRef<string | null>(null);

  const profileImageUri = useMemo(() => {
    const raw =
      data?.u_profile_photo ||
      rtkProfile?.user?.u_profile_photo ||
      rtkProfile?.u_profile_photo ||
      authUser?.profileImage ||
      '';
    return formatImageUri(raw);
  }, [
    data?.u_profile_photo,
    rtkProfile?.user?.u_profile_photo,
    rtkProfile?.u_profile_photo,
    authUser?.profileImage,
  ]);

  useEffect(() => {
    if (!data) return;
    const formatted = formatImageUri(data.u_profile_photo);
    const name = data.u_name || authUser?.name || '';
    const email = data.u_email || authUser?.email || '';

    const needsNameUpdate = name && name !== lastSyncedNameRef.current;
    const needsEmailUpdate = email && email !== lastSyncedEmailRef.current;

    if (formatted && formatted !== lastSyncedProfileImageRef.current) {
      lastSyncedProfileImageRef.current = formatted;
      dispatch(updateUser({ profileImage: formatted, name, email }) as any);
      lastSyncedNameRef.current = name;
      lastSyncedEmailRef.current = email;
      return;
    }

    if (!formatted && lastSyncedProfileImageRef.current) {
      lastSyncedProfileImageRef.current = null;
      dispatch(updateUser({ profileImage: '', name, email }) as any);
      lastSyncedNameRef.current = name;
      lastSyncedEmailRef.current = email;
      return;
    }

    if (needsNameUpdate || needsEmailUpdate) {
      lastSyncedNameRef.current = name;
      lastSyncedEmailRef.current = email;
      dispatch(updateUser({ name, email }) as any);
    }
  }, [data, dispatch, authUser?.name, authUser?.email]);

  if (!u_id) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.errorGradient}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="person-circle-outline" size={110} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.errorText}>User not authenticated</Text>
          <Text style={styles.errorSubtext}>Please sign in to view your profile</Text>
          <View style={styles.decorativeDots}>
            <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
            <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#667EEA', '#764BA2', '#F093FB']} style={styles.loadingGradient}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.loadingSpinner}>
              <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} style={styles.loadingCircle}>
                <Ionicons name="school" size={70} color="#667EEA" />
              </LinearGradient>
            </View>
          </Animated.View>
          <Text style={styles.loadingText}>Loading Your Profile</Text>
          <Text style={styles.loadingSubtext}>Preparing your personalized dashboard...</Text>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.loadingDot, { opacity: shimmerAnim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: shimmerAnim, marginHorizontal: 8 }]} />
            <Animated.View style={[styles.loadingDot, { opacity: shimmerAnim }]} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient colors={['#FC6076', '#FF9A44', '#FED766']} style={styles.errorGradient}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="alert-circle" size={110} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.errorText}>Oops! Something went wrong</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <View style={styles.errorWave}>
            <View style={styles.waveShape} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  const userName = data?.u_name || rtkProfile?.user?.u_name || rtkProfile?.u_name || 'Student';
  const userEmail = data?.u_email || rtkProfile?.user?.u_email || rtkProfile?.u_email || '';
  const userRole = (data?.u_role ?? rtkProfile?.user?.u_role ?? 'student').toUpperCase();

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
      {/* Animated Header with Advanced Gradient */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={['#667EEA', '#764BA2', '#F093FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Animated Background Elements */}
            <Animated.View style={[styles.floatingCircle, { 
              top: -60, 
              right: -50, 
              width: 220, 
              height: 220,
              opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.2] })
            }]} />
            <Animated.View style={[styles.floatingCircle, { 
              bottom: -70, 
              left: -60, 
              width: 180, 
              height: 180,
              opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.25] })
            }]} />
            <View style={[styles.floatingCircle, { top: 100, left: 30, width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
            <View style={[styles.floatingCircle, { top: 200, right: 50, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' }]} />
            
            <View style={styles.headerContent}>
              {/* Enhanced Avatar with Glow */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarGlowWrapper}>
                  <View style={styles.avatarGlow}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']}
                      style={styles.avatarRing}
                    >
                      {profileImageUri ? (
                        <Image source={{ uri: profileImageUri }} style={styles.avatar} />
                      ) : (
                        <LinearGradient
                          colors={['#FFFFFF', '#F3F4F6']}
                          style={[styles.avatar, styles.avatarPlaceholder]}
                        >
                          <Ionicons name="person" size={64} color="#667EEA" />
                        </LinearGradient>
                      )}
                    </LinearGradient>
                  </View>
                </View>
                <View style={styles.statusDot}>
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.statusDotInner}>
                    <View style={styles.statusPulse} />
                  </LinearGradient>
                </View>
              </View>
              
              {/* User Info with Better Typography */}
              <Text style={styles.headerName}>{userName}</Text>
              <Text style={styles.headerEmail}>{userEmail}</Text>
              
              {/* Enhanced Role Badge */}
              <View style={styles.roleBadgeWrapper}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                  style={styles.roleBadge}
                >
                  <View style={styles.roleBadgeIconWrapper}>
                    <Ionicons name="school" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.roleBadgeText}>{userRole}</Text>
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>

          {/* Wave Overlay */}
          <View style={styles.waveContainer}>
            <View style={styles.wave} />
          </View>
        </View>

        {/* Success Banner */}
        {successMsg ? (
          <Animated.View style={{ opacity: successAnim }}>
            <View style={styles.successWrap}>
              <LinearGradient colors={['#10B981', '#059669', '#047857']} style={styles.successCard}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.successText}>{successMsg}</Text>
              </LinearGradient>
            </View>
          </Animated.View>
        ) : null}

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard icon="calendar" label="Joined" value={formatDate(data?.u_created_at)} gradient={['#10B981', '#059669']} />
          <StatCard icon="person" label="Role" value={userRole} gradient={['#8B5CF6', '#7C3AED']} />
          <StatCard icon="location" label="Location" value={data?.s_city || '—'} gradient={['#F59E0B', '#D97706']} />
        </View>

        {/* Main Content Cards */}
        <View style={styles.contentWrapper}>
          {/* Personal Information Card */}
          <View style={styles.modernCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.modernCardGradient}
            >
              <SectionHeader title="Personal Information" icon="person" gradient={['#667EEA', '#764BA2']} />
              <View style={styles.sectionContent}>
                <InfoRow icon="person-outline" label="Full Name" value={data?.u_name ?? rtkProfile?.user?.u_name ?? rtkProfile?.u_name} iconGradient={['#3B82F6', '#2563EB']} />
                <InfoRow icon="people-outline" label="Father's Name" value={data?.s_father_name ?? rtkProfile?.student?.s_father_name ?? rtkProfile?.s_father_name} iconGradient={['#6366F1', '#4F46E5']} />
                <InfoRow icon="male-female-outline" label="Gender" value={data?.u_gender ?? rtkProfile?.user?.u_gender ?? rtkProfile?.u_gender} iconGradient={['#EC4899', '#DB2777']} />
                <InfoRow icon="calendar-outline" label="Date of Birth" value={data?.s_date_of_birth ?? rtkProfile?.student?.s_date_of_birth ?? rtkProfile?.s_date_of_birth} iconGradient={['#0EA5E9', '#0284C7']} />
              </View>
            </LinearGradient>
          </View>

          {/* Contact Details Card */}
          <View style={styles.modernCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.modernCardGradient}
            >
              <SectionHeader title="Contact Details" icon="call" gradient={['#10B981', '#059669']} />
              <View style={styles.sectionContent}>
                <InfoRow icon="mail-outline" label="Email Address" value={data?.u_email ?? rtkProfile?.user?.u_email ?? rtkProfile?.u_email} iconGradient={['#10B981', '#059669']} />
                <InfoRow icon="call-outline" label="Phone Number" value={data?.u_phone ?? rtkProfile?.user?.u_phone ?? rtkProfile?.u_phone} iconGradient={['#3B82F6', '#2563EB']} />
              </View>
            </LinearGradient>
          </View>

          {/* Location Card */}
          <View style={styles.modernCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.modernCardGradient}
            >
              <SectionHeader title="Location Details" icon="location" gradient={['#F59E0B', '#D97706']} />
              <View style={styles.sectionContent}>
                <InfoRow icon="home-outline" label="Address" value={data?.s_address ?? rtkProfile?.student?.s_address ?? rtkProfile?.s_address} iconGradient={['#F59E0B', '#D97706']} />
                <InfoRow icon="location-outline" label="City" value={data?.s_city ?? rtkProfile?.student?.s_city ?? rtkProfile?.s_city} iconGradient={['#EA580C', '#C2410C']} />
                <InfoRow icon="earth-outline" label="Country" value={data?.s_country ?? rtkProfile?.student?.s_country ?? rtkProfile?.s_country} iconGradient={['#0EA5E9', '#0284C7']} />
              </View>
            </LinearGradient>
          </View>
        </View>
      </Animated.View>

      {/* Update Form */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <View style={styles.modernCard}>
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.modernCardGradient}>
            <SectionHeader title="Update your Profile" icon="create-outline" gradient={['#06B6D4', '#0891B2']} />
            <View style={styles.formGrid}>
              {/* Profile Photo Picker */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.formLabel}>Profile Photo</Text>
                <View style={styles.photoRow}>
                  {profileImageUri ? (
                    <View style={styles.photoPreviewWrapper}>
                      <Image source={{ uri: profileImageUri }} style={styles.photoPreview} />
                      <View style={styles.photoOverlay}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.photoPreview, styles.photoPlaceholder]}>
                      <LinearGradient colors={['#F1F5F9', '#E2E8F0']} style={styles.photoPlaceholderInner}>
                        <Ionicons name="image" size={28} color="#94A3B8" />
                      </LinearGradient>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        try {
                          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                          if (status !== 'granted') return;
                          const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 0.7,
                          });
                          if (!result.canceled) {
                            const uri = result.assets?.[0]?.uri;
                            if (uri) {
                              setData((p: any) => ({ ...p, u_profile_photo: uri }));
                              dispatch(updateUser({ profileImage: formatImageUri(uri) }) as any);
                            }
                          }
                        } catch {}
                      }}
                      style={{ flex: 1 }}
                    >
                      <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.photoButton}>
                        <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.photoButtonText}>{profileImageUri ? 'Change' : 'Upload'}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    {profileImageUri ? (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setData((p: any) => ({ ...p, u_profile_photo: '' }));
                          dispatch(updateUser({ profileImage: '' }) as any);
                        }}
                      >
                        <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.photoButton}>
                          <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
              <FormInput label="Student Name" value={data?.u_name} onChange={(t) => setData((p: any) => ({ ...p, u_name: t }))} icon="person-outline" />
              <FormInput label="Father Name" value={data?.s_father_name} onChange={(t) => setData((p: any) => ({ ...p, s_father_name: t }))} icon="people-outline" />
              <FormInput label="Email" value={data?.u_email} onChange={(t) => setData((p: any) => ({ ...p, u_email: t }))} keyboardType="email-address" icon="mail-outline" />
              <FormInput label="Phone" value={data?.u_phone} onChange={(t) => setData((p: any) => ({ ...p, u_phone: t }))} keyboardType="phone-pad" icon="call-outline" />
              <FormInput label="Gender" value={data?.u_gender} onChange={(t) => setData((p: any) => ({ ...p, u_gender: t }))} icon="male-female-outline" />
              <FormInput label="Date of Birth" value={data?.s_date_of_birth} onChange={(t) => setData((p: any) => ({ ...p, s_date_of_birth: t }))} icon="calendar-outline" />
              <FormInput label="Created At" value={data?.u_created_at} onChange={(t) => setData((p: any) => ({ ...p, u_created_at: t }))} icon="time-outline" />
              <FormInput label="Address" value={data?.s_address} onChange={(t) => setData((p: any) => ({ ...p, s_address: t }))} icon="home-outline" />
              <FormInput label="City" value={data?.s_city} onChange={(t) => setData((p: any) => ({ ...p, s_city: t }))} icon="location-outline" />
              <FormInput label="Country" value={data?.s_country} onChange={(t) => setData((p: any) => ({ ...p, s_country: t }))} icon="earth-outline" />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.updateButtonWrapper}
              onPress={async () => {
                if (!u_id || !data) return;
                const payload: any = {
                  u_id,
                  u_name: data.u_name,
                  u_email: data.u_email,
                  u_phone: data.u_phone,
                  u_gender: data.u_gender,
                  u_created_at: data.u_created_at,
                  s_father_name: data.s_father_name,
                  s_date_of_birth: data.s_date_of_birth,
                  s_address: data.s_address,
                  s_city: data.s_city,
                  s_country: data.s_country,
                };
                if (data.u_profile_photo && typeof data.u_profile_photo === 'string' && data.u_profile_photo.startsWith('file')) {
                  const name = data.u_profile_photo.split('/').pop() || 'photo.jpg';
                  const ext = name.split('.').pop()?.toLowerCase();
                  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
                  payload.u_profile_photo = { uri: data.u_profile_photo, name, type: mime } as any;
                }
                const result = await (dispatch as any)(updateStudentAdminProfile(payload));
                const ok = result?.meta?.requestStatus === 'fulfilled';
                if (ok) {
                  setSuccessMsg('Profile updated successfully');
                  requestAnimationFrame(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  });
                  successAnim.setValue(0);
                  Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                  setShowSuccessModal(true);
                  modalOpacity.setValue(0);
                  modalScale.setValue(0.9);
                  Animated.parallel([
                    Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 100 }),
                  ]).start();
                  setTimeout(() => {
                    Animated.parallel([
                      Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                      Animated.timing(modalScale, { toValue: 0.95, duration: 200, useNativeDriver: true }),
                    ]).start(() => setShowSuccessModal(false));
                    Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setSuccessMsg(null));
                  }, 2000);
                  const refreshed = await (dispatch as any)(fetchStudentAdminProfile(u_id));
                  await fetchAndSetProfile();
                  const updatedUser = refreshed?.payload?.user || refreshed?.payload?.data?.user || refreshed?.payload;
                  const updatedStudent = refreshed?.payload?.student || refreshed?.payload?.data?.student || {};
                  const latestUri = formatImageUri(
                    updatedUser?.u_profile_photo ||
                      updatedStudent?.u_profile_photo ||
                      updatedStudent?.profile_photo ||
                      data?.u_profile_photo ||
                      ''
                  );
                  if (latestUri) {
                    dispatch(updateUser({ profileImage: latestUri }) as any);
                  }
                }
              }}
            >
              <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.updateButton}>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.updateButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Enhanced Success Modal */}
      {showSuccessModal ? (
        <Animated.View
          pointerEvents="auto"
          style={[styles.modalOverlay, { opacity: modalOpacity }]}
        >
          <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
            <LinearGradient colors={['#10B981', '#059669', '#047857']} style={styles.modalGradient}>
              <View style={styles.modalIconWrapper}>
                <View style={styles.modalIconCircle}>
                  <Ionicons name="checkmark-done" size={42} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.modalTitle}>Success!</Text>
              <Text style={styles.modalSubtitle}>Your profile has been updated successfully</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Animated.parallel([
                    Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                    Animated.timing(modalScale, { toValue: 0.95, duration: 200, useNativeDriver: true }),
                  ]).start(() => setShowSuccessModal(false));
                }}
              >
                <View style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Awesome</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

function StatCard({ icon, label, value, gradient }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; gradient: [string, string] }) {
  return (
    <View style={styles.statCard}>
      <LinearGradient colors={gradient} style={styles.statCardGradient}>
        <View style={styles.statIconWrapper}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

function SectionHeader({ title, icon, gradient }: { title: string; icon: keyof typeof Ionicons.glyphMap; gradient: [string, string] }) {
  return (
    <View style={styles.sectionHeader}>
      <LinearGradient colors={gradient} style={styles.sectionIconContainer}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ 
  icon, 
  label, 
  value, 
  iconGradient 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  value: any; 
  iconGradient: [string, string];
}) {
  const text = (() => {
    try {
      const v = value === undefined || value === null ? '' : String(value);
      return v.trim() === '' ? '—' : v;
    } catch {
      return '—';
    }
  })();
  
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <LinearGradient colors={iconGradient} style={styles.infoIcon}>
          <Ionicons name={icon} size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={2}>{text}</Text>
    </View>
  );
}

function FormInput({ label, value, onChange, keyboardType, icon }: { label: string; value?: string; onChange: (text: string) => void; keyboardType?: any; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name={icon} size={20} color="#94A3B8" />
        </View>
        <TextInput
          value={value ?? ''}
          onChangeText={onChange}
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#CBD5E1"
          style={styles.input}
        />
      </View>
    </View>
  );
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  wrapper: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingGradient: {
    width: 300,
    alignItems: 'center',
    padding: 48,
    borderRadius: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  errorGradient: {
    width: 320,
    alignItems: 'center',
    padding: 48,
    borderRadius: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  loadingSubtext: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  errorSubtext: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  decorativeDots: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  errorWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    overflow: 'hidden',
  },
  waveShape: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  headerWrapper: {
    position: 'relative',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarGlowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  avatarGlow: {
    ...Platform.select({
      ios: {
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatarRing: {
    padding: 8,
    borderRadius: 75,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statusDotInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  headerName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  headerEmail: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  roleBadgeWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  roleBadgeIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  waveContainer: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 30,
    overflow: 'hidden',
  },
  wave: {
    width: '100%',
    height: 60,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  successWrap: {
    paddingHorizontal: 16,
    marginTop: -24,
    marginBottom: 20,
  },
  successCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.4,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -40,
    marginBottom: 24,
    zIndex: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  modernCard: {
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modernCardGradient: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  sectionContent: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: '50%',
  },
  formGrid: {
    gap: 14,
  },
  formLabel: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  photoPreviewWrapper: {
    position: 'relative',
  },
  photoPreview: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputIconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  updateButtonWrapper: {
    marginTop: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 18,
    paddingVertical: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    letterSpacing: 0.6,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalCard: {
    width: 280,
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  modalIconWrapper: {
    marginBottom: 8,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  modalSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalButtonText: {
    color: '#059669',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
}); 