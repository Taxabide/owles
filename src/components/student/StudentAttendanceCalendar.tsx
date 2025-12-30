import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceList } from '../../redux/slices/attendanceSlice';
import { AppDispatch, RootState } from '../../redux/store';

type AttendanceStatus = 'present' | 'absent' | 'half' | 'none';

const { width } = Dimensions.get('window');

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Map API status string to local AttendanceStatus
const mapStatusFromApi = (status: string | undefined): AttendanceStatus => {
  if (!status) return 'none';
  const normalized = status.toLowerCase();
  if (normalized === 'present') return 'present';
  if (normalized === 'absent') return 'absent';
  // treat late/leave/half as half-day
  if (normalized === 'late' || normalized === 'leave' || normalized === 'half') return 'half';
  return 'none';
};

const statusColor: Record<Exclude<AttendanceStatus, 'none'>, string> = {
  present: '#22C55E',
  absent: '#EF4444',
  half: '#F59E0B',
};

const StudentAttendanceCalendar: React.FC = () => {
  const today = new Date();
  const [cursor, setCursor] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { calendarItems, isLoading, error } = useSelector((state: RootState) => state.attendance);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDayIdx = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  const monthName = cursor.toLocaleString('default', { month: 'long' });

  // Load attendance for the logged-in student (once, then filter by month locally)
  useEffect(() => {
    const loadAttendance = async () => {
      if (!authUser?.id) return;
      await dispatch(fetchAttendanceList({ role: 'student', u_id: String(authUser.id) }) as any);
    };

    loadAttendance();
  }, [authUser?.id, dispatch]);

  // Build per-day status map for the currently visible month
  const attendance = useMemo(() => {
    const map: Record<number, AttendanceStatus> = {};
    calendarItems?.forEach((item) => {
      const d = new Date(item.date);
      if (Number.isNaN(d.getTime())) return;
      if (d.getFullYear() === year && d.getMonth() === month) {
        const status = mapStatusFromApi(item.status);
        if (status !== 'none') {
          map[d.getDate()] = status;
        }
      }
    });
    return map;
  }, [calendarItems, year, month]);

  const counts = useMemo(() => {
    const vals = Object.values(attendance);
    return {
      present: vals.filter(v => v === 'present').length,
      absent: vals.filter(v => v === 'absent').length,
      half: vals.filter(v => v === 'half').length,
    };
  }, [attendance]);

  const grid: Array<{ day: number | null; status: AttendanceStatus }> = [];
  for (let i = 0; i < firstDayIdx; i++) grid.push({ day: null, status: 'none' });
  for (let d = 1; d <= daysInMonth; d++) grid.push({ day: d, status: attendance[d] || 'none' });
  while (grid.length % 7 !== 0) grid.push({ day: null, status: 'none' });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerGradient}>
        <Text style={styles.title}>📅 Attendance Calendar</Text>
        <Text style={styles.subtitle}>Track your presence effortlessly</Text>
        {isLoading && (
          <View style={styles.headerLoadingRow}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.headerLoadingText}>Loading latest data…</Text>
          </View>
        )}
        {error && !isLoading && (
          <Text style={styles.headerErrorText}>{error}</Text>
        )}
      </View>

      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, styles.kpiCardPresent]}> 
          <View style={styles.kpiIconWrapper}>
            <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
          </View>
          <View style={styles.kpiTextWrap}>
            <Text style={styles.kpiLabel}>Present</Text>
            <Text style={[styles.kpiValue, { color: '#22C55E' }]}>{counts.present}</Text>
          </View>
        </View>
        <View style={[styles.kpiCard, styles.kpiCardAbsent]}> 
          <View style={styles.kpiIconWrapper}>
            <Ionicons name="close-circle" size={28} color="#EF4444" />
          </View>
          <View style={styles.kpiTextWrap}>
            <Text style={styles.kpiLabel}>Absent</Text>
            <Text style={[styles.kpiValue, { color: '#EF4444' }]}>{counts.absent}</Text>
          </View>
        </View>
        <View style={[styles.kpiCard, styles.kpiCardHalf]}> 
          <View style={styles.kpiIconWrapper}>
            <Ionicons name="time" size={28} color="#F59E0B" />
          </View>
          <View style={styles.kpiTextWrap}>
            <Text style={styles.kpiLabel}>Half Day</Text>
            <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>{counts.half}</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.navBtn} onPress={prevMonth} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#4F46E5" />
        </TouchableOpacity>
        <View style={styles.monthLabelWrapper}>
          <Text style={styles.monthLabel}>{monthName}</Text>
          <Text style={styles.yearLabel}>{year}</Text>
        </View>
        <TouchableOpacity style={styles.navBtn} onPress={nextMonth} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {dayNames.map((n) => (
          <View key={n} style={styles.weekHeaderItem}>
            <Text style={styles.weekHeaderText}>{n}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.grid}>
          {grid.map((cell, idx) => (
            <TouchableOpacity 
              key={`c-${idx}`} 
              style={[
                styles.cell, 
                selectedDay === cell.day && styles.cellSelected,
                isToday(year, month, cell.day) && styles.cellToday
              ]} 
              activeOpacity={cell.day ? 0.75 : 1} 
              onPress={() => cell.day && setSelectedDay(cell.day)}
            >
              {cell.day ? (
                <View style={styles.cellInner}>
                  <Text style={[
                    styles.dayText, 
                    isToday(year, month, cell.day) && styles.todayText,
                    selectedDay === cell.day && styles.selectedText
                  ]}>
                    {cell.day}
                  </Text>
                  {cell.status !== 'none' && (
                    <View style={[
                      styles.badge, 
                      { backgroundColor: statusColor[cell.status as Exclude<AttendanceStatus, 'none'>] }
                    ]} />
                  )}
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>📌 Legend</Text>
        <View style={styles.legendContent}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: statusColor.present }]}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: statusColor.absent }]}>
              <Ionicons name="close" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: statusColor.half }]}>
              <Ionicons name="remove" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.legendText}>Half Day</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const CELL_GAP = 8;
