import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { addCourseThunk } from '../../redux/slices/AddCourseSlice';
import { fetchCategoriesAsync } from '../../redux/slices/categorySlice';
import type { AppDispatch, RootState } from '../../redux/store';
import AdminNavbar from './AdminNavbar';

const { width } = Dimensions.get('window');

interface ValidationErrors {
  title?: string;
  category?: string;
  code?: string;
  description?: string;
  image?: string;
}

const AdminAddCourse: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const creating = useSelector((s: RootState) => s.addCourse.creating);
  const createError = useSelector((s: RootState) => s.addCourse.error);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  const apiCategories = useSelector((s: RootState) => s.categories.categories);
  const categoriesLoading = useSelector((s: RootState) => s.categories.isLoading);

  useEffect(() => {
    if (!apiCategories || apiCategories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
  }, []);

  const categories = useMemo(
    () => (apiCategories || []).map((c: any) => ({ label: c.c_name, value: String(c.c_id) })),
    [apiCategories]
  );

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category';
    }

    // Code validation (required only, no format or length restrictions)
    if (!code.trim()) {
      newErrors.code = 'Course code is required';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    } else if (description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Image validation
    if (!imageUri) {
      newErrors.image = 'Course image is required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      shakeAnimation();
      return false;
    }
    
    return true;
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setCategory(null);
    setCode('');
    setDescription('');
    setImageUri(null);
    setErrors({});
    setFocused(null);
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await dispatch(addCourseThunk({
        course_name: title.trim(),
        course_c_id: Number(category as string),
        course_code: code.trim(),
        course_image: imageUri || undefined,
        course_description: description.trim(),
      })).unwrap();
      
      Alert.alert(
        'Success! 🎉',
        'Course has been created successfully!',
        [
          {
            text: 'Create Another',
            onPress: clearForm,
            style: 'default'
          },
          {
            text: 'Done',
            style: 'cancel'
          }
            ]
      );
    } catch (error) {
      Alert.alert('Error', (createError as string) || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: clearForm }
      ]
    );
  };

  const renderField = (
    label: string,
    children: React.ReactNode,
    error?: string,
    required = true
  ) => (
    <Animated.View 
      style={[
        styles.field, 
        error && styles.fieldError,
        { transform: [{ translateX: shake }] }
      ]}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={12} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
      {children}
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AdminNavbar 
        isMenuOpen={false}
        onMenuPress={() => {}}
        onProfilePress={() => {}}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="add-circle" size={24} color="#FF8F00" />
          </View>
          <Text style={styles.title}>Create New Course</Text>
          <Text style={styles.subtitle}>Fill in the details below to add a new course</Text>
        </View>

        <View style={styles.card}>
          {/* Course Name */}
          {renderField('Course Name', (
            <View style={[
              styles.inputWrapper, 
              focused === 'name' && styles.inputWrapperFocused,
              errors.title && styles.inputWrapperError
            ]}> 
              <Ionicons name="book-outline" size={18} color={errors.title ? '#F44336' : '#999'} />
              <TextInput
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                }}
                placeholder="Enter course name"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                style={styles.input}
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>
          ), errors.title)}

          {/* Course Category */}
          {renderField('Course Category', (
            <View style={[
              styles.dropdownWrapper, 
              focused === 'category' && styles.inputWrapperFocused,
              errors.category && styles.inputWrapperError
            ]}>
              <Dropdown
                data={categories}
                value={category}
                labelField="label"
                valueField="value"
                placeholder="Select a category"
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItem}
                onFocus={() => setFocused('category')}
                onBlur={() => setFocused(null)}
                onChange={(item) => {
                  setCategory(item.value);
                  if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                }}
                renderLeftIcon={() => (
                  <Ionicons 
                    name="albums-outline" 
                    size={18} 
                    color={errors.category ? '#F44336' : '#999'} 
                    style={{ marginRight: 8 }} 
                  />
                )}
              />
            </View>
          ), errors.category)}

          {/* Course Code */}
          {renderField('Course Code', (
            <View style={[
              styles.inputWrapper, 
              focused === 'code' && styles.inputWrapperFocused,
              errors.code && styles.inputWrapperError
            ]}> 
              <Ionicons name="barcode-outline" size={18} color={errors.code ? '#F44336' : '#999'} />
              <TextInput
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (errors.code) setErrors(prev => ({ ...prev, code: undefined }));
                }}
                placeholder="Enter course code (any format)"
                onFocus={() => setFocused('code')}
                onBlur={() => setFocused(null)}
                style={styles.input}
              />
            </View>
          ), errors.code)}

          {/* Upload Image */}
          {renderField('Course Image', (
            <View>
              <TouchableOpacity 
                style={[
                  styles.uploadButton,
                  errors.image && styles.uploadButtonError
                ]} 
                onPress={pickImage} 
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="cloud-upload-outline" 
                  size={20} 
                  color={errors.image ? '#F44336' : '#1E88E5'} 
                />
                <Text style={[
                  styles.uploadText,
                  errors.image && styles.uploadTextError
                ]}>
                  {imageUri ? 'Change Image' : 'Choose Image'}
                </Text>
              </TouchableOpacity>
              
              {imageUri && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageName}>Course Image</Text>
                    <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeButton}>
                      <Ionicons name="trash-outline" size={16} color="#F44336" />
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ), errors.image)}

          {/* Description */}
          {renderField('Course Description', (
            <View style={[
              styles.textareaWrapper, 
              focused === 'desc' && styles.inputWrapperFocused,
              errors.description && styles.inputWrapperError
            ]}> 
              <TextInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                }}
                placeholder="Provide a detailed description of the course content, objectives, and what students will learn..."
                multiline
                onFocus={() => setFocused('desc')}
                onBlur={() => setFocused(null)}
                style={styles.textarea}
                maxLength={500}
              />
              <View style={styles.textareaFooter}>
                <Text style={styles.characterCount}>{description.length}/500</Text>
              </View>
            </View>
          ), errors.description)}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                isSubmitting && styles.primaryButtonDisabled
              ]} 
              onPress={onSubmit} 
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Ionicons 
                name={isSubmitting ? "hourglass-outline" : "save-outline"} 
                size={18} 
                color="#fff" 
              />
              <Text style={styles.primaryButtonText}>{isSubmitting || creating ? 'Creating...' : 'Create Course'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={onCancel}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Ionicons name="close-outline" size={18} color="#607D8B" />
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#263238',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  field: {
    marginBottom: 20,
  },
  fieldError: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#37474F',
    fontWeight: '600',
    marginBottom: 4,
  },
  required: {
    color: '#F44336',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E8EAF0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFBFC',
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: '#FF8F00',
    backgroundColor: '#FFF8F0',
  },
  inputWrapperError: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#263238',
    fontWeight: '500',
  },
  characterCount: {
    fontSize: 11,
    color: '#90A4AE',
    fontWeight: '500',
  },
  dropdownWrapper: {
    borderWidth: 2,
    borderColor: '#E8EAF0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  dropdown: {
    height: 52,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderColor: '#E8EAF0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: '#90A4AE',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownText: {
    color: '#263238',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownItem: {
    fontSize: 15,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#BBDEFB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  uploadButtonError: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  uploadText: {
    color: '#1E88E5',
    fontWeight: '600',
    fontSize: 15,
  },
  uploadTextError: {
    color: '#F44336',
  },
  imagePreview: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAF0',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  imageInfo: {
    flex: 1,
  },
  imageName: {
    fontSize: 14,
    color: '#37474F',
    fontWeight: '600',
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  removeText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  textareaWrapper: {
    borderWidth: 2,
    borderColor: '#E8EAF0',
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
  },
  textarea: {
    minHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    color: '#263238',
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF8F00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#FF8F00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#FFB74D',
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8EAF0',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#607D8B',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AdminAddCourse;