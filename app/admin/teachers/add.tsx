import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Animated, Dimensions, Easing, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddTeacherPayload } from '../../../src/api/adminApi'; // Corrected import path
import AdminNavbar from '../../../src/components/admin/AdminNavbar';
import AdminSideBar from '../../../src/components/admin/AdminSideBar';
import Input from '../../../src/components/common/Input';
import { APP_ROUTES } from '../../../src/constants/routes';
import { addTeacher, clearAddTeacherError } from '../../../src/redux/slices/adminSlice';
import { AppDispatch, RootState } from '../../../src/redux/store';

const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\d{10}$/; // exactly 10 digits

const { width: screenWidth } = Dimensions.get('window');

const AddTeacherScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isAddingTeacher, addTeacherError } = useSelector((state: RootState) => state.admin);

  const [t_name, setT_name] = useState('');
  const [t_email, setT_email] = useState('');
  const [t_phone, setT_phone] = useState('');
  const [t_password, setT_password] = useState('');
  const [t_gender, setT_gender] = useState('Male'); // Default to Male
  const [t_subject, setT_subject] = useState('');
  const [t_profile_photo, setT_profile_photo] = useState(''); // local uri for preview / send as string
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-screenWidth));
  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  };

  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string; subject?: string }>({});
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    if (addTeacherError) {
      Alert.alert('Error', addTeacherError);
      dispatch(clearAddTeacherError());
    }
  }, [addTeacherError, dispatch]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!t_name.trim()) next.name = 'Name is required';
    else if (t_name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!t_email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(t_email.trim())) next.email = 'Enter a valid email address';
    if (!t_phone.trim()) next.phone = 'Phone is required';
    else if (!phoneRegex.test(t_phone.trim())) next.phone = 'Enter 10-digit phone number';
    if (!t_subject.trim()) next.subject = 'Subject is required';
    if (!t_password) next.password = 'Password is required';
    else if (t_password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      t_name.trim().length >= 2 &&
      emailRegex.test(t_email.trim()) &&
      phoneRegex.test(t_phone.trim()) &&
      t_subject.trim().length > 0 &&
      t_password.length >= 6
    );
  }, [t_name, t_email, t_phone, t_subject, t_password]);

  const handleSubmit = () => {
    if (!validate()) return;

    const apiGender = (t_gender || '').toLowerCase();
    const normalizedPhoto = t_profile_photo && (t_profile_photo.startsWith('http') || t_profile_photo.startsWith('/'))
      ? t_profile_photo
      : '';

    const teacherData: AddTeacherPayload = {
      t_name: t_name.trim(),
      t_email: t_email.trim(),
      t_phone: t_phone.trim(),
      t_password,
      t_gender: apiGender as any,
      t_subject: t_subject.trim(),
      // send photo only if it's a server-accessible path/URL
      ...(normalizedPhoto && { t_profile_photo: normalizedPhoto }),
    };

    dispatch(addTeacher(teacherData))
      .unwrap()
      .then(() => {
        setSuccessVisible(true);
      })
      .catch((error) => {
        console.error('Failed to add teacher:', error);
      });
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload a profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) setT_profile_photo(uri);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AdminNavbar adminName="Admin" onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          {/* Header with gradient-style background */}
          <View style={styles.headerSection}>
            <Text style={styles.headerIcon}>🎓</Text>
            <Text style={styles.headerTitle}>Add New Teacher</Text>
            <Text style={styles.headerSubtitle}>Register a new teacher to the system</Text>
          </View>

          <View style={styles.formContent}>
            {/* Profile Photo Section */}
            <View style={styles.profileSection}>
              <Text style={styles.sectionLabel}>Profile Photo</Text>
              <View style={styles.photoContainer}>
                <View style={styles.avatarContainer}>
                  {t_profile_photo ? (
                    <Image source={{ uri: t_profile_photo }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarIcon}>👤</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={handlePickImage} style={styles.cameraButton} activeOpacity={0.8}>
                    <Text style={styles.cameraIcon}>📷</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.photoActions}>
                  <TouchableOpacity 
                    onPress={handlePickImage} 
                    style={[styles.actionButton, styles.uploadButton]} 
                    activeOpacity={0.8}
                  >
                    <Text style={styles.uploadButtonText}>
                      {t_profile_photo ? 'Photo Uploaded!' : 'Upload Photo'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setT_profile_photo('')} 
                    style={[styles.actionButton, styles.cancelButton]} 
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Teacher Name */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>👤</Text>
                  <Text style={styles.fieldLabel}>Teacher Name</Text>
                </View>
                <Input
                  placeholder="John Doe"
                  value={t_name}
                  onChangeText={(v: string) => {
                    setT_name(v);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  maxLength={50}
                  containerStyle={styles.modernInput}
                />
                {!!errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>📧</Text>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                </View>
                <Input
                  placeholder="john.doe@school.edu"
                  value={t_email}
                  onChangeText={(v: string) => {
                    setT_email(v);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  maxLength={100}
                  containerStyle={styles.modernInput}
                />
                {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>📱</Text>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                </View>
                <Input
                  placeholder="10-digit phone"
                  value={t_phone}
                  onChangeText={(v: string) => {
                    const digitsOnly = v.replace(/\D/g, '').slice(0, 10);
                    setT_phone(digitsOnly);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  containerStyle={styles.modernInput}
                />
                {!!errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>🔒</Text>
                  <Text style={styles.fieldLabel}>Password</Text>
                </View>
                <Input
                  placeholder="Enter secure password"
                  value={t_password}
                  onChangeText={(v: string) => {
                    setT_password(v);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  secureTextEntry
                  maxLength={16}
                  containerStyle={styles.modernInput}
                />
                {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Subject */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.iconLabel}>📚</Text>
                  <Text style={styles.fieldLabel}>Teaching Subject</Text>
                </View>
                <Input
                  placeholder="Mathematics, Science, English..."
                  value={t_subject}
                  onChangeText={(v: string) => {
                    setT_subject(v);
                    if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                  }}
                  maxLength={60}
                  containerStyle={styles.modernInput}
                />
                {!!errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity 
                      key={gender} 
                      style={styles.genderOption} 
                      onPress={() => setT_gender(gender)} 
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radioButton, t_gender === gender && styles.radioButtonActive]}>
                        <View style={[styles.radioInner, t_gender === gender && styles.radioInnerActive]} />
                      </View>
                      <Text style={[styles.genderLabel, t_gender === gender && styles.genderLabelActive]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={isAddingTeacher || !isFormValid}
                style={[styles.saveButton, (isAddingTeacher || !isFormValid) && styles.saveButtonDisabled]}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonIcon}>🎓</Text>
                <Text style={styles.saveButtonText}>Add Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.cancelMainButton}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelMainButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sidebar */}
      {isMenuOpen && (
        <AdminSideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          slideAnim={slideAnim}
          adminName={"Admin"}
          adminEmail={"admin@example.com"}
        />
      )}

      {/* Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {successVisible && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successTitle}>Teacher Added!</Text>
            <Text style={styles.successMsg}>The teacher has been saved successfully.</Text>
            <View style={styles.successActions}>
              <TouchableOpacity
                onPress={() => {
                  setSuccessVisible(false);
                  router.push(APP_ROUTES.ADMIN_TEACHERS);
                }}
                style={styles.successPrimary}
                activeOpacity={0.85}
              >
                <Text style={styles.successPrimaryText}>Go to Teacher List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSuccessVisible(false);
                  // reset form for adding another
                  setT_name(''); setT_email(''); setT_phone(''); setT_password(''); setT_subject(''); setT_gender('Male'); setT_profile_photo(''); setErrors({});
                }}
                style={styles.successSecondary}
                activeOpacity={0.85}
              >
                <Text style={styles.successSecondaryText}>Add Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddTeacherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerSection: {
    backgroundColor: '#10B981',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  formContent: {
    padding: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#10B981',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIcon: {
    fontSize: 16,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  uploadButton: {
    backgroundColor: '#10B981',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  formFields: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconLabel: {
    fontSize: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modernInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#10B981',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  radioInnerActive: {
    backgroundColor: '#10B981',
  },
  genderLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderLabelActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonIcon: {
    fontSize: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelMainButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelMainButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successEmoji: { fontSize: 40, marginBottom: 8 },
  successTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  successMsg: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 16 },
  successActions: { flexDirection: 'row', gap: 10 },
  successPrimary: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  successPrimaryText: { color: '#FFFFFF', fontWeight: '700' },
  successSecondary: { backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  successSecondaryText: { color: '#374151', fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
});