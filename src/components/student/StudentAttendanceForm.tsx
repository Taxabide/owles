import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateAttendance } from '../../redux/slices/attendanceSlice';
import { Dropdown } from 'react-native-element-dropdown';

const StudentAttendanceForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [attendance, setAttendance] = useState<'present' | 'absent' | 'leave' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  type Option = { label: string; value: 'present' | 'absent' | 'leave'; icon: keyof typeof Ionicons.glyphMap; color: string };
  const options: Option[] = useMemo(() => ([
    { label: 'Present', value: 'present', icon: 'checkmark-circle', color: '#10B981' },
    { label: 'Absent', value: 'absent', icon: 'close-circle', color: '#EF4444' },
    { label: 'Leave', value: 'leave', icon: 'time', color: '#F59E0B' },
  ]), []);

  const onSubmit = async () => {
    if (!attendance || !authUser?.id || submitting) return;
    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const today = new Date();
      const date = today.toISOString().slice(0, 10); // YYYY-MM-DD

      const result = await (dispatch as any)(
        updateAttendance({
          u_id: String(authUser.id),
          attendance_status: attendance,
          date,
        })
      );

      const ok = result?.meta?.requestStatus === 'fulfilled';
      if (ok) {
        setSuccessMsg('Attendance submitted successfully.');
        // Navigate to calendar after short delay so user sees the message
        setTimeout(() => {
          router.push('/student/attendance/list' as any);
        }, 1000);
      } else {
        setErrorMsg(result?.payload as string || 'Failed to submit attendance.');
      }
    } catch (error: any) {
      console.log('Submit attendance error:', error?.message || error);
      setErrorMsg('Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch (attendance) {
      case 'present': return '#10B981';
      case 'absent': return '#EF4444';
      case 'leave': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (attendance) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'leave': return 'time';
      default: return 'person-circle-outline';
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={[styles.iconCircle, { backgroundColor: getStatusColor() + '20' }]}>
              <Ionicons name={getStatusIcon()} size={40} color={getStatusColor()} />
            </View>
            <Text style={styles.title}>Student Attendance</Text>
            <Text style={styles.subtitle}>Mark your attendance for today</Text>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={14} color="#3B82F6" />
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
            </View>
          </View>

          {/* Main Form Card */}
          <View style={styles.formCard}>
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="clipboard-outline" size={18} color="#1F2937" />
                <Text style={styles.label}>Attendance Status</Text>
              </View>
              
              <View style={[styles.dropdownWrap, attendance && { borderColor: getStatusColor(), borderWidth: 2 }]}>
                <Dropdown
                  data={options}
                  value={attendance}
                  labelField="label"
                  valueField="value"
                  placeholder="Select your attendance status"
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={[styles.dropdownText, { color: getStatusColor() }]}
                  containerStyle={styles.dropdownContainer}
                  itemContainerStyle={styles.dropdownItem}
                  onChange={(item) => setAttendance(item.value)}
                  renderLeftIcon={() => attendance ? (
                    <Ionicons 
                      name={(options.find(opt => opt.value === attendance)?.icon || 'checkmark-circle') as keyof typeof Ionicons.glyphMap}
                      size={22} 
                      color={getStatusColor()} 
                      style={{ marginRight: 10 }} 
                    />
                  ) : (
                    <Ionicons name="person-circle-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
                  )}
                  renderItem={(item) => (
                    <View style={styles.optionItem}>
                      <View style={[styles.optionIconWrap, { backgroundColor: item.color + '15' }]}>
                        <Ionicons name={item.icon} size={20} color={item.color} />
                      </View>
                      <Text style={[styles.optionText, attendance === item.value && { color: item.color, fontWeight: '700' }]}>
                        {item.label}
                      </Text>
                      {attendance === item.value && (
                        <Ionicons name="checkmark" size={20} color={item.color} style={{ marginLeft: 'auto' }} />
                      )}
                    </View>
                  )}
                />
              </View>

              {attendance && (
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '10', borderColor: getStatusColor() + '30' }]}>
                  <Ionicons name="information-circle" size={16} color={getStatusColor()} />
                  <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {attendance === 'present' && 'Great! Your presence is confirmed.'}
                    {attendance === 'absent' && 'Please ensure to catch up on missed work.'}
                    {attendance === 'leave' && 'Leave request will be recorded.'}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Animated.View style={[styles.btnWrapper, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity
                  style={[styles.primaryBtn, !attendance && styles.primaryBtnDisabled]}
                  onPress={onSubmit}
                  activeOpacity={0.85}
                  disabled={!attendance || submitting}
                >
                  <LinearGradient
                    colors={attendance ? ['#3B82F6', '#2563EB'] : ['#93C5FD', '#BFDBFE']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {submitting ? (
                      <View style={styles.btnContent}>
                        <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryText}>Submitting...</Text>
                      </View>
                    ) : (
                      <View style={styles.btnContent}>
                        <Ionicons name="send" size={18} color="#FFFFFF" />
                        <Text style={styles.primaryText}>Submit Attendance</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setAttendance(null)}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color="#64748B" />
                <Text style={styles.secondaryText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {successMsg ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                <Text style={styles.successBannerText}>{successMsg}</Text>
              </View>
            ) : null}

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="bulb-outline" size={20} color="#8B5CF6" />
            <Text style={styles.infoText}>
              Make sure to submit your attendance before the deadline to avoid any issues.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  field: { marginBottom: 8 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '700',
  },
  dropdownWrap: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdown: { height: 56 },
  dropdownPlaceholder: { color: '#9CA3AF', fontSize: 15 },
  dropdownText: { fontSize: 15, fontWeight: '600' },
  dropdownContainer: {
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownItem: { paddingVertical: 4 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  actions: { marginTop: 20, gap: 12 },
  btnWrapper: { width: '100%' },
  primaryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnDisabled: {
    shadowOpacity: 0.1,
  },
  btnGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 16,
  },
  successBanner: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  errorBanner: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },

  infoCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B21A8',
    lineHeight: 18,
  },
});

export default StudentAttendanceForm;