const COLS = 7;
const CELL_SIZE = (width - 48 - CELL_GAP * (COLS - 1)) / COLS; // padding 24*2

const isToday = (y: number, m: number, d: number) => {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
};

const styles = StyleSheet.create({
  container: { 
    padding: 24, 
    backgroundColor: '#F8FAFF',
    minHeight: '100%'
  },
  headerGradient: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  headerLoadingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerLoadingText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  headerErrorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1E293B', 
    textAlign: 'center',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4
  },
  kpiRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20 
  },
  kpiCard: { 
    flex: 1, 
    borderRadius: 20, 
    paddingVertical: 16, 
    paddingHorizontal: 14, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 4,
    borderWidth: 2
  },
  kpiCardPresent: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC'
  },
  kpiCardAbsent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  kpiCardHalf: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  kpiIconWrapper: {
    marginBottom: 8,
    alignItems: 'center'
  },
  kpiTextWrap: { 
    alignItems: 'center'
  },
  kpiLabel: { 
    color: '#64748B', 
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  kpiValue: { 
    fontWeight: '900', 
    fontSize: 24,
    letterSpacing: -1
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  navBtn: { 
    backgroundColor: '#EEF2FF', 
    padding: 10, 
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7D2FE'
  },
  monthLabelWrapper: {
    alignItems: 'center'
  },
  monthLabel: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#4F46E5',
    letterSpacing: -0.5
  },
  yearLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2
  },
  weekHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 4, 
    marginBottom: 10 
  },
  weekHeaderItem: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 10
  },
  weekHeaderText: { 
    textAlign: 'center', 
    fontWeight: '800', 
    color: '#4F46E5',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  calendarCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 16, 
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E0E7FF'
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: CELL_GAP 
  },
  cell: { 
    width: CELL_SIZE, 
    height: CELL_SIZE, 
    borderRadius: 16, 
    backgroundColor: '#F8FAFC', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E2E8F0'
  },
  cellInner: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cellSelected: { 
    borderColor: '#818CF8', 
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.05 }],
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  cellToday: {
    borderColor: '#4F46E5',
    borderWidth: 3,
    backgroundColor: '#EEF2FF'
  },
  dayText: { 
    color: '#1E293B', 
    fontWeight: '700',
    fontSize: 14
  },
  todayText: { 
    color: '#4F46E5',
    fontWeight: '900'
  },
  selectedText: {
    color: '#4F46E5'
  },
  badge: { 
    marginTop: 6, 
    width: 14, 
    height: 14, 
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  legendCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    marginTop: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E0E7FF'
  },
  legendTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#1E293B', 
    marginBottom: 16,
    letterSpacing: -0.5
  },
  legendContent: {
    gap: 12
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  legendDot: { 
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  legendText: { 
    fontSize: 15, 
    color: '#475569', 
    fontWeight: '700'
  },
});

export default StudentAttendanceCalendar;