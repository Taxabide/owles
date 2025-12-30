import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceByUId, fetchAttendanceList, updateAttendance } from '../../src/redux/slices/attendanceSlice';
import { RootState } from '../../src/redux/store';

const { width } = Dimensions.get('window');

export default function AdminAttendanceScreen() {
  const dispatch = useDispatch();
  const { isLoading, error, teachers = [], students = [], calendarItems = [], selectedUser } = useSelector((s: RootState) => s.attendance);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const attendanceOptions = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Half Day', value: 'half_day' }
  ] as const;
  const [tempSelection, setTempSelection] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    (dispatch as any)(fetchAttendanceByUId(''));
  }, [dispatch]);

  const getName = (u: any) => u?.u_name ?? u?.t_name ?? u?.name ?? '—';
  const getEmail = (u: any) => u?.u_email ?? u?.t_email ?? u?.email ?? '—';
  const getUId = (u: any) => String(u?.u_id ?? u?.id ?? '');
  const getPhoto = (u: any) => u?.u_profile_photo ?? u?.t_profile_photo ?? u?.profile_photo ?? u?.avatar ?? '';

  const onSelectUser = (role: 'teacher' | 'student', user: any) => {
    const u_id = getUId(user);
    if (!u_id) return;
    (dispatch as any)(fetchAttendanceList({ role, u_id }));
    setShowCalendar(true);
    setSelectedDay(toDateKey(new Date()));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    setSelectedDay(null);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDay(toDateKey(today));
  };

  const toDateKey = (d: Date | string | undefined) => {
    if (!d) return '';
    if (typeof d === 'string') return d.slice(0, 10);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const attendanceByDate = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of calendarItems) {
      const key = toDateKey(item?.date);
      if (key) map.set(key, item.status || '');
    }
    return map;
  }, [calendarItems]);

  const normalizeStatus = (status?: string): 'Present' | 'Absent' | 'Late' | 'Half' | undefined => {
    if (!status) return undefined;
    const s = status.toLowerCase().replace(/\s|-/g, '_');
    if (s.includes('present') || s === 'p') return 'Present';
    if (s.includes('absent') || s === 'a') return 'Absent';
    if (s.includes('half')) return 'Half';
    if (s.includes('late') || s === 'l') return 'Late';
    return undefined;
  };

  const statusColor = (normalized?: 'Present' | 'Absent' | 'Late' | 'Half') => {
    if (normalized === 'Present') return '#10B981';
    if (normalized === 'Absent') return '#EF4444';
    if (normalized === 'Half' || normalized === 'Late') return '#F59E0B';
    return '#E2E8F0';
  };

  const getAttendanceStats = () => {
    let present = 0, absent = 0, halfLate = 0;
    calendarItems.forEach(item => {
      const status = normalizeStatus(item?.status);
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Half' || status === 'Late') halfLate++;
    });
    return { present, absent, halfLate, total: calendarItems.length };
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = toDateKey(date);
      const rawStatus = attendanceByDate.get(key);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const normalized = normalizeStatus(rawStatus);
      const statusStyleKey = normalized ? `calendarDay${normalized}` : undefined;
      const dotColor = statusColor(normalized);
      const isSelected = selectedDay === key;
      
      days.push(
        <TouchableOpacity
          key={i}
          onPress={() => setSelectedDay(key)}
          activeOpacity={0.7}
          style={[
            styles.calendarDay,
            !isCurrentMonth && styles.calendarDayInactive,
            isToday && styles.calendarDayToday,
            statusStyleKey ? (styles as any)[statusStyleKey] : undefined,
            isSelected && styles.calendarDaySelected,
          ]}
        >
          <Text style={[
            styles.calendarDayText,
            !isCurrentMonth && styles.calendarDayTextInactive,
            isToday && styles.calendarDayTextToday
          ]}>
            {date.getDate()}
          </Text>
          {dotColor && normalized ? <View style={[styles.dayDot, { backgroundColor: dotColor }]} /> : null}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const selectedStatus = normalizeStatus(selectedDay ? attendanceByDate.get(selectedDay) : undefined);
  const stats = showCalendar && selectedUser ? getAttendanceStats() : null;

  return (
    <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
      {/* Gradient Header */}
      <View style={styles.gradientHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>📊 Attendance</Text>
            <Text style={styles.subtitle}>Manage & Track Records</Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Ionicons name="calendar-outline" size={28} color="#3B82F6" />
          </View>
        </View>
      </View>

      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Error Occurred</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : null}

      {!showCalendar && (
        <>
          {/* Status Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Half/Late</Text>
            </View>
          </View>

          {/* Teachers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="people" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.sectionTitle}>Teachers</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{teachers.length}</Text>
              </View>
            </View>
            
            <View style={styles.gridContainer}>
              {teachers.map((t, idx) => (
                <TouchableOpacity 
                  key={`t-${idx}`} 
                  style={styles.userCard} 
                  activeOpacity={0.8} 
                  onPress={() => onSelectUser('teacher', t)}
                >
                  <View style={styles.cardInner}>
                    <View style={styles.avatarSection}>
                      <View style={styles.userAvatarContainer}>
                        {getPhoto(t) ? (
                          <Image source={{ uri: String(getPhoto(t)) }} style={styles.userAvatar} />
                        ) : (
                          <View style={[styles.userAvatar, styles.avatarPlaceholder, { backgroundColor: '#3B82F6' }]}>
                            <Ionicons name="person" size={28} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                    </View>
                    
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>{getName(t)}</Text>
                      <Text style={styles.userEmail} numberOfLines={1}>{getEmail(t)}</Text>
                    </View>
                    
                    <View style={styles.actionButton}>
                      <Ionicons name="chevron-forward-circle" size={24} color="#3B82F6" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {teachers.length === 0 && (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="person-outline" size={40} color="#CBD5E1" />
                  </View>
                  <Text style={styles.emptyTitle}>{isLoading ? 'Loading...' : 'No Teachers'}</Text>
                  <Text style={styles.emptySubtitle}>No teacher records found</Text>
                </View>
              )}
            </View>
          </View>

          {/* Students Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={[styles.sectionIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="school" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.sectionTitle}>Students</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.countText, { color: '#7C3AED' }]}>{students.length}</Text>
              </View>
            </View>
            
            <View style={styles.gridContainer}>
              {students.map((s, idx) => (
                <TouchableOpacity 
                  key={`s-${idx}`} 
                  style={styles.userCard} 
                  activeOpacity={0.8} 
                  onPress={() => onSelectUser('student', s)}
                >
                  <View style={styles.cardInner}>
                    <View style={styles.avatarSection}>
                      <View style={styles.userAvatarContainer}>
                        {getPhoto(s) ? (
                          <Image source={{ uri: String(getPhoto(s)) }} style={styles.userAvatar} />
                        ) : (
                          <View style={[styles.userAvatar, styles.avatarPlaceholder, { backgroundColor: '#8B5CF6' }]}>
                            <Ionicons name="school" size={28} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                    </View>
                    
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>{getName(s)}</Text>
                      <Text style={styles.userEmail} numberOfLines={1}>{getEmail(s)}</Text>
                    </View>
                    
                    <View style={styles.actionButton}>
                      <Ionicons name="chevron-forward-circle" size={24} color="#8B5CF6" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {students.length === 0 && (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="school-outline" size={40} color="#CBD5E1" />
                  </View>
                  <Text style={styles.emptyTitle}>{isLoading ? 'Loading...' : 'No Students'}</Text>
                  <Text style={styles.emptySubtitle}>No student records found</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Calendar View */}
      {showCalendar && selectedUser && (
        <View style={styles.calendarWrapper}>
          {/* User Info Banner */}
          <View style={styles.userBanner}>
            <View style={styles.userBannerLeft}>
              <View style={styles.bannerAvatarContainer}>
                {getPhoto(selectedUser) ? (
                  <Image source={{ uri: String(getPhoto(selectedUser)) }} style={styles.bannerAvatar} />
                ) : (
                  <View style={[styles.bannerAvatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.bannerName}>{getName(selectedUser)}</Text>
                <Text style={styles.bannerEmail}>{getEmail(selectedUser)}</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          {stats && (
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.statValue}>{stats.present}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
                <Text style={styles.statValue}>{stats.absent}</Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.statValue}>{stats.halfLate}</Text>
                <Text style={styles.statLabel}>Half/Late</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          )}

          {/* Calendar Container */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <Ionicons name="chevron-back" size={22} color="#3B82F6" />
              </TouchableOpacity>

              <View style={styles.monthContainer}>
                <Text style={styles.monthText}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
                  <Ionicons name="today-outline" color="#3B82F6" size={14} />
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={22} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <View key={i} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>

            {selectedDay && (
              <View style={styles.selectedDayCard}>
                <View style={styles.selectedDayHeader}>
                  <View style={[styles.selectedDayDot, { backgroundColor: statusColor(selectedStatus) }]} />
                  <Text style={styles.selectedDayDate}>
                    {new Date(selectedDay).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
                <View style={styles.selectedDayBody}>
                  <Text style={styles.selectedDayLabel}>Status:</Text>
                  <View style={[styles.statusPill, { backgroundColor: statusColor(selectedStatus) + '20' }]}>
                    <Text style={[styles.statusPillText, { color: statusColor(selectedStatus) }]}>
                      {selectedStatus || 'No Record'}
                    </Text>
                  </View>

              <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.selectBtn}>
                <Ionicons name="create-outline" size={14} color="#0EA5E9" />
                <Text style={styles.selectBtnText}>Select Attendance</Text>
              </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Monthly Overview */}
        {stats && (
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
                <View style={styles.overviewHeaderLeft}>
                  <View style={styles.overviewIconContainer}>
                    <Ionicons name="analytics-outline" size={20} color="#0EA5E9" />
                  </View>
                  <View>
              <Text style={styles.overviewTitle}>Monthly Overview</Text>
                    <Text style={styles.overviewSubtitle}>Attendance breakdown for {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                  </View>
                </View>
              <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>{stats.total} Days</Text>
              </View>
            </View>

              <View style={styles.overviewContent}>
                <View style={styles.overviewItem}>
                  <View style={styles.overviewItemHeader}>
                    <View style={styles.overviewItemLeft}>
                <View style={[styles.overviewDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.overviewLabel}>Present</Text>
              </View>
                    <View style={styles.overviewItemRight}>
                      <Text style={styles.overviewValue}>{stats.present}</Text>
                      <Text style={styles.overviewPercentage}>
                        {stats.total ? Math.round((stats.present / stats.total) * 100) : 0}%
                      </Text>
                    </View>
            </View>
            <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { 
                      width: `${stats.total ? (stats.present / stats.total) * 100 : 0}%`, 
                      backgroundColor: '#10B981' 
                    }]} />
                  </View>
            </View>

                <View style={styles.overviewItem}>
                  <View style={styles.overviewItemHeader}>
                    <View style={styles.overviewItemLeft}>
                <View style={[styles.overviewDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.overviewLabel}>Absent</Text>
              </View>
                    <View style={styles.overviewItemRight}>
                      <Text style={styles.overviewValue}>{stats.absent}</Text>
                      <Text style={styles.overviewPercentage}>
                        {stats.total ? Math.round((stats.absent / stats.total) * 100) : 0}%
                      </Text>
                    </View>
            </View>
            <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { 
                      width: `${stats.total ? (stats.absent / stats.total) * 100 : 0}%`, 
                      backgroundColor: '#EF4444' 
                    }]} />
                  </View>
            </View>

                <View style={styles.overviewItem}>
                  <View style={styles.overviewItemHeader}>
                    <View style={styles.overviewItemLeft}>
                <View style={[styles.overviewDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.overviewLabel}>Half / Late</Text>
              </View>
                    <View style={styles.overviewItemRight}>
                      <Text style={styles.overviewValue}>{stats.halfLate}</Text>
                      <Text style={styles.overviewPercentage}>
                        {stats.total ? Math.round((stats.halfLate / stats.total) * 100) : 0}%
                      </Text>
                    </View>
            </View>
            <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { 
                      width: `${stats.total ? (stats.halfLate / stats.total) * 100 : 0}%`, 
                      backgroundColor: '#F59E0B' 
                    }]} />
                  </View>
                </View>
              </View>

              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Attendance Rate</Text>
                  <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                    {stats.total ? Math.round(((stats.present + stats.halfLate * 0.5) / stats.total) * 100) : 0}%
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Perfect Days</Text>
                  <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>{stats.present}</Text>
                </View>
            </View>
          </View>
        )}

          <TouchableOpacity onPress={() => setShowCalendar(false)} style={styles.backBtn}>
            <Ionicons name="arrow-back-circle" size={22} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Back to List</Text>
          </TouchableOpacity>

        {/* Simple Attendance Edit Modal */}
        <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.simpleModalBackdrop}>
            <View style={styles.simpleModalCard}>
              <Text style={styles.simpleModalTitle}>Edit Attendance</Text>
              
              <TouchableOpacity 
                style={styles.simpleModalSelect}
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.simpleModalSelectText}>
                  {tempSelection ? attendanceOptions.find(opt => opt.value === tempSelection)?.label || tempSelection : '-- Select Attendance --'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#334155" />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.simpleDropdownList}>
                  {attendanceOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.simpleDropdownItem}
                      onPress={() => {
                        setTempSelection(option.value);
                        setShowDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.simpleDropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity 
                style={[styles.simpleModalButton, isLoading && styles.simpleModalButtonDisabled]} 
                onPress={() => { 
                  if (tempSelection && selectedDay && selectedUser && !isLoading) {
                    (dispatch as any)(updateAttendance({ 
                      u_id: selectedUser.u_id, 
                      attendance_status: tempSelection, // tempSelection now contains the correct server value
                      date: selectedDay 
                    })).then(() => {
                      setUpdateSuccess(true);
                      setPickerVisible(false);
                      setTempSelection(null);
                      setShowDropdown(false);
                      // Hide success message after 3 seconds
                      setTimeout(() => setUpdateSuccess(false), 3000);
                    });
                  }
                }}
                disabled={!tempSelection || isLoading}
              >
                <Text style={styles.simpleModalButtonText}>
                  {isLoading ? 'Updating...' : 'Update Attendance'}
                </Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Success Message */}
        {updateSuccess && (
          <View style={styles.successMessage}>
            <View style={styles.successContent}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.successText}>Attendance updated successfully!</Text>
            </View>
          </View>
        )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 30,
  },
  
  // Header
  gradientHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: { 
    color: '#64748B', 
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error
  errorCard: { 
    margin: 20,
    backgroundColor: '#FEF2F2', 
    borderWidth: 1.5, 
    borderColor: '#FCA5A5', 
    padding: 16, 
    borderRadius: 16, 
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 4,
  },
  errorText: { 
    color: '#DC2626', 
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },

  // Legend
  legendContainer: { 
    flexDirection: 'row', 
    gap: 10,
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 12, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  legendItem: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 6, 
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  legendDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  legendText: { 
    color: '#1E293B', 
    fontWeight: '700',
    fontSize: 12,
  },

  // Section
  section: {
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  countText: {
    color: '#2563EB',
    fontWeight: '900',
    fontSize: 16,
  },

  // Grid
  gridContainer: {
    gap: 12,
  },
  userCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: { 
    fontWeight: '800', 
    color: '#0F172A',
    fontSize: 16,
    marginBottom: 4,
  },
  userEmail: { 
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: { 
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },

  // Calendar Wrapper
  calendarWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // User Banner
  userBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  userBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  bannerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  bannerEmail: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Calendar
  calendarContainer: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 18, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  calendarHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  navButton: { 
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF', 
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  monthContainer: { 
    alignItems: 'center',
  },
  monthText: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  todayBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    backgroundColor: '#EFF6FF', 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  todayBtnText: { 
    color: '#3B82F6', 
    fontWeight: '700', 
    fontSize: 12,
  },
  weekDays: { 
    flexDirection: 'row', 
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: { 
    color: '#64748B', 
    fontWeight: '800', 
    fontSize: 13,
    textTransform: 'uppercase',
  },
  calendarGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarDay: { 
    flexBasis: '14.28%',
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  calendarDayInactive: { 
    backgroundColor: '#F8FAFC',
    opacity: 0.4,
  },
  calendarDayToday: { 
    borderColor: '#3B82F6', 
    borderWidth: 2.5,
    backgroundColor: '#EFF6FF',
  },
  calendarDaySelected: { 
    transform: [{ scale: 0.92 }], 
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    borderColor: '#3B82F6',
    borderWidth: 2.5,
    backgroundColor: '#DBEAFE',
  },
  calendarDayPresent: { 
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  calendarDayAbsent: { 
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  calendarDayLate: { 
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  calendarDayHalf: { 
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  calendarDayText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#0F172A',
  },
  calendarDayTextInactive: { 
    color: '#CBD5E1',
  },
  calendarDayTextToday: { 
    color: '#3B82F6', 
    fontWeight: '900',
  },
  dayDot: { 
    position: 'absolute', 
    bottom: 4, 
    width: 6, 
    height: 6, 
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  
  // Selected Day Card
  selectedDayCard: { 
    marginTop: 16, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0',
  },
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  selectedDayDot: { 
    width: 14, 
    height: 14, 
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedDayDate: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedDayBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedDayLabel: { 
    color: '#64748B', 
    fontWeight: '700',
    fontSize: 14,
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusPillText: {
    fontWeight: '800',
    fontSize: 14,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  selectBtnText: {
    color: '#0284C7',
    fontWeight: '800',
    fontSize: 12,
  },
  
  // Back Button
  backBtn: { 
    marginTop: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    backgroundColor: '#3B82F6', 
    paddingVertical: 16, 
    borderRadius: 16, 
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  backBtnText: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 16,
    letterSpacing: 0.3,
  },
  overviewCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  overviewIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  overviewSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  overviewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignSelf: 'flex-start',
  },
  overviewBadgeText: {
    color: '#0284C7',
    fontWeight: '800',
    fontSize: 12,
  },
  overviewContent: {
    gap: 16,
  },
  overviewItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overviewItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  overviewItemRight: {
    alignItems: 'flex-end',
  },
  overviewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  overviewLabel: {
    color: '#1E293B',
    fontWeight: '800',
    fontSize: 14,
  },
  overviewValue: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 2,
  },
  overviewPercentage: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 12,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontWeight: '900',
    fontSize: 20,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  userAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
  },
  userAvatar: { 
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  bannerAvatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    lineHeight: 18,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalContent: {
    padding: 20,
  },
  modalSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  modalSelectText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  modalList: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemSelected: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalItemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalItemText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
  modalItemTextSelected: {
    color: '#0EA5E9',
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#F8FAFC',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  modalBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  modalBtnPrimary: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBtnTextSecondary: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 14,
  },
  modalBtnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  // Simple Modal Styles
  simpleModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  simpleModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  simpleModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  simpleModalSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  simpleModalSelectText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  simpleDropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  simpleDropdownItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  simpleModalButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  simpleModalButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  successMessage: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  successText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 14,
  },
});