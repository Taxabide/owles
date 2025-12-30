import { addLectureThunk } from '@/redux/slices/lectureSlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';

interface Props {
  courseId: number;
  courseName: string;
}

const AdminAddLecture: React.FC<Props> = ({ courseId, courseName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const creating = useSelector((s: RootState) => s.lectures.creating);

  const statusOptions = useMemo(() => ([
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]), []);

  const validate = () => {
    if (!link.trim()) return 'Course link is required';
    if (!status) return 'Please select status';
    if (!description.trim()) return 'Description is required';
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validation', err);
      return;
    }
    try {
      setSubmitting(true);
      await dispatch(addLectureThunk({
        course_id: courseId,
        link: link.trim(),
        status: status as 'active' | 'inactive',
        description: description.trim(),
      })).unwrap();
      Alert.alert('Success', 'Lecture created successfully');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Lecture Form</Text>

        {/* Course */}
        <View style={styles.field}> 
          <Text style={styles.label}>Course</Text>
          <View style={[styles.readonlyInput]}> 
            <Ionicons name="book-outline" size={18} color="#9E9E9E" />
            <Text style={styles.readonlyText}>{courseName}</Text>
          </View>
        </View>

        {/* Course Link */}
        <View style={styles.field}> 
          <Text style={styles.label}>Course Link</Text>
          <View style={styles.inputWrap}> 
            <Ionicons name="link-outline" size={18} color="#9E9E9E" />
            <TextInput
              placeholder="https://example.com"
              value={link}
              onChangeText={setLink}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}> 
          <Text style={styles.label}>Status</Text>
          <View style={styles.dropdownWrap}>
            <Dropdown
              data={statusOptions}
              value={status}
              labelField="label"
              valueField="value"
              placeholder="Select Status"
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownText}
              onChange={(item) => setStatus(item.value)}
              renderLeftIcon={() => <Ionicons name="radio-button-on-outline" size={18} color="#9E9E9E" style={{ marginRight: 8 }} />}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}> 
          <Text style={styles.label}>Description</Text>
          <View style={styles.textareaWrap}>
            <TextInput
              placeholder="Write your content here..."
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.textarea}
            />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit} activeOpacity={0.85} disabled={submitting}>
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
          <Ionicons name="send-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '800', color: '#263238', marginBottom: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: '#546E7A', fontWeight: '600', marginBottom: 8 },
  readonlyInput: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#F5F5F5', minHeight: 48 },
  readonlyText: { color: '#263238', fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#FAFAFA' },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#263238' },
  dropdownWrap: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 8, backgroundColor: '#FAFAFA' },
  dropdown: { height: 48 },
  dropdownPlaceholder: { color: '#9E9E9E', fontSize: 14 },
  dropdownText: { color: '#263238', fontSize: 14 },
  textareaWrap: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, backgroundColor: '#FAFAFA' },
  textarea: { minHeight: 160, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#263238', textAlignVertical: 'top' },
  submitButton: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF8F00', borderRadius: 10, paddingVertical: 14, marginTop: 8 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default AdminAddLecture;


