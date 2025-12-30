import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // Add autoCapitalize prop
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  containerStyle?: ViewStyle; // Add containerStyle prop
  maxLength?: number; // Allow limiting input length
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder = '', // Default to empty string
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences', // Destructure autoCapitalize and set a default
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  containerStyle, // Destructure containerStyle
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getInputContainerStyle = (): ViewStyle => {
    return {
      borderWidth: 1,
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: disabled ? colors.gray[100] : colors.surface,
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      minHeight: multiline ? 80 : 48,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: fonts.base,
      color: disabled ? colors.gray[500] : colors.textPrimary,
      textAlignVertical: multiline ? 'top' : 'center',
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getInputContainerStyle()}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.gray[400]}
          value={value || ''}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: fonts.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: fonts.xs,
    color: colors.error,
    marginTop: 4,
  },
});

export default Input;
